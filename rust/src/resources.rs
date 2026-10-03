//! Resource methods use snake_case Rust names and schema-derived input structs.
use crate::{
    Error, Page, Pagination, Result, StackMachine, inputs::*, models::*, operations as gql,
};
use serde::{Serialize, de::DeserializeOwned};
use serde_json::{Value, json};

macro_rules! resources {
    ($($name:ident),+ $(,)?) => {$(
        #[derive(Clone, Copy)]
        pub struct $name<'a> { client: &'a StackMachine }
    )+};
}

resources!(
    Apps, Domains, Volumes, Databases, Cache, CronJobs, Git, Versions, Logs, Ssh, SshUsers,
    SshKeys, Dns, DnsDomains, DnsRecords, Emails, Packages, Usage
);

macro_rules! accessors {
    ($($method:ident: $resource:ident),+ $(,)?) => {$(
        pub fn $method(&self) -> $resource<'_> { $resource { client: self } }
    )+};
}

impl StackMachine {
    accessors!(apps: Apps, dns: Dns, emails: Emails, packages: Packages, usage: Usage);
}

macro_rules! children {
    ($($method:ident: $resource:ident),+ $(,)?) => {$(
        pub fn $method(&self) -> $resource<'a> { $resource { client: self.client } }
    )+};
}

macro_rules! mutations {
    ($($method:ident($input:ty) -> $output:ty = $query:ident, $pointer:literal);+ $(;)?) => {$(
        pub async fn $method(&self, input: &$input) -> Result<$output> {
            self.client.mutation(gql::$query, input, $pointer).await
        }
    )+};
}

#[derive(Clone, Debug)]
pub struct AppsListParams {
    pub owner_id: Option<String>,
    pub sort_by: DeployAppsSortBy,
    pub pagination: Pagination,
}

impl Default for AppsListParams {
    fn default() -> Self {
        Self {
            owner_id: None,
            sort_by: DeployAppsSortBy::Newest,
            pagination: Pagination::default(),
        }
    }
}

impl<'a> Apps<'a> {
    children!(domains: Domains, volumes: Volumes, databases: Databases, cache: Cache,
        cronjobs: CronJobs, git: Git, versions: Versions, logs: Logs, ssh: Ssh);

    pub async fn list(&self, params: AppsListParams) -> Result<Page<App>> {
        self.client
            .page(
                gql::LIST_APPS_QUERY,
                params
                    .pagination
                    .variables(json!({"ownerId": params.owner_id, "sortBy": params.sort_by}))?,
                "/getDeployApps",
            )
            .await
    }

    pub async fn retrieve(&self, id: &str) -> Result<App> {
        let mut apps = nodes(self.client, gql::GET_APPS_BY_IDS_QUERY, &[id], "DeployApp").await?;
        apps.pop()
            .flatten()
            .ok_or_else(|| Error::missing("app", id))
    }

    pub async fn retrieve_many(&self, ids: &[impl AsRef<str>]) -> Result<Vec<Option<App>>> {
        nodes(self.client, gql::GET_APPS_BY_IDS_QUERY, ids, "DeployApp").await
    }

    pub async fn retrieve_by_name(&self, name: &str, owner: Option<&str>) -> Result<App> {
        self.client
            .read(
                gql::GET_APP_BY_NAME_QUERY,
                json!({"name": name, "owner": owner}),
                "/app",
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(gql::DELETE_APP_MUTATION, json!({"id": id}), "deleteApp")
            .await
    }
}

impl Domains<'_> {
    pub async fn list(&self, app_id: &str, pagination: Pagination) -> Result<Page<AppDomain>> {
        self.client
            .page(
                gql::LIST_APP_DOMAINS_QUERY,
                pagination.variables(json!({"appId": app_id, "sortBy": "NEWEST"}))?,
                "/node/domains",
            )
            .await
    }

