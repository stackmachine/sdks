//! Typed API responses. Timestamps and URLs retain their API string representation.
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::BTreeMap;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Viewer {
    pub username: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Reference {
    pub id: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct App {
    pub id: String,
    pub name: String,
    pub url: String,
    pub admin_url: String,
    pub active_version: Option<Reference>,
    pub will_perish_at: Option<String>,
    pub favicon: Option<String>,
    pub screenshot: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AppVersion {
    pub id: String,
    pub app: App,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExpectedDnsRecord {
    pub host: String,
    pub record_type: String,
    pub value: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppDomain {
    pub id: String,
    pub hostname: String,
    pub url: String,
    pub state: String,
    pub redirection_http_code: Option<String>,
    pub redirects_from: Vec<Reference>,
    pub redirects_to: Option<Reference>,
    pub expected_dns_records: Vec<ExpectedDnsRecord>,
    pub first_checked_at: Option<String>,
    pub last_checked_at: Option<String>,
    pub updated_at: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppVolume {
    pub id: String,
    pub volume_id: String,
    pub mount_path: String,
    #[serde(deserialize_with = "bigint")]
    pub max_size_bytes: i64,
    pub s3_enabled: bool,
    pub s3_url: Option<String>,
    pub explorer_url: Option<String>,
    pub is_added_by_ui: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppDatabase {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: String,
    pub username: String,
    pub password: Option<String>,
    pub phpmyadmin_url: Option<String>,
    pub db_explorer_url: Option<String>,
    pub deleted_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub app: App,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct DatabaseCredentials {
    pub database: AppDatabase,
    pub password: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AppCache {
    pub id: String,
    #[serde(rename = "cdnCacheEnabled")]
    pub enabled: bool,
    #[serde(rename = "cdnCachePurgedAt")]
    pub purged_at: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(tag = "__typename")]
#[non_exhaustive]
pub enum CronJobTarget {
    #[serde(rename = "ExecuteCronJobTarget", rename_all = "camelCase")]
    Execute {
        command: Option<String>,
        cli_args: Value,
        env: Value,
        package_name: Option<String>,
    },
    #[serde(rename = "FetchCronJobTarget", rename_all = "camelCase")]
    Fetch {
        path: String,
        method: String,
        headers: Value,
        body: Option<String>,
        expect_body_includes: Option<String>,
        expect_body_regex: Option<String>,
        expect_status_codes: Value,
    },
    #[serde(other)]
    Unknown,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CronJob {
    pub id: String,
    pub name: String,
    pub schedule: String,
    pub enabled: bool,
    pub kind: String,
    pub source: String,
    pub is_managed: bool,
    pub max_retries: Option<i32>,
    pub max_schedule_drift: Option<String>,
    pub timeout: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub target: CronJobTarget,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GitConnection {
    pub id: String,
    pub connected_at: String,
    pub deploy_branch: String,
    pub deployment_status_events: bool,
    pub pull_request_comments: bool,
    pub connected_by: UserSummary,
    pub app: App,
    pub github_repo_installation: GithubRepository,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserSummary {
    pub id: String,
    pub username: String,
    pub global_name: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GithubRepository {
    pub id: String,
    pub name: String,
    pub namespace: String,
    pub repo_url: String,
    pub url: String,
    pub installation: GithubInstallation,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GithubInstallation {
    pub id: String,
    pub slug: String,
    pub github_configure_url: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Owner {
    #[serde(rename = "__typename")]
    pub kind: String,
    pub id: String,
    pub global_id: String,
    pub global_name: String,
    pub is_pro: bool,
    pub name: Option<String>,
    pub display_name: Option<String>,
    pub username: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DnsDomain {
    pub id: String,
    pub name: String,
    pub slug: String,
    pub zone_file: String,
    pub delegation_status: String,
    pub nameservers: Vec<String>,
    pub last_checked_at: Option<String>,
    pub verified_at: Option<String>,
    pub deleted_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub owner: Owner,
    // Domain listing deliberately omits records; retrieve includes them.
    #[serde(default)]
    pub records: Option<Vec<Option<DnsRecord>>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct DnsDomainSummary {
    pub id: String,
    pub name: String,
    pub slug: String,
}

/// Common DNS fields and the record-specific fields from GraphQL (e.g. `address`).
#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DnsRecord {
    #[serde(rename = "__typename")]
    pub kind: String,
    pub id: String,
    pub name: String,
    pub text: String,
    pub ttl: Option<i32>,
    pub dns_class: Option<String>,
    pub domain: DnsDomainSummary,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
    #[serde(flatten)]
    pub fields: BTreeMap<String, Value>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailMessage {
    pub id: String,
    pub from: String,
    pub to: Vec<String>,
    pub cc: Vec<String>,
    pub bcc: Vec<String>,
    pub subject: String,
    pub text_body: Option<String>,
    pub html_body: Option<String>,
    pub reply_to: Option<String>,
    pub direction: String,
    pub status: String,
    pub created_at: String,
    pub received_at: Option<String>,
    pub sent_at: Option<String>,
    pub app: Option<Reference>,
    pub owner: Option<Owner>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Log {
    pub datetime: String,
    pub instance_id: String,
    pub message: String,
    pub stream: Option<String>,
    pub timestamp: f64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SshServer {
    pub id: String,
    pub enabled: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SshUser {
    pub id: String,
    pub username: String,
    pub port: i32,
    pub server_host: String,
    pub sftp_root_folder: String,
    pub authentication_methods: Vec<Option<String>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SshPassword {
    pub password: Option<String>,
    pub ssh_user: SshUser,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SshAuthorizedKey {
    pub id: String,
    pub name: Option<String>,
    pub public_key: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PackageVersion {
    pub id: String,
    pub version: String,
    pub created_at: String,
    pub package: Package,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Package {
    pub id: String,
    pub package_name: String,
    pub namespace: String,
    pub private: bool,
    pub last_version: Option<PackageRelease>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PackageRelease {
    pub id: String,
    pub version: String,
    pub created_at: String,
    pub distribution: PackageDistribution,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PackageDistribution {
    pub pirita_sha256_hash: Option<String>,
    pub pirita_download_url: Option<String>,
    pub download_url: String,
    pub size: Option<f64>,
    pub pirita_size: Option<f64>,
    pub webc_version: Option<String>,
    pub webc_manifest: Option<Value>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UsageMetrics {
    pub start_at: String,
    pub end_at: String,
    pub grouped: Vec<GroupedUsageMetrics>,
    pub totals: MetricsTotals,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GroupedUsageMetrics {
    pub grouped_at: String,
    pub requests: RequestMetrics,
    pub workloads: WorkloadMetrics,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct MetricsTotals {
    pub requests: RequestMetrics,
    pub workloads: WorkloadMetrics,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestMetrics {
    #[serde(deserialize_with = "bigint")]
    pub cached_requests: i64,
    #[serde(deserialize_with = "bigint")]
    pub data_cached_bytes: i64,
    #[serde(deserialize_with = "bigint")]
    pub data_served_bytes: i64,
    #[serde(deserialize_with = "bigint")]
    pub http2xx: i64,
    #[serde(deserialize_with = "bigint")]
    pub http3xx: i64,
    #[serde(deserialize_with = "bigint")]
    pub http4xx: i64,
    #[serde(deserialize_with = "bigint")]
    pub http5xx: i64,
    #[serde(deserialize_with = "bigint")]
    pub http_other: i64,
    pub percentage_cached: f64,
    #[serde(deserialize_with = "bigint")]
    pub request_duration_millis: i64,
    #[serde(deserialize_with = "bigint")]
    pub total_requests: i64,
    pub unique_users: i32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkloadMetrics {
    #[serde(deserialize_with = "bigint")]
    pub memory_bytes: i64,
    #[serde(deserialize_with = "bigint")]
    pub network_egress_bytes: i64,
    #[serde(deserialize_with = "bigint")]
    pub network_ingress_bytes: i64,
    #[serde(deserialize_with = "bigint")]
    pub real_cpu_time_millis: i64,
    #[serde(deserialize_with = "bigint")]
    pub wall_cpu_time_millis: i64,
    pub workloads: i32,
}

fn bigint<'de, D: serde::Deserializer<'de>>(deserializer: D) -> Result<i64, D::Error> {
    #[derive(Deserialize)]
    #[serde(untagged)]
    enum BigInt {
        Number(i64),
        String(String),
    }
    match BigInt::deserialize(deserializer)? {
        BigInt::Number(number) => Ok(number),
        BigInt::String(number) => number.parse().map_err(serde::de::Error::custom),
    }
}
