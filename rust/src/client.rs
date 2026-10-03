use crate::{ApiError, Error, ErrorKind, GraphQLError, Result, models::Viewer, operations};
use reqwest::{
    Url,
    header::{AUTHORIZATION, HeaderMap, HeaderValue},
};
use serde::{Serialize, de::DeserializeOwned};
use serde_json::{Value, json};
use std::{fmt, sync::Arc, time::Duration};

pub const DEFAULT_API_URL: &str = "https://api.stackmachine.com/graphql";

/// Overrides apply to every request made through `StackMachine::with_options`.
#[derive(Clone, Default)]
pub struct RequestOptions {
    pub api_key: Option<String>,
    pub headers: HeaderMap,
    pub timeout: Option<Duration>,
    pub max_network_retries: Option<u32>,
    /// Sent as `input.clientMutationId`. Conflicting values are rejected.
    pub idempotency_key: Option<String>,
}

impl fmt::Debug for RequestOptions {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("RequestOptions")
            .field("timeout", &self.timeout)
            .field("max_network_retries", &self.max_network_retries)
            .finish_non_exhaustive()
    }
}

struct Inner {
    api_key: HeaderValue,
    api_url: Url,
    http: reqwest::Client,
    upload_http: reqwest::Client,
    headers: HeaderMap,
    timeout: Duration,
    max_network_retries: u32,
}

/// Cheaply cloneable async client backed by a shared HTTP connection pool.
#[derive(Clone)]
pub struct StackMachine {
    inner: Arc<Inner>,
    options: RequestOptions,
}

impl fmt::Debug for StackMachine {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("StackMachine")
            .field("api_url", &self.inner.api_url)
            .field("timeout", &self.inner.timeout)
            .field("max_network_retries", &self.inner.max_network_retries)
            .finish_non_exhaustive()
    }
}

pub struct ClientBuilder {
    api_key: String,
    api_url: String,
    headers: HeaderMap,
    timeout: Duration,
    max_network_retries: u32,
    http: Option<reqwest::Client>,
}

impl ClientBuilder {
    pub fn api_url(mut self, url: impl Into<String>) -> Self {
        self.api_url = url.into();
        self
    }

    pub fn headers(mut self, headers: HeaderMap) -> Self {
        self.headers = headers;
        self
    }

    pub fn timeout(mut self, timeout: Duration) -> Self {
        self.timeout = timeout;
        self
    }

    pub fn max_network_retries(mut self, retries: u32) -> Self {
        self.max_network_retries = retries;
        self
    }

    pub fn http_client(mut self, client: reqwest::Client) -> Self {
        self.http = Some(client);
        self
    }

    pub fn build(self) -> Result<StackMachine> {
        validate_timeout(self.timeout)?;
        let api_url = validate_url(&self.api_url)?;
        let api_key = authorization(&self.api_key)?;
        let build_http = || {
            reqwest::Client::builder()
                .redirect(reqwest::redirect::Policy::none())
                .retry(reqwest::retry::never())
                .user_agent(concat!("stackmachine-rust/", env!("CARGO_PKG_VERSION")))
                .build()
                .map_err(|error| Error::Connection(error.without_url()))
        };
        Ok(StackMachine {
            inner: Arc::new(Inner {
                api_key,
                api_url,
                http: match self.http {
                    Some(http) => http,
                    None => build_http()?,
                },
                // A separate client prevents API credentials and custom default
                // headers from being forwarded to signed storage URLs.
                upload_http: build_http()?,
                headers: self.headers,
                timeout: self.timeout,
                max_network_retries: self.max_network_retries,
            }),
            options: RequestOptions::default(),
        })
    }
}

impl StackMachine {
    pub fn new(api_key: impl Into<String>) -> Result<Self> {
        Self::builder(api_key).build()
    }

    pub fn builder(api_key: impl Into<String>) -> ClientBuilder {
        ClientBuilder {
            api_key: api_key.into(),
            api_url: DEFAULT_API_URL.into(),
            headers: HeaderMap::new(),
            timeout: Duration::from_secs(80),
            max_network_retries: 1,
            http: None,
        }
    }

    /// Returns a client sharing the connection pool, with new request overrides.
    pub fn with_options(&self, options: RequestOptions) -> Self {
        Self {
            inner: self.inner.clone(),
            options,
        }
    }

    pub fn api_url(&self) -> &Url {
        &self.inner.api_url
    }

    pub async fn viewer(&self) -> Result<Viewer> {
        self.read(operations::VIEWER_QUERY, json!({}), "/viewer")
            .await
    }