    pub async fn retrieve(&self, id: &str) -> Result<AppDomain> {
        nodes(self.client, gql::GET_APP_ALIASES_QUERY, &[id], "AppAlias")
            .await?
            .pop()
            .flatten()
            .ok_or_else(|| Error::missing("app domain", id))
    }

    pub async fn retrieve_many(&self, ids: &[impl AsRef<str>]) -> Result<Vec<Option<AppDomain>>> {
        nodes(self.client, gql::GET_APP_ALIASES_QUERY, ids, "AppAlias").await
    }

    mutations!(create(UpsertAppDomainInput) -> Vec<AppDomain> = UPSERT_APP_DOMAIN_MUTATION, "/upsertAppDomain/domains");

    pub async fn verify(&self, id: &str) -> Result<bool> {
        self.client
            .mutation(
                gql::VERIFY_APP_DOMAIN_MUTATION,
                json!({"domainId": id}),
                "/verifyAppDomain/verified",
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_APP_DOMAIN_MUTATION,
                json!({"id": id}),
                "deleteAppDomain",
            )
            .await
    }
}

impl Volumes<'_> {
    pub async fn list(&self, app_id: &str, pagination: Pagination) -> Result<Page<AppVolume>> {
        self.client
            .page(
                gql::LIST_APP_VOLUMES_QUERY,
                pagination.variables(json!({"appId": app_id}))?,
                "/node/volumes",
            )
            .await
    }

    mutations!(
        create(CreateAppVolumeInput) -> AppVolume = CREATE_APP_VOLUME_MUTATION, "/createAppVolume/volume";
        update(UpdateVolumeInput) -> AppVolume = UPDATE_VOLUME_MUTATION, "/updateVolume/volume"
    );

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_APP_VOLUME_MUTATION,
                json!({"id": id}),
                "deleteAppVolume",
            )
            .await
    }
}

impl Databases<'_> {
    pub async fn list(&self, app_id: &str, pagination: Pagination) -> Result<Page<AppDatabase>> {
        self.client
            .page(
                gql::LIST_APP_DATABASES_QUERY,
                pagination.variables(json!({"appId": app_id}))?,
                "/node/databases",
            )
            .await
    }

    mutations!(
        create(CreateAppDBInput) -> DatabaseCredentials = CREATE_APP_DATABASE_MUTATION, "/createAppDb";
        create_and_link(CreateAppDatabaseInput) -> DatabaseCredentials = CREATE_DATABASE_AND_LINK_TO_APP_MUTATION, "/createDatabaseAndLinkToApp"
    );

    pub async fn rotate_credentials(&self, id: &str) -> Result<DatabaseCredentials> {
        self.client
            .mutation(
                gql::ROTATE_APP_DATABASE_CREDENTIALS_MUTATION,
                json!({"id": id}),
                "/rotateCredentialsForAppDb",
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_APP_DATABASE_MUTATION,
                json!({"id": id}),
                "deleteAppDb",
            )
            .await
    }
}

impl Cache<'_> {
    pub async fn retrieve(&self, app_id: &str) -> Result<AppCache> {
        self.client
            .read(gql::GET_APP_CACHE_QUERY, json!({"id": app_id}), "/node")
            .await
    }

    pub async fn update(&self, app_id: &str, enabled: bool) -> Result<()> {
        success(
            self.client,
            gql::CONFIGURE_APP_CDN_CACHE_MUTATION,
            json!({"app": app_id, "config": {"enabled": enabled}}),
            "/configureAppCdnCache/success",
        )
        .await
    }

    pub async fn purge(&self, app_id: &str) -> Result<()> {
        success(
            self.client,
            gql::PURGE_APP_CDN_CACHE_MUTATION,
            json!({"app": app_id}),
            "/purgeAppCdnCache/success",
        )
        .await
    }
}

#[derive(Clone, Debug)]
pub struct CronJobsListParams {
    pub kind: Option<CronJobKind>,
    pub sort_by: CronJobsSortBy,
    pub pagination: Pagination,
}

