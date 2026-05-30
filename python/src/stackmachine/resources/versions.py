from __future__ import annotations

from datetime import datetime
from typing import Any, Mapping, Optional, Sequence

from .._graphql import operations as gql
from .._models import DeployAppVersion, Log
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from ._shared import page_variables


def _iso(value: Optional[datetime]) -> Optional[str]:
    return value.isoformat() if value else None


class AppsVersionsLogsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        version: str,
        since: Optional[datetime] = None,
        until: Optional[datetime] = None,
        instance_id: Optional[str] = None,
        request_id: Optional[str] = None,
        streams: Optional[Sequence[str]] = None,
        text_search: Optional[str] = None,
        request_options: Optional[Mapping[str, Any]] = None,
        **pagination: Any,
    ) -> StackMachineList[Log]:
        params = {
            "version": version,
            "since": since,
            "until": until,
            "instance_id": instance_id,
            "request_id": request_id,
            "streams": streams,
            "text_search": text_search,
            **pagination,
        }

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.GET_APP_LOGS_QUERY,
                {
                    "appId": page_params["version"],
                    "since": _iso(page_params.get("since")),
                    "until": _iso(page_params.get("until")),
                    "instanceId": page_params.get("instance_id"),
                    "requestId": page_params.get("request_id"),
                    "streams": page_params.get("streams"),
                    "textSearch": page_params.get("text_search"),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("logs") if response else None),
                Log.from_graphql,
            )

        return create_list(params, "/v1/apps/versions/logs", fetch_page)


class AsyncAppsVersionsLogsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        version: str,
        since: Optional[datetime] = None,
        until: Optional[datetime] = None,
        instance_id: Optional[str] = None,
        request_id: Optional[str] = None,
        streams: Optional[Sequence[str]] = None,
        text_search: Optional[str] = None,
        request_options: Optional[Mapping[str, Any]] = None,
        **pagination: Any,
    ) -> AsyncStackMachineListRequest[Log]:
        params = {
            "version": version,
            "since": since,
            "until": until,
            "instance_id": instance_id,
            "request_id": request_id,
            "streams": streams,
            "text_search": text_search,
            **pagination,
        }

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.GET_APP_LOGS_QUERY,
                {
                    "appId": page_params["version"],
                    "since": _iso(page_params.get("since")),
                    "until": _iso(page_params.get("until")),
                    "instanceId": page_params.get("instance_id"),
                    "requestId": page_params.get("request_id"),
                    "streams": page_params.get("streams"),
                    "textSearch": page_params.get("text_search"),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("logs") if response else None),
                Log.from_graphql,
            )

        return create_async_list(params, "/v1/apps/versions/logs", fetch_page)


class AppsVersionsResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.logs = AppsVersionsLogsResource(client)

    def list(
        self,
        *,
        app: str,
        created_after: Optional[datetime] = None,
        sort_by: str = "NEWEST",
        request_options: Optional[Mapping[str, Any]] = None,
        **pagination: Any,
    ) -> StackMachineList[DeployAppVersion]:
        params = {
            "app": app,
            "created_after": created_after,
            "sort_by": sort_by,
            **pagination,
        }

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_APP_VERSIONS_QUERY,
                {
                    "appId": page_params["app"],
                    "createdAfter": _iso(page_params.get("created_after")),
                    "sortBy": page_params.get("sort_by") or "NEWEST",
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("versions") if response else None),
                DeployAppVersion.from_graphql,
            )

        return create_list(params, "/v1/apps/versions", fetch_page)


class AsyncAppsVersionsResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.logs = AsyncAppsVersionsLogsResource(client)

    def list(
        self,
        *,
        app: str,
        created_after: Optional[datetime] = None,
        sort_by: str = "NEWEST",
        request_options: Optional[Mapping[str, Any]] = None,
        **pagination: Any,
    ) -> AsyncStackMachineListRequest[DeployAppVersion]:
        params = {
            "app": app,
            "created_after": created_after,
            "sort_by": sort_by,
            **pagination,
        }

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_APP_VERSIONS_QUERY,
                {
                    "appId": page_params["app"],
                    "createdAfter": _iso(page_params.get("created_after")),
                    "sortBy": page_params.get("sort_by") or "NEWEST",
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("versions") if response else None),
                DeployAppVersion.from_graphql,
            )

        return create_async_list(params, "/v1/apps/versions", fetch_page)
