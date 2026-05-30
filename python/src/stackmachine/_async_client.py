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
from ._transport import AsyncTransport
from ._uploads import AsyncUploader
from .resources.apps import AsyncDeployAppsResource
from .resources.deployments import AsyncDeploymentsResource
from .resources.files import AsyncFilesResource


class AsyncStackMachine:
    def __init__(
        self,
        api_key: str,
        *,
        api_url: str = DEFAULT_API_URL,
        headers: Optional[Mapping[str, str]] = None,
        timeout: float = DEFAULT_TIMEOUT,
        max_network_retries: int = DEFAULT_MAX_NETWORK_RETRIES,
        http_client: Optional[httpx.AsyncClient] = None,
        http_transport: Optional[httpx.AsyncBaseTransport] = None,
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
        self._transport = AsyncTransport(
            api_key,
            self._config,
            http_client=http_client,
            http_transport=http_transport,
        )
        self.deployments = AsyncDeploymentsResource(self)
        self.apps = AsyncDeployAppsResource(self, self.deployments)
        self.files = AsyncFilesResource(self, AsyncUploader(self._transport))

    @classmethod
    def init(
        cls,
        settings: Optional[Mapping[str, Any]] = None,
        **kwargs: Any,
    ) -> "AsyncStackMachine":
        values = {**dict(settings or {}), **kwargs}
        api_key = values.pop("api_key", None) or values.pop("token", None) or ""
        if "apiUrl" in values:
            values["api_url"] = values.pop("apiUrl")
        if "maxNetworkRetries" in values:
            values["max_network_retries"] = values.pop("maxNetworkRetries")
        return cls(api_key, **values)

    async def close(self) -> None:
        await self._transport.close()

    async def __aenter__(self) -> "AsyncStackMachine":
        return self

    async def __aexit__(self, *exc_info: object) -> None:
        await self.close()

    async def _query(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> Any:
        return await self._transport.execute(
            query,
            variables,
            request_options=request_options,
        )

    async def _mutation(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> Any:
        return await self._transport.execute(
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

    async def viewer(
        self, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> Optional[Viewer]:
        response = await self._query(
            gql.VIEWER_QUERY, {}, request_options=request_options
        )
        viewer = response.get("viewer") if response else None
        return Viewer(username=viewer["username"]) if viewer else None
