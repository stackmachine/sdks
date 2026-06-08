from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Callable, List, Mapping, Optional, Sequence

from ._utils import parse_datetime


@dataclass
class Viewer:
    username: str


@dataclass
class ExpectedDNSRecord:
    host: str
    record_type: str
    value: str


@dataclass
class DeployAppKindWordPress:
    admin_url: Optional[str] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeployAppKindWordPress":
        return cls(admin_url=data.get("adminUrl"))


@dataclass
class AppAlias:
    id: str
    hostname: str
    url: str
    state: str
    redirection_http_code: Optional[str]
    redirects_from_ids: List[str]
    redirects_to_id: Optional[str]
    expected_dns_records: List[ExpectedDNSRecord]
    first_checked_at: Optional[datetime]
    last_checked_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppAlias":
        return cls(
            id=str(data["id"]),
            hostname=str(data["hostname"]),
            url=str(data["url"]),
            state=str(data["state"]),
            redirection_http_code=data.get("redirectionHttpCode"),
            redirects_from_ids=[
                str(item["id"]) for item in data.get("redirectsFrom") or [] if item
            ],
            redirects_to_id=(
                str(data["redirectsTo"]["id"]) if data.get("redirectsTo") else None
            ),
            expected_dns_records=[
                ExpectedDNSRecord(
                    host=str(record["host"]),
                    record_type=str(record["recordType"]),
                    value=str(record["value"]),
                )
                for record in data.get("expectedDnsRecords") or []
                if record
            ],
            first_checked_at=parse_datetime(data.get("firstCheckedAt")),
            last_checked_at=parse_datetime(data.get("lastCheckedAt")),
            updated_at=parse_datetime(data.get("updatedAt")),
            created_at=parse_datetime(data.get("createdAt")),
        )


@dataclass
class AppVolume:
    id: str
    volume_id: str
    mount_path: str
    max_size_bytes: int
    s3_enabled: bool
    s3_url: Optional[str]
    explorer_url: Optional[str]
    is_added_by_ui: bool

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppVolume":
        return cls(
            id=str(data["id"]),
            volume_id=str(data["volumeId"]),
            mount_path=str(data["mountPath"]),
            max_size_bytes=int(data["maxSizeBytes"]),
            s3_enabled=bool(data["s3Enabled"]),
            s3_url=str(data["s3Url"]) if data.get("s3Url") else None,
            explorer_url=(
                str(data["explorerUrl"]) if data.get("explorerUrl") else None
            ),
            is_added_by_ui=bool(data["isAddedByUi"]),
        )


@dataclass
class DeployApp:
    id: str
    will_perish_at: Optional[datetime]
    name: str
    url: str
    admin_url: str
    favicon: Optional[str]
    screenshot: Optional[str]
    active_version: Optional["DeployAppVersion"] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeployApp":
        app = cls(
            id=str(data["id"]),
            will_perish_at=parse_datetime(data.get("willPerishAt")),
            name=str(data["name"]),
            url=str(data["url"]),
            admin_url=str(data["adminUrl"]),
            favicon=data.get("favicon"),
            screenshot=data.get("screenshot"),
        )
        if data.get("activeVersion"):
            app.active_version = DeployAppVersion.from_graphql(
                data["activeVersion"], app=app
            )
        return app


@dataclass
class DeployAppVersion:
    id: str
    app: DeployApp

    @classmethod
    def from_graphql(
        cls,
        data: Mapping[str, Any],
        *,
        app: Optional[DeployApp] = None,
    ) -> "DeployAppVersion":
        resolved_app = app or DeployApp.from_graphql(data["app"])
        return cls(id=str(data["id"]), app=resolved_app)


@dataclass
class Log:
    datetime: Optional[datetime]
    instance_id: str
    message: str
    stream: Optional[str]
    timestamp: float

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "Log":
        return cls(
            datetime=parse_datetime(data.get("datetime")),
            instance_id=str(data["instanceId"]),
            message=str(data["message"]),
            stream=data.get("stream"),
            timestamp=float(data["timestamp"]),
        )


@dataclass
class SshAuthorizedKey:
    id: str
    name: Optional[str]
    public_key: str
    created_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "SshAuthorizedKey":
        return cls(
            id=str(data["id"]),
            name=data.get("name"),
            public_key=str(data["publicKey"]),
            created_at=parse_datetime(data.get("createdAt")),
        )


@dataclass
class SshUser:
    id: str
    username: str
    port: int
    server_host: str
    sftp_root_folder: str
    authentication_methods: Optional[List[str]]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "SshUser":
        methods = data.get("authenticationMethods")
        return cls(
            id=str(data["id"]),
            username=str(data["username"]),
            port=int(data["port"]),
            server_host=str(data["serverHost"]),
            sftp_root_folder=str(data["sftpRootFolder"]),
            authentication_methods=list(methods) if methods is not None else None,
        )


@dataclass
class AppSshServer:
    id: str
    enabled: bool

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppSshServer":
        return cls(id=str(data["id"]), enabled=bool(data["enabled"]))


@dataclass
class DeploymentProgress:
    kind: str
    message: Optional[str]
    datetime: Optional[datetime]
    stream: Optional[str]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeploymentProgress":
        return cls(
            kind=str(data["kind"]),
            message=data.get("message"),
            datetime=parse_datetime(data.get("datetime")),
            stream=data.get("stream"),
        )


@dataclass
class UploadProgress:
    loaded: int
    total: int
    percent: float


OnProgress = Callable[[DeploymentProgress], None]
OnUploadProgress = Callable[[UploadProgress], None]


def app_aliases_from_nodes(
    ids: Sequence[str],
    nodes: Sequence[Optional[Mapping[str, Any]]],
) -> List[Optional[AppAlias]]:
    values: List[Optional[AppAlias]] = []
    for index, _ in enumerate(ids):
        node = nodes[index] if index < len(nodes) else None
        values.append(
            AppAlias.from_graphql(node)
            if node and node.get("__typename") == "AppAlias"
            else None
        )
    return values
