use serde::de::DeserializeOwned;
use serde_json::Value;
use stackmachine::{Deployment, models::*};

fn check<T: DeserializeOwned>(fixtures: &Value, operation: &str) {
    for name in [operation.to_owned(), format!("{operation}_NULLABLE")] {
        serde_json::from_value::<T>(fixtures[&name].clone())
            .unwrap_or_else(|error| panic!("{name} does not match its Rust model: {error}"));
    }
}

macro_rules! model_tests {
    ($($name:ident: $model:ty => $operation:literal),+ $(,)?) => {$(
        #[test]
        fn $name() {
            let fixtures: Value = serde_json::from_str(include_str!("fixtures/responses.json")).unwrap();
            check::<$model>(&fixtures, $operation);
        }
    )+};
}

model_tests!(
    viewer: Viewer => "VIEWER_QUERY",
    app: App => "GET_APP_BY_ID_QUERY",
    deployment: Deployment => "GET_DEPLOYMENT_STATUS_QUERY",
    app_domain: AppDomain => "GET_APP_ALIASES_QUERY",
    volume: AppVolume => "CREATE_APP_VOLUME_MUTATION",
    database_credentials: DatabaseCredentials => "CREATE_APP_DATABASE_MUTATION",
    cache: AppCache => "GET_APP_CACHE_QUERY",
    cron_job: CronJob => "GET_CRON_JOBS_BY_IDS_QUERY",
    git_connection: GitConnection => "GET_APP_GIT_CONNECTION_QUERY",
    dns_domain: DnsDomain => "GET_DNS_DOMAINS_QUERY",
    dns_record: DnsRecord => "UPSERT_DNS_RECORD_MUTATION",
    email: EmailMessage => "SEND_APP_EMAIL_MUTATION",
    log: Log => "GET_APP_LOGS_QUERY",
    ssh_server: SshServer => "GET_APP_SSH_SERVER_QUERY",
    ssh_user: SshUser => "GET_SSH_USERS_BY_IDS_QUERY",
    ssh_password: SshPassword => "REVEAL_SSH_USER_PASSWORD_MUTATION",
    ssh_authorized_key: SshAuthorizedKey => "GET_SSH_AUTHORIZED_KEYS_QUERY",
    package: PackageVersion => "SEARCH_PACKAGES_QUERY",
    usage: UsageMetrics => "USAGE_APP_METRICS_QUERY",
);