impl Default for CronJobsListParams {
    fn default() -> Self {
        Self {
            kind: None,
            sort_by: CronJobsSortBy::Newest,
            pagination: Pagination::default(),
        }
    }
}

impl CronJobs<'_> {
    pub async fn list(&self, app_id: &str, params: CronJobsListParams) -> Result<Page<CronJob>> {
        self.client
            .page(
                gql::LIST_APP_CRON_JOBS_QUERY,
                params.pagination.variables(
                    json!({"appId": app_id, "kind": params.kind, "sortBy": params.sort_by}),
                )?,
                "/node/cronJobs",
            )
            .await
    }

    pub async fn retrieve(&self, id: &str) -> Result<CronJob> {
        nodes(
            self.client,
            gql::GET_CRON_JOBS_BY_IDS_QUERY,
            &[id],
            "CronJob",
        )
        .await?
        .pop()
        .flatten()
        .ok_or_else(|| Error::missing("cron job", id))
    }

    pub async fn retrieve_many(&self, ids: &[impl AsRef<str>]) -> Result<Vec<Option<CronJob>>> {
        nodes(self.client, gql::GET_CRON_JOBS_BY_IDS_QUERY, ids, "CronJob").await
    }

    pub async fn create(&self, input: &CreateCronJobInput) -> Result<CronJob> {
        if input.execute.is_some() == input.fetch.is_some() {
            return Err(Error::Validation(
                "exactly one of execute or fetch must be provided".into(),
            ));
        }
        self.client
            .mutation(
                gql::CREATE_CRON_JOB_MUTATION,
                input,
                "/createCronJob/cronJob",
            )
            .await
    }

    pub async fn update(&self, input: &UpdateCronJobInput) -> Result<CronJob> {
        if input.execute.is_some() && input.fetch.is_some() {
            return Err(Error::Validation(
                "execute and fetch cannot both be provided".into(),
            ));
        }
        self.client
            .mutation(
                gql::UPDATE_CRON_JOB_MUTATION,
                input,
                "/updateCronJob/cronJob",
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_CRON_JOB_MUTATION,
                json!({"cronJobId": id}),
                "deleteCronJob",
            )
            .await
    }
}

impl Git<'_> {
    pub async fn retrieve(&self, app_id: &str) -> Result<Option<GitConnection>> {
        let data: Value = self
            .client
            .graphql(gql::GET_APP_GIT_CONNECTION_QUERY, json!({"id": app_id}))
            .await?;
        let node = data
            .get("node")
            .filter(|node| node.get("__typename").and_then(Value::as_str) == Some("DeployApp"))
            .ok_or_else(|| Error::missing("app", app_id))?;
        node.get("githubRepoConnection")
            .filter(|value| !value.is_null())
            .map(|value| serde_json::from_value(value.clone()).map_err(Error::from))
            .transpose()
    }

    mutations!(
        connect(ConnectGithubRepoToAppInput) -> GitConnection = CONNECT_GITHUB_REPO_TO_APP_MUTATION, "/connectGithubRepoToApp/githubRepoConnection";
        update(UpdateGithubRepoAppConnectionInput) -> GitConnection = UPDATE_GITHUB_REPO_CONNECTION_MUTATION, "/updateGithubRepoConnection/githubRepoConnection"
    );

    pub async fn delete(&self, app_id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DISCONNECT_GITHUB_REPO_FROM_APP_MUTATION,
                json!({"appId": app_id}),
                "disconnectGithubRepoFromApp",
            )
            .await
    }
}

#[derive(Clone, Debug, Default)]
pub struct VersionsListParams {
    pub created_after: Option<String>,
    pub sort_by: Option<DeployAppVersionsSortBy>,
    pub pagination: Pagination,
}

