use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fmt;

pub type Result<T> = std::result::Result<T, Error>;

/// Classification shared by HTTP and GraphQL API errors.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[non_exhaustive]
pub enum ErrorKind {
    Authentication,
    Permission,
    RateLimit,
    InvalidRequest,
    NotFound,
    GraphQL,
    Api,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct GraphQLError {
    pub message: String,
    #[serde(default)]
    pub path: Vec<Value>,
    #[serde(default)]
    pub locations: Vec<Value>,
    #[serde(default)]
    pub extensions: Value,
}

/// Server error metadata, including partial data when GraphQL reports errors.
#[derive(Clone, Debug)]
pub struct ApiError {
    pub kind: ErrorKind,
    pub message: String,
    pub status_code: Option<u16>,
    pub request_id: Option<String>,
    pub operation_name: Option<String>,
    pub code: Option<String>,
    pub graphql_errors: Vec<GraphQLError>,
    pub partial_data: Option<Value>,
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for ApiError {}

#[derive(Debug, thiserror::Error)]
#[non_exhaustive]
pub enum Error {
    #[error("{0}")]
    Api(#[from] Box<ApiError>),
    #[error("StackMachine connection failed: {0}")]
    Connection(#[source] reqwest::Error),
    #[error("Invalid request: {0}")]
    Validation(String),
    #[error("Invalid API response: {0}")]
    InvalidResponse(String),
    #[error("Could not encode or decode JSON: {0}")]
    Json(#[from] serde_json::Error),
    #[error("Could not create ZIP archive: {0}")]
    Zip(#[from] zip::result::ZipError),
    #[error("File operation failed: {0}")]
    Io(#[from] std::io::Error),
    #[error("Deployment {build_id} ended with status {status}")]
    DeploymentFailed { build_id: String, status: String },
    #[error("Timed out waiting for deployment {build_id}")]
    DeploymentTimeout { build_id: String },
}

impl Error {
    pub fn api_error(&self) -> Option<&ApiError> {
        match self {
            Self::Api(error) => Some(error),
            _ => None,
        }
    }

    pub fn is_timeout(&self) -> bool {
        matches!(self, Self::Connection(error) if error.is_timeout())
            || matches!(self, Self::DeploymentTimeout { .. })
    }

    pub(crate) fn missing(resource: &str, id: &str) -> Self {
        Box::new(ApiError {
            kind: ErrorKind::NotFound,
            message: format!("{resource} {id:?} was not found"),
            status_code: None,
            request_id: None,
            operation_name: None,
            code: Some("resource_missing".into()),
            graphql_errors: Vec::new(),
            partial_data: None,
        })
        .into()
    }
}

pub(crate) fn retryable_status(status: u16) -> bool {
    matches!(status, 408 | 409 | 425 | 429 | 500 | 502 | 503 | 504)
}
