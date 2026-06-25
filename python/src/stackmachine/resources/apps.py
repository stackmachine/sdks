from __future__ import annotations

from typing import Any, List, Mapping, Optional

from typing_extensions import Unpack

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import DeployApp
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import (
    DeployAppAutobuildInput,
    DeployAppsSortBy,
    PaginationOptions,
    RequestOptionsLike,
    UploadProgressCallback,
)
from ._shared import page_variables, resource_missing_error
from .databases import AppsDatabasesResource, AsyncAppsDatabasesResource
from .deployments import (
    AsyncDeployment,
    AsyncDeploymentsResource,
    Deployment,
    DeploymentsResource,
)
from .domains import AppsDomainsResource, AsyncAppsDomainsResource
from .git import AppsGitResource, AsyncAppsGitResource
from .ssh import AppsSshResource, AsyncAppsSshResource
from .versions import AppsVersionsResource, AsyncAppsVersionsResource
from .volumes import AppsVolumesResource, AsyncAppsVolumesResource


class DeployAppsResource:
    def __init__(self, client: Any, deployments: DeploymentsResource) -> None:
        self._client = client
        self._deployments = deployments
        self.databases = AppsDatabasesResource(client)
        self.domains = AppsDomainsResource(client)
        self.git = AppsGitResource(client)
        self.volumes = AppsVolumesResource(client)
        self.versions = AppsVersionsResource(client)
        self.ssh = AppsSshResource(client)

    def list(
        self,
        *,
        collaborating: Optional[bool] = None,
        sort_by: DeployAppsSortBy = "NEWEST",
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[DeployApp]:
        params = {
            "collaborating": collaborating,
            "sort_by": sort_by,
            **pagination,
        }

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_APPS_QUERY,
                {
                    "sortBy": page_params.get("sort_by") or "NEWEST",
                    "collaborating": page_params.get("collaborating"),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("viewer") or {}).get("apps") if response else None),
                DeployApp.from_graphql,
            )

        return create_list(params, "/v1/apps", fetch_page)

    def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DeployApp:
        response = self._client._query(
            gql.GET_APP_BY_ID_QUERY,
            {"id": id},
            request_options=request_options,
        )
        app = response.get("app") if response else None
        if not app or app.get("__typename") != "DeployApp":
            raise resource_missing_error("app", id, "srcGetAppByIdQuery")
        return DeployApp.from_graphql(app)

    def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[DeployApp]]:
        if not ids:
            return []
        response = self._client._query(
            gql.GET_APPS_BY_IDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[DeployApp]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                DeployApp.from_graphql(node)
                if node and node.get("__typename") == "DeployApp"
                else None
            )
        return result

    def retrieve_by_name(
        self,
        name: str,
        owner: Optional[str] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> DeployApp:
        response = self._client._query(
            gql.GET_APP_BY_NAME_QUERY,
            {"name": name, "owner": owner},
            request_options=request_options,
        )
        app = response.get("app") if response else None
        if not app:
            identifier = f"{owner}/{name}" if owner else name
            raise resource_missing_error(
                "app", identifier, "srcGetAppByNameQuery", "name"
            )
        return DeployApp.from_graphql(app)

    def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_APP_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteApp") or {}).get("success"):
            raise StackMachineAPIError(
                "The app could not be deleted.",
                operation_name="srcDeleteAppMutation",
            )

    def autobuild(
        self,
        input: Optional[DeployAppAutobuildInput] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
        chunk_size: Optional[int] = None,
        on_upload_progress: Optional[UploadProgressCallback] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
        **kwargs: Unpack[DeployAppAutobuildInput],
    ) -> Deployment:
        return self._deployments.create(
            input,
            request_options=request_options,
            chunk_size=chunk_size,
            on_upload_progress=on_upload_progress,
            timeout=timeout,
            max_network_retries=max_network_retries,
            **kwargs,
        )

    del_ = delete
    retrieveMany = retrieve_many
    retrieveByName = retrieve_by_name


class AsyncDeployAppsResource:
    def __init__(self, client: Any, deployments: AsyncDeploymentsResource) -> None:
        self._client = client
        self._deployments = deployments
        self.databases = AsyncAppsDatabasesResource(client)
        self.domains = AsyncAppsDomainsResource(client)
        self.git = AsyncAppsGitResource(client)
        self.volumes = AsyncAppsVolumesResource(client)
        self.versions = AsyncAppsVersionsResource(client)
        self.ssh = AsyncAppsSshResource(client)

    def list(
        self,
        *,
        collaborating: Optional[bool] = None,
        sort_by: DeployAppsSortBy = "NEWEST",
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[DeployApp]:
        params = {
            "collaborating": collaborating,
            "sort_by": sort_by,
            **pagination,
        }

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_APPS_QUERY,
                {
                    "sortBy": page_params.get("sort_by") or "NEWEST",
                    "collaborating": page_params.get("collaborating"),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("viewer") or {}).get("apps") if response else None),
                DeployApp.from_graphql,
            )

        return create_async_list(params, "/v1/apps", fetch_page)

    async def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DeployApp:
        response = await self._client._query(
            gql.GET_APP_BY_ID_QUERY,
            {"id": id},
            request_options=request_options,
        )
        app = response.get("app") if response else None
        if not app or app.get("__typename") != "DeployApp":
            raise resource_missing_error("app", id, "srcGetAppByIdQuery")
        return DeployApp.from_graphql(app)

    async def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[DeployApp]]:
        if not ids:
            return []
        response = await self._client._query(
            gql.GET_APPS_BY_IDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[DeployApp]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                DeployApp.from_graphql(node)
                if node and node.get("__typename") == "DeployApp"
                else None
            )
        return result

    async def retrieve_by_name(
        self,
        name: str,
        owner: Optional[str] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> DeployApp:
        response = await self._client._query(
            gql.GET_APP_BY_NAME_QUERY,
            {"name": name, "owner": owner},
            request_options=request_options,
        )
        app = response.get("app") if response else None
        if not app:
            identifier = f"{owner}/{name}" if owner else name
            raise resource_missing_error(
                "app", identifier, "srcGetAppByNameQuery", "name"
            )
        return DeployApp.from_graphql(app)

    async def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_APP_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteApp") or {}).get("success"):
            raise StackMachineAPIError(
                "The app could not be deleted.",
                operation_name="srcDeleteAppMutation",
            )

    async def autobuild(
        self,
        input: Optional[DeployAppAutobuildInput] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
        chunk_size: Optional[int] = None,
        on_upload_progress: Optional[UploadProgressCallback] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
        **kwargs: Unpack[DeployAppAutobuildInput],
    ) -> AsyncDeployment:
        return await self._deployments.create(
            input,
            request_options=request_options,
            chunk_size=chunk_size,
            on_upload_progress=on_upload_progress,
            timeout=timeout,
            max_network_retries=max_network_retries,
            **kwargs,
        )

    del_ = delete
    retrieveMany = retrieve_many
    retrieveByName = retrieve_by_name