impl Versions<'_> {
    pub async fn list(&self, app_id: &str, params: VersionsListParams) -> Result<Page<AppVersion>> {
        self.client.page(gql::LIST_APP_VERSIONS_QUERY, params.pagination.variables(
            json!({"appId": app_id, "createdAfter": params.created_after, "sortBy": params.sort_by}))?, "/node/versions").await
    }
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LogsListParams {
    pub since: Option<String>,
    pub until: Option<String>,
    pub instance_id: Option<String>,
    pub request_id: Option<String>,
    pub streams: Option<Vec<LogStream>>,
    pub text_search: Option<String>,
    #[serde(skip)]
    pub pagination: Pagination,
}

impl Logs<'_> {
    /// Logs belong to an app version; pass a version ID, not an app ID.
    pub async fn list(&self, version_id: &str, params: LogsListParams) -> Result<Page<Log>> {
        let mut variables = serde_json::to_value(&params)?;
        variables["appId"] = json!(version_id);
        self.client
            .page(
                gql::GET_APP_LOGS_QUERY,
                params.pagination.variables(variables)?,
                "/node/logs",
            )
            .await
    }
}

impl<'a> Ssh<'a> {
    children!(users: SshUsers);

    pub async fn retrieve(&self, app_id: &str) -> Result<SshServer> {
        self.client
            .read(
                gql::GET_APP_SSH_SERVER_QUERY,
                json!({"id": app_id}),
                "/node/sshServer",
            )
            .await
    }

    mutations!(
        update(ToggleSshServerInput) -> SshServer = TOGGLE_SSH_SERVER_MUTATION, "/toggleSshServer/sshServer";
        generate_token(GenerateSshTokenInput) -> String = GENERATE_SSH_TOKEN_MUTATION, "/generateSshToken/token"
    );
}

impl<'a> SshUsers<'a> {
    children!(authorized_keys: SshKeys);

    pub async fn list(&self, app_id: &str, pagination: Pagination) -> Result<Page<SshUser>> {
        self.client
            .page(
                gql::GET_APP_SSH_USERS_QUERY,
                pagination.variables(json!({"id": app_id}))?,
                "/node/sshServer/users",
            )
            .await
    }

    pub async fn retrieve(&self, id: &str) -> Result<SshUser> {
        nodes(
            self.client,
            gql::GET_SSH_USERS_BY_IDS_QUERY,
            &[id],
            "SshUser",
        )
        .await?
        .pop()
        .flatten()
        .ok_or_else(|| Error::missing("SSH user", id))
    }

    pub async fn retrieve_many(&self, ids: &[impl AsRef<str>]) -> Result<Vec<Option<SshUser>>> {
        nodes(self.client, gql::GET_SSH_USERS_BY_IDS_QUERY, ids, "SshUser").await
    }

    mutations!(update(EditSshUserInput) -> SshUser = EDIT_SSH_USER_MUTATION, "/editSshUser/sshUser");

    pub async fn reveal_password(&self, id: &str) -> Result<SshPassword> {
        self.client
            .mutation(
                gql::REVEAL_SSH_USER_PASSWORD_MUTATION,
                json!({"sshUserId": id}),
                "/revealSshUserPassword",
            )
            .await
    }

    pub async fn rotate_password(&self, id: &str) -> Result<SshPassword> {
        self.client
            .mutation(
                gql::ROTATE_SSH_USER_PASSWORD_MUTATION,
                json!({"sshUserId": id}),
                "/rotateSshUserPassword",
            )
            .await
    }
}

impl SshKeys<'_> {
    pub async fn list(
        &self,
        ssh_user_id: &str,
        pagination: Pagination,
    ) -> Result<Page<SshAuthorizedKey>> {
        self.client
            .page(
                gql::GET_SSH_AUTHORIZED_KEYS_QUERY,
                pagination.variables(json!({"id": ssh_user_id}))?,
                "/node/authorizedKeys",
            )
            .await
    }

    mutations!(create(AddSshAuthorizedKeyInput) -> SshAuthorizedKey = ADD_SSH_AUTHORIZED_KEY_MUTATION, "/addSshAuthorizedKey/authorizedKey");

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_SSH_AUTHORIZED_KEY_BY_ID_MUTATION,
                json!({"id": id}),
                "deleteSshAuthorizedKeyById",
            )
            .await
    }
}