    /// Execute a custom GraphQL operation and deserialize its `data` object.
    /// GraphQL errors are returned even when the response includes partial data.
    /// Read queries retry transient failures; mutations are sent once.
    pub async fn graphql<T: DeserializeOwned>(
        &self,
        query: &str,
        variables: impl Serialize,
    ) -> Result<T> {
        let mut variables = serde_json::to_value(variables)?;
        if !variables.is_object() {
            return Err(Error::Validation(
                "GraphQL variables must be an object".into(),
            ));
        }
        if let Some(key) = &self.options.idempotency_key {
            if key.is_empty() {
                return Err(Error::Validation("idempotency_key cannot be empty".into()));
            }
            if let Some(input) = variables.get_mut("input").and_then(Value::as_object_mut) {
                if input
                    .get("clientMutationId")
                    .is_some_and(|value| !value.is_null() && value != key)
                {
                    return Err(Error::Validation(
                        "input.clientMutationId must match idempotency_key".into(),
                    ));
                }
                input.insert("clientMutationId".into(), json!(key));
            }
        }
        let timeout = self.request_timeout();
        validate_timeout(timeout)?;
        let mut headers = self.inner.headers.clone();
        headers.extend(self.options.headers.clone());
        headers.insert(
            AUTHORIZATION,
            match &self.options.api_key {
                Some(key) => authorization(key)?,
                None => self.inner.api_key.clone(),
            },
        );
        let operation_name = operation_name(query);
        let body =
            json!({ "query": query, "variables": variables, "operationName": operation_name });
        let document = strip_comments(query);
        let read_only = document.starts_with("query") || document.starts_with('{');
        let retries = if read_only { self.request_retries() } else { 0 };
        for attempt in 0..=retries {
            let response = self
                .inner
                .http
                .post(self.inner.api_url.clone())
                .headers(headers.clone())
                .header("Accept", "application/json")
                .timeout(timeout)
                .json(&body)
                .send()
                .await;
            let response = match response {
                Ok(response) => response,
                Err(error) => {
                    if attempt < retries && (error.is_connect() || error.is_timeout()) {
                        retry_delay(attempt, None).await;
                        continue;
                    }
                    return Err(Error::Connection(error.without_url()));
                }
            };
            let status = response.status().as_u16();
            let request_id = response
                .headers()
                .get("x-request-id")
                .or_else(|| response.headers().get("x-stackmachine-request-id"))
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned);
            let retry_after = response
                .headers()
                .get("retry-after")
                .and_then(|value| value.to_str().ok())
                .and_then(|value| value.parse::<u64>().ok());
            if attempt < retries && crate::error::retryable_status(status) {
                retry_delay(attempt, retry_after).await;
                continue;
            }
            let bytes = match response.bytes().await {
                Ok(bytes) => bytes,
                Err(error) => {
                    if attempt < retries && (error.is_body() || error.is_timeout()) {
                        retry_delay(attempt, None).await;
                        continue;
                    }
                    return Err(Error::Connection(error.without_url()));
                }
            };
            let parsed = serde_json::from_slice::<Value>(&bytes);
            let success = (200..300).contains(&status);
            let body = match parsed {
                Ok(body) => body,
                Err(_) if !success => json!({"message": String::from_utf8_lossy(&bytes)}),
                Err(_) => return Err(Error::InvalidResponse("API did not return JSON".into())),
            };
            let errors: Vec<GraphQLError> = match body.get("errors") {
                None | Some(Value::Null) => Vec::new(),
                Some(errors) => serde_json::from_value(errors.clone())?,
            };
            if !success || !errors.is_empty() {
                let code = errors
                    .first()
                    .and_then(|error| error.extensions.get("code"))
                    .or_else(|| body.pointer("/error/code"))
                    .or_else(|| body.get("code"))
                    .and_then(Value::as_str)
                    .map(str::to_owned);
                let kind = match (status, code.as_deref()) {
                    (401, _) | (_, Some("UNAUTHENTICATED" | "authentication_error")) => {
                        ErrorKind::Authentication
                    }
                    (403, _) | (_, Some("FORBIDDEN" | "permission_error")) => ErrorKind::Permission,
                    (429, _) | (_, Some("RATE_LIMITED" | "rate_limit_error")) => {
                        ErrorKind::RateLimit
                    }
                    (404, _) | (_, Some("NOT_FOUND" | "resource_missing")) => ErrorKind::NotFound,
                    (400..=499, _) => ErrorKind::InvalidRequest,
                    _ if !errors.is_empty() => ErrorKind::GraphQL,
                    _ => ErrorKind::Api,
                };
                let message = errors
                    .first()
                    .map(|error| error.message.clone())
                    .or_else(|| {
                        body.pointer("/error/message")
                            .or_else(|| body.get("message"))
                            .and_then(Value::as_str)
                            .map(str::to_owned)
                    })
                    .unwrap_or_else(|| {
                        format!("StackMachine API request failed with status {status}")
                    });
                return Err(Box::new(ApiError {
                    kind,
                    message,
                    status_code: Some(status),
                    request_id,
                    operation_name: operation_name.map(str::to_owned),
                    code,
                    graphql_errors: errors,
                    partial_data: body.get("data").cloned(),
                })
                .into());
            }
            let data = body
                .get("data")
                .filter(|data| !data.is_null())
                .ok_or_else(|| Error::InvalidResponse("GraphQL response is missing data".into()))?;
            return Ok(serde_json::from_value(data.clone())?);
        }
        unreachable!("every request loop returns a result")
    }

    pub(crate) async fn read<T: DeserializeOwned>(
        &self,
        query: &str,
        variables: Value,
        pointer: &str,
    ) -> Result<T> {
        let data: Value = self.graphql(query, variables).await?;
        let value = data
            .pointer(pointer)
            .filter(|value| !value.is_null())
            .ok_or_else(|| Error::missing("resource", pointer))?;
        Ok(serde_json::from_value(value.clone())?)
    }

    pub(crate) async fn mutation<T: DeserializeOwned>(
        &self,
        query: &str,
        input: impl Serialize,
        pointer: &str,
    ) -> Result<T> {
        let data: Value = self.graphql(query, json!({"input": input})).await?;
        // Payloads without a `success` field report failure through GraphQL errors.
        let root = pointer.split('/').nth(1).unwrap_or_default();
        if data.get(root).and_then(|payload| payload.get("success")) == Some(&Value::Bool(false)) {
            return Err(Error::InvalidResponse(format!(
                "{root} returned success=false"
            )));
        }
        let value = data
            .pointer(pointer)
            .filter(|value| !value.is_null())
            .ok_or_else(|| Error::InvalidResponse(format!("Mutation is missing {pointer}")))?;
        Ok(serde_json::from_value(value.clone())?)
    }

    pub(crate) async fn delete(
        &self,
        query: &str,
        input: impl Serialize,
        field: &str,
    ) -> Result<()> {
        let success: bool = self
            .mutation(query, input, &format!("/{field}/success"))
            .await?;
        if !success {
            return Err(Error::InvalidResponse(format!(
                "{field} returned success=false"
            )));
        }
        Ok(())
    }

    pub(crate) fn request_timeout(&self) -> Duration {
        self.options.timeout.unwrap_or(self.inner.timeout)
    }

    pub(crate) fn request_retries(&self) -> u32 {
        self.options
            .max_network_retries
            .unwrap_or(self.inner.max_network_retries)
    }

    pub(crate) fn upload_http(&self) -> &reqwest::Client {
        &self.inner.upload_http
    }
}

