from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import (
    TYPE_CHECKING,
    Literal,
    Mapping,
    Optional,
    Protocol,
    Sequence,
    TypedDict,
    Union,
)

import httpx

from ._config import RequestOptions

if TYPE_CHECKING:
    from ._models import DeploymentProgress, SshUser, UploadProgress

Headers = Mapping[str, str]


class RequestOptionsInput(TypedDict, total=False):
    api_key: str
    apiKey: str
    headers: Headers
    timeout: float
    max_network_retries: int
    maxNetworkRetries: int
    idempotency_key: str
    idempotencyKey: str
    client_mutation_id: str
    clientMutationId: str
    force: bool


RequestOptionsLike = Union[RequestOptions, RequestOptionsInput]


class StackMachineInitSettings(TypedDict, total=False):
    api_key: str
    apiKey: str
    token: str
    api_url: str
    apiUrl: str
    headers: Headers
    timeout: float
    max_network_retries: int
    maxNetworkRetries: int
    http_client: httpx.Client
    http_transport: httpx.BaseTransport


class AsyncStackMachineInitSettings(TypedDict, total=False):
    api_key: str
    apiKey: str
    token: str
    api_url: str
    apiUrl: str
    headers: Headers
    timeout: float
    max_network_retries: int
    maxNetworkRetries: int
    http_client: httpx.AsyncClient
    http_transport: httpx.AsyncBaseTransport


class PaginationOptions(TypedDict, total=False):
    limit: int
    starting_after: Optional[str]
    startingAfter: Optional[str]
    ending_before: Optional[str]
    endingBefore: Optional[str]


DeployAppsSortBy = Literal["MOST_ACTIVE", "NEWEST", "OLDEST"]
AppAliasSortBy = Literal["NEWEST", "OLDEST"]
DeployAppVersionsSortBy = Literal["NEWEST", "OLDEST"]
DNSRecordsSortBy = Literal["NEWEST", "OLDEST"]
LogStream = Literal["RUNTIME", "STDERR", "STDOUT", "%future added value"]
SshAuthenticationMethod = Literal["PASSWORD", "PUBLIC_KEY", "%future added value"]
DNSRecordKind = Literal[
    "A",
    "AAAA",
    "CAA",
    "CNAME",
    "DNAME",
    "MX",
    "NS",
    "PTR",
    "SOA",
    "SRV",
    "SSHFP",
    "TXT",
    "%future added value",
]
DatabaseEngine = Literal["MYSQL", "POSTGRES", "SQLITE"]
EmailMessageDirection = Literal["RECEIVED", "SENT", "%future added value"]
EmailMessageStatus = Literal[
    "DELIVERED",
    "FAILED",
    "QUEUED",
    "RECEIVED",
    "SENT",
    "%future added value",
]


class DeployAppsListInput(PaginationOptions, total=False):
    collaborating: Optional[bool]
    sort_by: DeployAppsSortBy
    sortBy: DeployAppsSortBy


class AppsDomainsListInput(PaginationOptions, total=False):
    app: str
    sort_by: AppAliasSortBy
    sortBy: AppAliasSortBy


class AppsVolumesListInput(PaginationOptions, total=False):
    app: str


class AppsVersionsListInput(PaginationOptions, total=False):
    app: str
    created_after: datetime
    createdAfter: datetime
    sort_by: DeployAppVersionsSortBy
    sortBy: DeployAppVersionsSortBy


class AppsVersionsLogsListInput(PaginationOptions, total=False):
    version: str
    since: datetime
    until: datetime
    instance_id: str
    instanceId: str
    request_id: str
    requestId: str
    streams: Sequence[LogStream]
    text_search: str
    textSearch: str


class AppsSshUsersListInput(PaginationOptions, total=False):
    app: str


class AppsSshAuthorizedKeysListInput(PaginationOptions, total=False):
    user: str


class DeployAppEnvVarInput(TypedDict, total=False):
    name: str
    sensitive: Optional[bool]
    value: str


class DeployAppWordPressExtraData(TypedDict, total=False):
    admin_email: str
    adminEmail: str
    admin_password: str
    adminPassword: str
    admin_username: str
    adminUsername: str
    language: Optional[str]
    site_name: str
    siteName: str
    theme: Optional[str]