impl<'a> Dns<'a> {
    children!(domains: DnsDomains, records: DnsRecords);
}

impl DnsDomains<'_> {
    pub async fn list(
        &self,
        owner_id: Option<&str>,
        pagination: Pagination,
    ) -> Result<Page<DnsDomain>> {
        self.client
            .page(
                gql::LIST_DNS_DOMAINS_QUERY,
                pagination.variables(json!({"owner": owner_id}))?,
                "/getAllDomains",
            )
            .await
    }

    pub async fn retrieve(&self, id: &str) -> Result<DnsDomain> {
        nodes(self.client, gql::GET_DNS_DOMAINS_QUERY, &[id], "DNSDomain")
            .await?
            .pop()
            .flatten()
            .ok_or_else(|| Error::missing("DNS domain", id))
    }

    pub async fn retrieve_many(&self, ids: &[impl AsRef<str>]) -> Result<Vec<Option<DnsDomain>>> {
        nodes(self.client, gql::GET_DNS_DOMAINS_QUERY, ids, "DNSDomain").await
    }

    pub async fn retrieve_by_name(&self, name: &str) -> Result<DnsDomain> {
        self.client
            .read(
                gql::GET_DNS_DOMAIN_BY_NAME_QUERY,
                json!({"name": name}),
                "/getDomain",
            )
            .await
    }

    mutations!(
        create(RegisterDomainInput) -> DnsDomain = REGISTER_DNS_DOMAIN_MUTATION, "/registerDomain/domain";
        import_zone_file(UpsertDomainFromZoneFileInput) -> DnsDomain = UPSERT_DNS_DOMAIN_FROM_ZONE_FILE_MUTATION, "/upsertDomainFromZoneFile/domain"
    );

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_DNS_DOMAIN_MUTATION,
                json!({"domainId": id}),
                "deleteDomain",
            )
            .await
    }
}

impl DnsRecords<'_> {
    pub async fn list(&self, domain_id: &str, pagination: Pagination) -> Result<Page<DnsRecord>> {
        self.client
            .page(
                gql::LIST_DNS_RECORDS_CONNECTION_QUERY,
                pagination.variables(json!({"domainId": domain_id}))?,
                "/node/recordsConnection",
            )
            .await
    }

    pub async fn retrieve(&self, id: &str) -> Result<DnsRecord> {
        let data: Value = self
            .client
            .graphql(gql::GET_DNS_RECORDS_QUERY, json!({"ids": [id]}))
            .await?;
        let node = data
            .pointer("/nodes/0")
            .filter(|node| node.get("domain").is_some())
            .ok_or_else(|| Error::missing("DNS record", id))?;
        Ok(serde_json::from_value(node.clone())?)
    }

    mutations!(
        create(UpsertDNSRecordInput) -> DnsRecord = UPSERT_DNS_RECORD_MUTATION, "/upsertDNSRecord/record";
        update(UpsertDNSRecordInput) -> DnsRecord = UPSERT_DNS_RECORD_MUTATION, "/upsertDNSRecord/record";
        update_many(UpdateDNSRecordsInput) -> Vec<DnsRecord> = UPDATE_DNS_RECORDS_MUTATION, "/updateDNSRecords/records"
    );

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.client
            .delete(
                gql::DELETE_DNS_RECORD_MUTATION,
                json!({"recordId": id}),
                "deleteDNSRecord",
            )
            .await
    }
}

