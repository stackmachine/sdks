from __future__ import annotations

from typing import Any, Mapping, Optional

import httpx

from ._config import (
    DEFAULT_API_URL,
    DEFAULT_MAX_NETWORK_RETRIES,
    DEFAULT_TIMEOUT,
    ClientConfig,
)
from ._graphql import operations as gql
from ._models import Viewer
from ._transport import SyncTransport
from ._types import Headers, RequestOptionsLike, StackMachineInitSettings
from ._uploads import SyncUploader
from .resources.apps import DeployAppsResource
from .resources.deployments import DeploymentsResource
from .resources.dns import DNSResource
from .resources.emails import EmailsResource
from .resources.files import FilesResource


class StackMachine:
    def __init__(
        self,
        api_key: str,
        *,
        api_url: Optional[str] = None,
        apiUrl: Optional[str] = None,
        headers: Optional[Headers] = None,
        timeout: float = DEFAULT_TIMEOUT,
        max_network_retries: Optional[int] = None,
        maxNetworkRetries: Optional[int] = None,
        http_client: Optional[httpx.Client] = None,
        http_transport: Optional[httpx.BaseTransport] = None,
    ) -> None:
        resolved_api_url = (
            api_url if api_url is not None else apiUrl or DEFAULT_API_URL
        )
        resolved_max_retries = (
            max_network_retries
            if max_network_retries is not None
            else maxNetworkRetries
            if maxNetworkRetries is not None
            else DEFAULT_MAX_NETWORK_RETRIES
        )
        self.api_key = api_key
        self.api_url = resolved_api_url
        self.apiUrl = resolved_api_url
        self.timeout = timeout
        self.max_network_retries = resolved_max_retries
        self.maxNetworkRetries = resolved_max_retries
        self._config = ClientConfig(
            api_url=resolved_api_url,
            headers=headers,
            timeout=timeout,
            max_network_retries=resolved_max_retries,
        )
        self._transport = SyncTransport(
            api_key,
            self._config,
            http_client=http_client,
            http_transport=http_transport,
        )
        self.deployments = DeploymentsResource(self)
        self.apps = DeployAppsResource(self, self.deployments)
        self.dns = DNSResource(self)
        self.emails = EmailsResource(self)
        self.files = FilesResource(self, SyncUploader(self._transport))

    @classmethod
    def init(
        cls,
        settings: Optional[StackMachineInitSettings] = None,
        *,
        api_key: Optional[str] = None,
        apiKey: Optional[str] = None,
        token: Optional[str] = None,
        api_url: Optional[str] = None,
        apiUrl: Optional[str] = None,
        headers: Optional[Headers] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
        maxNetworkRetries: Optional[int] = None,
        http_client: Optional[httpx.Client] = None,
        http_transport: Optional[httpx.BaseTransport] = None,
    ) -> "StackMachine":
        values: StackMachineInitSettings = {} if settings is None else settings
        resolved_api_key = (
            api_key
            if api_key is not None
            else apiKey
            if apiKey is not None
            else token
            if token is not None
            else values.get("api_key")
            or values.get("apiKey")
            or values.get("token")
            or ""
        )
        settings_timeout = values.get("timeout")
        resolved_timeout = (
            timeout
            if timeout is not None
            else settings_timeout
            if settings_timeout is not None
            else DEFAULT_TIMEOUT
        )
        resolved_api_url = (
            api_url
            if api_url is not None
            else apiUrl
            if apiUrl is not None
            else values.get("api_url")
            or values.get("apiUrl")
            or DEFAULT_API_URL
        )
        settings_max_retries = (
            values.get("max_network_retries")
            if values.get("max_network_retries") is not None
            else values.get("maxNetworkRetries")
        )
        resolved_max_retries = (
            max_network_retries
            if max_network_retries is not None
            else maxNetworkRetries
            if maxNetworkRetries is not None
            else settings_max_retries
            if settings_max_retries is not None
            else DEFAULT_MAX_NETWORK_RETRIES
        )
        return cls(
            resolved_api_key,
            api_url=resolved_api_url,
            headers=headers if headers is not None else values.get("headers"),
            timeout=resolved_timeout,
            max_network_retries=resolved_max_retries,
            http_client=(
                http_client if http_client is not None else values.get("http_client")
            ),
            http_transport=(
                http_transport
                if http_transport is not None
                else values.get("http_transport")
            ),
        )

    def close(self) -> None:
        self._transport.close()

    def __enter__(self) -> "StackMachine":
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.close()

    def _query(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> Any:
        return self._transport.execute(
            query,
            variables,
            request_options=request_options,
        )

    def _mutation(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> Any:
        return self._transport.execute(
            query,
            variables,
            request_options=request_options,
            mutation=True,
        )

    def _subscribe_deployment(
        self, build_id: str, request_options: Optional[RequestOptionsLike] = None
    ):
        return self._transport.subscribe(
            gql.AUTOBUILD_SUBSCRIPTION,
            {"buildId": build_id},
            request_options=request_options,
        )

    def viewer(
        self, *, request_options: Optional[RequestOptionsLike] = None
    ) -> Optional[Viewer]:
        response = self._query(gql.VIEWER_QUERY, {}, request_options=request_options)
        viewer = response.get("viewer") if response else None
        return Viewer(username=viewer["username"]) if viewer else None