fn authorization(key: &str) -> Result<HeaderValue> {
    if key.trim().is_empty() {
        return Err(Error::Validation("api_key cannot be empty".into()));
    }
    let mut value = HeaderValue::from_str(&format!("Bearer {key}"))
        .map_err(|_| Error::Validation("api_key is not a valid HTTP header value".into()))?;
    value.set_sensitive(true);
    Ok(value)
}

pub(crate) fn validate_url(value: &str) -> Result<Url> {
    let url = Url::parse(value)
        .map_err(|_| Error::Validation("URL must be an absolute HTTP(S) URL".into()))?;
    if !matches!(url.scheme(), "http" | "https")
        || url.host_str().is_none()
        || !url.username().is_empty()
        || url.password().is_some()
    {
        return Err(Error::Validation(
            "URL must be an absolute HTTP(S) URL without embedded credentials".into(),
        ));
    }
    Ok(url)
}

fn validate_timeout(timeout: Duration) -> Result<()> {
    if timeout.is_zero() {
        return Err(Error::Validation(
            "timeout must be greater than zero".into(),
        ));
    }
    Ok(())
}

fn operation_name(query: &str) -> Option<&str> {
    let query = strip_comments(query);
    let keyword_end = query.find(|character: char| !character.is_ascii_alphabetic())?;
    if !matches!(&query[..keyword_end], "query" | "mutation" | "subscription") {
        return None;
    }
    let tail = query[keyword_end..].trim_start();
    if !tail.starts_with(|character: char| character.is_ascii_alphabetic() || character == '_') {
        return None;
    }
    let name_end = tail
        .find(|character: char| !character.is_ascii_alphanumeric() && character != '_')
        .unwrap_or(tail.len());
    Some(&tail[..name_end])
}

fn strip_comments(mut query: &str) -> &str {
    loop {
        query = query.trim_start();
        if !query.starts_with('#') {
            return query;
        }
        query = query.split_once('\n').map_or("", |(_, tail)| tail);
    }
}

pub(crate) async fn retry_delay(attempt: u32, retry_after: Option<u64>) {
    let delay = retry_after
        .map(|seconds| Duration::from_secs(seconds.min(60)))
        .unwrap_or_else(|| Duration::from_millis(100 * (1_u64 << attempt.min(5))));
    tokio::time::sleep(delay).await;
}
