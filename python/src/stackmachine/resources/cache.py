from __future__ import annotations

from typing import Any, Optional

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import AppCache
from .._types import RequestOptionsLike
from ._shared import resource_missing_error


class AppsCacheResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def retrieve(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> AppCache:
        response = self._client._query(
            gql.GET_APP_CACHE_QUERY,
            {"id": app_id},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        if not node or node.get("__typename") != "DeployApp":
            raise resource_missing_error("app", app_id, "srcGetAppCacheQuery", "app")
        return AppCache.from_graphql(node)

    def update(
        self,
        app_id: str,
        *,
        enabled: bool,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> None:
        response = self._client._mutation(
            gql.CONFIGURE_APP_CDN_CACHE_MUTATION,
            {"app": app_id, "config": {"enabled": enabled}},
            request_options=request_options,
        )
        if not (response.get("configureAppCdnCache") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to configure app CDN cache.",
                operation_name="srcConfigureAppCdnCacheMutation",
            )

    def purge(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.PURGE_APP_CDN_CACHE_MUTATION,
            {"app": app_id},
            request_options=request_options,
        )
        if not (response.get("purgeAppCdnCache") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to purge app CDN cache.",
                operation_name="srcPurgeAppCdnCacheMutation",
            )


class AsyncAppsCacheResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def retrieve(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> AppCache:
        response = await self._client._query(
            gql.GET_APP_CACHE_QUERY,
            {"id": app_id},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        if not node or node.get("__typename") != "DeployApp":
            raise resource_missing_error("app", app_id, "srcGetAppCacheQuery", "app")
        return AppCache.from_graphql(node)

    async def update(
        self,
        app_id: str,
        *,
        enabled: bool,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> None:
        response = await self._client._mutation(
            gql.CONFIGURE_APP_CDN_CACHE_MUTATION,
            {"app": app_id, "config": {"enabled": enabled}},
            request_options=request_options,
        )
        if not (response.get("configureAppCdnCache") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to configure app CDN cache.",
                operation_name="srcConfigureAppCdnCacheMutation",
            )

    async def purge(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.PURGE_APP_CDN_CACHE_MUTATION,
            {"app": app_id},
            request_options=request_options,
        )
        if not (response.get("purgeAppCdnCache") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to purge app CDN cache.",
                operation_name="srcPurgeAppCdnCacheMutation",
            )