class DeployAppAutobuildExtraData(TypedDict, total=False):
    wordpress: Optional[DeployAppWordPressExtraData]


class DeployAppJobDefinitionInput(TypedDict, total=False):
    cli_args: Optional[Sequence[Optional[str]]]
    cliArgs: Optional[Sequence[Optional[str]]]
    command: str
    env: Optional[Sequence[Optional[str]]]
    name: Optional[str]
    package: Optional[str]
    timeout: Optional[str]


class DeployAppAutobuildInput(TypedDict, total=False):
    after_deploy_cmd: Optional[str]
    afterDeployCmd: Optional[str]
    allow_existing_app: Optional[bool]
    allowExistingApp: Optional[bool]
    app_id: Optional[str]
    appId: Optional[str]
    app_name: Optional[str]
    appName: Optional[str]
    branch: Optional[str]
    build_cmd: Optional[str]
    buildCmd: Optional[str]
    client_mutation_id: Optional[str]
    clientMutationId: Optional[str]
    domains: Optional[Sequence[Optional[str]]]
    enable_database: Optional[bool]
    enableDatabase: Optional[bool]
    env_vars: Optional[Sequence[Optional[DeployAppEnvVarInput]]]
    envVars: Optional[Sequence[Optional[DeployAppEnvVarInput]]]
    extra_data: Optional[DeployAppAutobuildExtraData]
    extraData: Optional[DeployAppAutobuildExtraData]
    files: Optional[DeploymentFilesInput]
    install_cmd: Optional[str]
    installCmd: Optional[str]
    jobs: Optional[Sequence[Optional[DeployAppJobDefinitionInput]]]
    kind: Optional[str]
    managed: Optional[bool]
    owner: Optional[str]
    params: Optional[DeployAppAutobuildExtraData]
    perish_at: Optional[Union[str, datetime]]
    perishAt: Optional[Union[str, datetime]]
    preset_name: Optional[str]
    presetName: Optional[str]
    region: Optional[str]
    repo_url: Optional[str]
    repoUrl: Optional[str]
    root_dir: Optional[str]
    rootDir: Optional[str]
    start_cmd: Optional[str]
    startCmd: Optional[str]
    upload_url: Optional[str]
    uploadUrl: Optional[str]
    wait_for_screenshot_generation: Optional[bool]
    waitForScreenshotGeneration: Optional[bool]


class AppsDomainsCreateInput(TypedDict, total=False):
    app: str
    hostname: str
    is_default: Optional[bool]
    isDefault: Optional[bool]


class AppsVolumesCreateInput(TypedDict, total=False):
    app: str
    mount_path: str
    mountPath: str
    max_size_bytes: Optional[int]
    maxSizeBytes: Optional[int]


class AppsVolumesUpdateInput(TypedDict, total=False):
    mount_path: Optional[str]
    mountPath: Optional[str]
    max_size_bytes: Optional[int]
    maxSizeBytes: Optional[int]
    redeploy_app: Optional[bool]
    redeployApp: Optional[bool]
    s3_enabled: Optional[bool]
    s3Enabled: Optional[bool]


class AppsGitConnectInput(TypedDict, total=False):
    app: str
    installation_repo_id: str
    installationRepoId: str
    deploy_branch: Optional[str]
    deployBranch: Optional[str]


class AppsGitUpdateInput(TypedDict, total=False):
    deploy_branch: Optional[str]
    deployBranch: Optional[str]
    deployment_status_events: Optional[bool]
    deploymentStatusEvents: Optional[bool]
    pull_request_comments: Optional[bool]
    pullRequestComments: Optional[bool]


class AppsDatabasesListInput(PaginationOptions, total=False):
    app: str


class AppsDatabasesCreateInput(TypedDict, total=False):
    app: str
    db_engine: DatabaseEngine
    dbEngine: DatabaseEngine
    name: Optional[str]


class DNSDomainsListInput(PaginationOptions, total=False):
    owner: Optional[str]


class DNSDomainsCreateInput(TypedDict, total=False):
    name: str
    owner: Optional[str]
    import_records: Optional[bool]
    importRecords: Optional[bool]


