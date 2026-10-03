use crate::{
    Error, Result, StackMachine, create_zip, inputs::DeployViaAutobuildInput, models::AppVersion,
    operations as gql,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::Duration;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Deployment {
    pub build_id: String,
    pub status: Option<String>,
    pub app_version: Option<AppVersion>,
}

#[derive(Clone, Copy, Debug)]
pub struct WaitOptions {
    pub timeout: Duration,
    pub poll_interval: Duration,
}

impl Default for WaitOptions {
    fn default() -> Self {
        Self {
            timeout: Duration::from_secs(600),
            poll_interval: Duration::from_secs(1),
        }
    }
}

#[derive(Clone, Copy)]
pub struct Deployments<'a> {
    client: &'a StackMachine,
}

impl StackMachine {
    pub fn deployments(&self) -> Deployments<'_> {
        Deployments { client: self }
    }
}

impl Deployments<'_> {
    pub async fn create(&self, input: &DeployViaAutobuildInput) -> Result<Deployment> {
        self.client
            .mutation(gql::AUTOBUILD_MUTATION, input, "/deployViaAutobuild")
            .await
    }

    /// Package source files, upload the ZIP, and start a deployment.
    pub async fn create_from_files<I, N, B>(
        &self,
        input: &DeployViaAutobuildInput,
        files: I,
    ) -> Result<Deployment>
    where
        I: IntoIterator<Item = (N, B)>,
        N: AsRef<str>,
        B: AsRef<[u8]>,
    {
        if input.upload_url.is_some() {
            return Err(Error::Validation(
                "files cannot be supplied with upload_url".into(),
            ));
        }
        let bytes = create_zip(files)?;
        let mut input = input.clone();
        input.upload_url = Some(self.client.files().upload(&bytes).await?);
        self.create(&input).await
    }

    pub async fn retrieve(&self, build_id: &str) -> Result<Deployment> {
        self.client
            .read(
                gql::GET_DEPLOYMENT_STATUS_QUERY,
                json!({"buildId": build_id}),
                "/autobuildDeploymentStatus",
            )
            .await
    }

    /// Poll the HTTP status endpoint until success, failure, or the overall timeout.
    /// Dropping this future cancels the wait and any request in progress.
    pub async fn wait(&self, build_id: &str, options: WaitOptions) -> Result<AppVersion> {
        if options.timeout.is_zero() || options.poll_interval.is_zero() {
            return Err(Error::Validation(
                "deployment timeout and poll_interval must be greater than zero".into(),
            ));
        }
        let poll = async {
            loop {
                let deployment = self.retrieve(build_id).await?;
                match deployment.status.as_deref() {
                    Some("SUCCESS") => {
                        return deployment.app_version.ok_or_else(|| {
                            Error::InvalidResponse(
                                "successful deployment is missing appVersion".into(),
                            )
                        });
                    }
                    Some(status @ ("CANCELLED" | "FAILED" | "INTERNAL_ERROR" | "TIMEOUT")) => {
                        return Err(Error::DeploymentFailed {
                            build_id: build_id.into(),
                            status: status.into(),
                        });
                    }
                    _ => tokio::time::sleep(options.poll_interval).await,
                }
            }
        };
        tokio::time::timeout(options.timeout, poll)
            .await
            .map_err(|_| Error::DeploymentTimeout {
                build_id: build_id.into(),
            })?
    }
}
