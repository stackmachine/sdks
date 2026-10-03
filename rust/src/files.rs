use crate::{
    Error, Result, StackMachine,
    client::{retry_delay, validate_url},
    error::retryable_status,
    operations,
};
use serde_json::json;
use std::{
    collections::HashSet,
    io::{Cursor, Write},
};
use zip::{CompressionMethod, ZipWriter, write::SimpleFileOptions};

/// ZIP files are built in memory. Paths must be unique, relative POSIX paths.
pub fn create_zip<I, N, B>(files: I) -> Result<Vec<u8>>
where
    I: IntoIterator<Item = (N, B)>,
    N: AsRef<str>,
    B: AsRef<[u8]>,
{
    let mut archive = ZipWriter::new(Cursor::new(Vec::new()));
    let options = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);
    let mut names = HashSet::new();
    for (name, contents) in files {
        let name = name.as_ref();
        if name.is_empty()
            || name.contains(['\\', '\0', ':'])
            || name.split('/').any(|part| matches!(part, "" | "." | ".."))
        {
            return Err(Error::Validation(
                "ZIP entry names must be relative POSIX paths without traversal".into(),
            ));
        }
        if !names.insert(name.to_owned()) {
            return Err(Error::Validation(format!("duplicate ZIP entry: {name}")));
        }
        archive.start_file(name, options)?;
        archive.write_all(contents.as_ref())?;
    }
    Ok(archive.finish()?.into_inner())
}

#[derive(Clone, Debug)]
pub struct UploadOptions {
    pub chunk_size: usize,
}

impl Default for UploadOptions {
    fn default() -> Self {
        Self {
            chunk_size: 1024 * 1024,
        }
    }
}

#[derive(Clone, Copy, Debug)]
pub struct UploadProgress {
    pub loaded: usize,
    pub total: usize,
    /// Fraction between 0 and 1.
    pub percent: f64,
}

impl UploadProgress {
    fn new(loaded: usize, total: usize) -> Self {
        Self {
            loaded,
            total,
            percent: if total == 0 {
                1.0
            } else {
                loaded as f64 / total as f64
            },
        }
    }
}

#[derive(Clone, Copy)]
pub struct Files<'a> {
    client: &'a StackMachine,
}

impl StackMachine {
    pub fn files(&self) -> Files<'_> {
        Files { client: self }
    }
}

impl Files<'_> {
    /// Upload ZIP bytes and return the signed URL accepted by deployments.
    pub async fn upload(&self, bytes: &[u8]) -> Result<String> {
        self.upload_with_options(bytes, UploadOptions::default(), |_| {})
            .await
    }

    pub async fn upload_with_options(
        &self,
        bytes: &[u8],
        options: UploadOptions,
        mut on_progress: impl FnMut(UploadProgress),
    ) -> Result<String> {
        if options.chunk_size == 0 || options.chunk_size > 512 * 1024 * 1024 {
            return Err(Error::Validation(
                "upload chunk_size must be between 1 and 512 MiB".into(),
            ));
        }
        let signed_url: String = self
            .client
            .read(
                operations::UPLOAD_QUERY,
                json!({"filename": format!("{}.zip", uuid::Uuid::new_v4())}),
                "/getSignedUrl/url",
            )
            .await?;
        let signed = validate_url(&signed_url)?;
        on_progress(UploadProgress::new(0, bytes.len()));
        let response = self
            .request(|| {
                self.client
                    .upload_http()
                    .post(signed.clone())
                    .header("Content-Type", "application/octet-stream")
                    .header("x-goog-resumable", "start")
                    .header("Content-Length", "0")
                    .body(Vec::new())
            })
            .await?;
        let location = response
            .headers()
            .get("location")
            .and_then(|value| value.to_str().ok())
            .ok_or_else(|| {
                Error::InvalidResponse("upload initiation is missing the Location header".into())
            })?;
        let upload_url = validate_url(location)?;
        if bytes.is_empty() {
            let response = self
                .request(|| {
                    self.client
                        .upload_http()
                        .put(upload_url.clone())
                        .header("Content-Type", "application/octet-stream")
                        .header("Content-Range", "bytes */0")
                        .body(Vec::new())
                })
                .await?;
            if !response.status().is_success() {
                return Err(Error::InvalidResponse(
                    "empty upload did not complete".into(),
                ));
            }
            return Ok(signed_url);
        }
        let mut start = 0;
        while start < bytes.len() {
            let end = (start + options.chunk_size).min(bytes.len());
            let response = self
                .request(|| {
                    self.client
                        .upload_http()
                        .put(upload_url.clone())
                        .header("Content-Type", "application/octet-stream")
                        .header(
                            "Content-Range",
                            format!("bytes {start}-{}/{total}", end - 1, total = bytes.len()),
                        )
                        .body(bytes[start..end].to_vec())
                })
                .await?;
            if response.status().as_u16() == 308 {
                let acknowledged = response
                    .headers()
                    .get("range")
                    .and_then(|value| value.to_str().ok())
                    .and_then(|value| value.strip_prefix("bytes=0-"))
                    .and_then(|value| value.parse::<usize>().ok())
                    .and_then(|value| value.checked_add(1))
                    .ok_or_else(|| {
                        Error::InvalidResponse(
                            "upload acknowledgement is missing a valid Range header".into(),
                        )
                    })?;
                if acknowledged <= start || acknowledged > end {
                    return Err(Error::InvalidResponse(
                        "upload acknowledgement did not advance within the sent chunk".into(),
                    ));
                }
                if acknowledged == bytes.len() {
                    return Err(Error::InvalidResponse(
                        "upload acknowledged all bytes without completing".into(),
                    ));
                }
                start = acknowledged;
                on_progress(UploadProgress::new(start, bytes.len()));
            } else {
                if end != bytes.len() {
                    return Err(Error::InvalidResponse(
                        "upload completed before all bytes were sent".into(),
                    ));
                }
                on_progress(UploadProgress::new(bytes.len(), bytes.len()));
                return Ok(signed_url);
            }
        }
        Err(Error::InvalidResponse("upload did not complete".into()))
    }

    async fn request(
        &self,
        build: impl Fn() -> reqwest::RequestBuilder,
    ) -> Result<reqwest::Response> {
        let retries = self.client.request_retries();
        for attempt in 0..=retries {
            let response = build().timeout(self.client.request_timeout()).send().await;
            match response {
                Ok(response) => {
                    if response.status().is_success() || response.status().as_u16() == 308 {
                        return Ok(response);
                    }
                    if attempt < retries && retryable_status(response.status().as_u16()) {
                        let after = response
                            .headers()
                            .get("retry-after")
                            .and_then(|value| value.to_str().ok())
                            .and_then(|value| value.parse::<u64>().ok());
                        retry_delay(attempt, after).await;
                        continue;
                    }
                    return Err(Error::InvalidResponse(format!(
                        "upload failed with HTTP status {}",
                        response.status()
                    )));
                }
                Err(error) => {
                    if attempt < retries && (error.is_connect() || error.is_timeout()) {
                        retry_delay(attempt, None).await;
                        continue;
                    }
                    return Err(Error::Connection(error.without_url()));
                }
            }
        }
        unreachable!("every upload loop returns a result")
    }
}