class DNSDomainsImportZoneFileInput(TypedDict, total=False):
    zone_file: str
    zoneFile: str
    delete_missing_records: Optional[bool]
    deleteMissingRecords: Optional[bool]


class DNSRecordsListInput(TypedDict):
    domain: str


class DNSRecordsListPageInput(PaginationOptions, total=False):
    domain: str
    sort_by: DNSRecordsSortBy
    sortBy: DNSRecordsSortBy


class DNSCAAExtraInput(TypedDict):
    flags: int
    tag: str


class DNSMXExtraInput(TypedDict):
    preference: int


class DNSSOAExtraInput(TypedDict):
    expire: int
    minimum: int
    mname: str
    refresh: int
    retry: int
    rname: str
    serial: int


class DNSSRVExtraInput(TypedDict):
    port: int
    priority: int
    protocol: str
    service: str
    weight: int


class DNSSSHFPExtraInput(TypedDict):
    algorithm: int
    type: int


class DNSRecordsUpsertInput(TypedDict, total=False):
    domain: str
    kind: DNSRecordKind
    name: str
    value: str
    ttl: Optional[int]
    caa: Optional[DNSCAAExtraInput]
    mx: Optional[DNSMXExtraInput]
    soa: Optional[DNSSOAExtraInput]
    srv: Optional[DNSSRVExtraInput]
    sshfp: Optional[DNSSSHFPExtraInput]


class DNSRecordUpdateInput(TypedDict, total=False):
    id: Optional[str]
    delete: Optional[bool]
    kind: Optional[DNSRecordKind]
    name: Optional[str]
    value: Optional[str]
    ttl: Optional[int]
    caa: Optional[DNSCAAExtraInput]
    mx: Optional[DNSMXExtraInput]
    soa: Optional[DNSSOAExtraInput]
    srv: Optional[DNSSRVExtraInput]
    sshfp: Optional[DNSSSHFPExtraInput]


class DNSRecordsUpdateManyInput(TypedDict):
    domain: str
    records: Sequence[Optional[DNSRecordUpdateInput]]


class EmailsListInput(PaginationOptions, total=False):
    app: Optional[str]
    owner: Optional[str]


class EmailsSendInput(TypedDict, total=False):
    app: str
    to: Sequence[str]
    subject: str
    bcc: Optional[Sequence[str]]
    cc: Optional[Sequence[str]]
    from_address: Optional[str]
    fromAddress: Optional[str]
    from_email_id: Optional[str]
    fromEmailId: Optional[str]
    html_body: Optional[str]
    htmlBody: Optional[str]
    reply_to: Optional[str]
    replyTo: Optional[str]
    text_body: Optional[str]
    textBody: Optional[str]


class AppsSshAuthorizedKeysCreateInput(TypedDict, total=False):
    user: str
    public_key: str
    publicKey: str
    name: Optional[str]


class AppsSshAuthorizedKeysDeleteInput(TypedDict, total=False):
    authorized_key_id: str
    authorizedKeyId: str
    user: str
    name: str


class AppsSshUsersUpdateInput(TypedDict, total=False):
    username: Optional[str]
    sftp_root_folder: Optional[str]
    sftpRootFolder: Optional[str]
    authentication_methods: Optional[Sequence[SshAuthenticationMethod]]
    authenticationMethods: Optional[Sequence[SshAuthenticationMethod]]


class AppsSshServerUpdateInput(TypedDict):
    enabled: bool


class Readable(Protocol):
    def read(self) -> Union[str, bytes]:
        ...


FileInput = Union[str, bytes, bytearray, memoryview, Path, Readable]
CreateZipFiles = Mapping[str, FileInput]
DeploymentFilesInput = CreateZipFiles


class UploadProgressCallback(Protocol):
    def __call__(self, progress: "UploadProgress", /) -> None:
        ...


class DeploymentProgressCallback(Protocol):
    def __call__(self, progress: "DeploymentProgress", /) -> None:
        ...


class SshUserPasswordRevealResult(TypedDict):
    password: Optional[str]
    ssh_user: "SshUser"
    sshUser: "SshUser"


class SshUserPasswordRotateResult(TypedDict):
    password: str
    ssh_user: "SshUser"
    sshUser: "SshUser"


class SshTokenCreateResult(TypedDict):
    token: str