impl Emails<'_> {
    pub async fn sent(
        &self,
        app_or_owner_id: &str,
        pagination: Pagination,
    ) -> Result<Page<EmailMessage>> {
        self.client
            .page(
                gql::LIST_SENT_EMAILS_QUERY,
                pagination.variables(json!({"id": app_or_owner_id}))?,
                "/node/emails",
            )
            .await
    }

    pub async fn received(
        &self,
        app_or_owner_id: &str,
        pagination: Pagination,
    ) -> Result<Page<EmailMessage>> {
        self.client
            .page(
                gql::LIST_RECEIVED_EMAILS_QUERY,
                pagination.variables(json!({"id": app_or_owner_id}))?,
                "/node/emails",
            )
            .await
    }

    /// Send text or HTML email. Binary MIME uploads require multipart transport,
    /// which is not part of this client's HTTP JSON interface.
    pub async fn send(&self, input: &SendAppEmailInput) -> Result<EmailMessage> {
        if input.raw_message.is_some() {
            return Err(Error::Validation(
                "raw_message uploads are not supported; use text_body or html_body".into(),
            ));
        }
        self.client
            .mutation(gql::SEND_APP_EMAIL_MUTATION, input, "/sendAppEmail/message")
            .await
    }
}

impl Packages<'_> {
    pub async fn search(
        &self,
        query: &str,
        filter: Option<&PackagesFilter>,
        pagination: Pagination,
    ) -> Result<Page<PackageVersion>> {
        self.client
            .page(
                gql::SEARCH_PACKAGES_QUERY,
                pagination.variables(json!({"query": query, "packages": filter}))?,
                "/search",
            )
            .await
    }
}

#[derive(Clone, Copy, Debug)]
pub enum UsageScope<'a> {
    Viewer,
    App(&'a str),
    Owner(&'a str),
}

impl Usage<'_> {
    pub async fn metrics(
        &self,
        scope: UsageScope<'_>,
        start: &str,
        end: &str,
        grouped_by: MetricGrouping,
    ) -> Result<UsageMetrics> {
        let mut variables = json!({"start": start, "end": end, "groupedBy": grouped_by});
        let (query, pointer) = match scope {
            UsageScope::Viewer => (gql::USAGE_VIEWER_METRICS_QUERY, "/viewer/groupedMetrics"),
            UsageScope::App(id) => {
                variables["appId"] = json!(id);
                (gql::USAGE_APP_METRICS_QUERY, "/node/groupedMetrics")
            }
            UsageScope::Owner(owner) => {
                variables["owner"] = json!(owner);
                (gql::USAGE_OWNER_METRICS_QUERY, "/owner/groupedMetrics")
            }
        };
        self.client.read(query, variables, pointer).await
    }
}

async fn nodes<T: DeserializeOwned>(
    client: &StackMachine,
    query: &str,
    ids: &[impl AsRef<str>],
    typename: &str,
) -> Result<Vec<Option<T>>> {
    if ids.is_empty() {
        return Ok(Vec::new());
    }
    let ids: Vec<&str> = ids.iter().map(AsRef::as_ref).collect();
    let data: Value = client.graphql(query, json!({"ids": ids})).await?;
    let nodes = data
        .get("nodes")
        .and_then(Value::as_array)
        .ok_or_else(|| Error::InvalidResponse("response is missing nodes".into()))?;
    ids.iter()
        .enumerate()
        .map(|(index, _)| {
            nodes
                .get(index)
                .filter(|node| node.get("__typename").and_then(Value::as_str) == Some(typename))
                .map(|node| serde_json::from_value(node.clone()).map_err(Error::from))
                .transpose()
        })
        .collect()
}

async fn success(
    client: &StackMachine,
    query: &str,
    variables: Value,
    pointer: &str,
) -> Result<()> {
    if client.read::<bool>(query, variables, pointer).await? {
        Ok(())
    } else {
        Err(Error::InvalidResponse(format!("{pointer} returned false")))
    }
}
