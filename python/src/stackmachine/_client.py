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
from ._uploads import SyncUploader
from .resources.apps import DeployAppsResource
from .resources.deployments import DeploymentsResource
from .resources.files import FilesResource


class StackMachine:
    def __init__(
        self,
        api_key: str,
        *,
        api_url: str = DEFAULT_API_URL,
        headers: Optional[Mapping[str, str]] = None,
        timeout: float = DEFAULT_TIMEOUT,
        max_network_retries: int = DEFAULT_MAX_NETWORK_RETRIES,
        http_client: Optional[httpx.Client] = None,
        http_transport: Optional[httpx.BaseTransport] = None,
    ) -> None:
        self.api_key = api_key
        self.api_url = api_url
        self.apiUrl = api_url
        self.timeout = timeout
        self.max_network_retries = max_network_retries
        self.maxNetworkRetries = max_network_retries
        self._config = ClientConfig(
            api_url=api_url,
            headers=headers,
            timeout=timeout,
            max_network_retries=max_network_retries,
        )
        self._transport = SyncTransport(
            api_key,
            self._config,
            http_client=http_client,
            http_transport=http_transport,
        )
        self.deployments = DeploymentsResource(self)
        self.apps = DeployAppsResource(self, self.deployments)
        self.files = FilesResource(self, SyncUploader(self._transport))

    @classmethod
    def init(
        cls,
        settings: Optional[Mapping[str, Any]] = None,
        **kwargs: Any,
    ) -> "StackMachine":
        values = {**dict(settings or {}), **kwargs}
        api_key = values.pop("api_key", None) or values.pop("token", None) or ""
        if "apiUrl" in values:
            values["api_url"] = values.pop("apiUrl")
        if "maxNetworkRetries" in values:
            values["max_network_retries"] = values.pop("maxNetworkRetries")
        return cls(api_key, **values)

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
        request_options: Optional[Mapping[str, Any]] = None,
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
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> Any:
        return self._transport.execute(
            query,
            variables,
            request_options=request_options,
            mutation=True,
        )

    def _subscribe_deployment(
        self, build_id: str, request_options: Optional[Mapping[str, Any]] = None
    ):
        return self._transport.subscribe(
            gql.AUTOBUILD_SUBSCRIPTION,
            {"buildId": build_id},
            request_options=request_options,
        )

    def viewer(
        self, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> Optional[Viewer]:
        response = self._query(gql.VIEWER_QUERY, {}, request_options=request_options)
        viewer = response.get("viewer") if response else None
        return Viewer(username=viewer["username"]) if viewer else None
