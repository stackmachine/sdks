from __future__ import annotations

from typing import Any, Mapping, Optional

from typing_extensions import Unpack

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import AppVolume
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import PaginationOptions, RequestOptionsLike
from ._shared import page_variables, required_payload


class AppsVolumesResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        app: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[AppVolume]:
        params = {"app": app, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_APP_VOLUMES_QUERY,
                {"appId": page_params["app"], **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("volumes") if response else None),
                AppVolume.from_graphql,
            )

        return create_list(params, "/v1/apps/volumes", fetch_page)

    def create(
        self,
        *,
        app: str,
        mount_path: str,
        max_size_bytes: Optional[int] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppVolume:
        response = self._client._mutation(
            gql.CREATE_APP_VOLUME_MUTATION,
            {
                "input": {
                    "appId": app,
                    "mountPath": mount_path,
                    "maxSizeBytes": max_size_bytes,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("createAppVolume") if response else None,
            "Failed to create volume, mutation failed.",
            "srcCreateAppVolumeMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to create volume, mutation was not successful.",
                operation_name="srcCreateAppVolumeMutation",
            )
        volume = required_payload(
            payload.get("volume"),
            "Failed to create volume, no volume returned.",
            "srcCreateAppVolumeMutation",
        )
        return AppVolume.from_graphql(volume)

    def update(
        self,
        id: str,
        *,
        mount_path: Optional[str] = None,
        max_size_bytes: Optional[int] = None,
        redeploy_app: Optional[bool] = None,
        s3_enabled: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppVolume:
        response = self._client._mutation(
            gql.UPDATE_VOLUME_MUTATION,
            {
                "input": {
                    "id": id,
                    "mountPath": mount_path,
                    "maxSizeBytes": max_size_bytes,
                    "redeployApp": redeploy_app,
                    "s3Enabled": s3_enabled,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("updateVolume") if response else None,
            "Failed to update volume, mutation failed.",
            "srcUpdateVolumeMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to update volume, mutation was not successful.",
                operation_name="srcUpdateVolumeMutation",
            )
        volume = required_payload(
            payload.get("volume"),
            "Failed to update volume, no volume returned.",
            "srcUpdateVolumeMutation",
        )
        return AppVolume.from_graphql(volume)

    def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_APP_VOLUME_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteAppVolume") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete volume, mutation was not successful.",
                operation_name="srcDeleteAppVolumeMutation",
            )

    del_ = delete


class AsyncAppsVolumesResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        app: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[AppVolume]:
        params = {"app": app, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_APP_VOLUMES_QUERY,
                {"appId": page_params["app"], **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("volumes") if response else None),
                AppVolume.from_graphql,
            )

        return create_async_list(params, "/v1/apps/volumes", fetch_page)

    async def create(
        self,
        *,
        app: str,
        mount_path: str,
        max_size_bytes: Optional[int] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppVolume:
        response = await self._client._mutation(
            gql.CREATE_APP_VOLUME_MUTATION,
            {
                "input": {
                    "appId": app,
                    "mountPath": mount_path,
                    "maxSizeBytes": max_size_bytes,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("createAppVolume") if response else None,
            "Failed to create volume, mutation failed.",
            "srcCreateAppVolumeMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to create volume, mutation was not successful.",
                operation_name="srcCreateAppVolumeMutation",
            )
        volume = required_payload(
            payload.get("volume"),
            "Failed to create volume, no volume returned.",
            "srcCreateAppVolumeMutation",
        )
        return AppVolume.from_graphql(volume)

    async def update(
        self,
        id: str,
        *,
        mount_path: Optional[str] = None,
        max_size_bytes: Optional[int] = None,
        redeploy_app: Optional[bool] = None,
        s3_enabled: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppVolume:
        response = await self._client._mutation(
            gql.UPDATE_VOLUME_MUTATION,
            {
                "input": {
                    "id": id,
                    "mountPath": mount_path,
                    "maxSizeBytes": max_size_bytes,
                    "redeployApp": redeploy_app,
                    "s3Enabled": s3_enabled,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("updateVolume") if response else None,
            "Failed to update volume, mutation failed.",
            "srcUpdateVolumeMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to update volume, mutation was not successful.",
                operation_name="srcUpdateVolumeMutation",
            )
        volume = required_payload(
            payload.get("volume"),
            "Failed to update volume, no volume returned.",
            "srcUpdateVolumeMutation",
        )
        return AppVolume.from_graphql(volume)

    async def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_APP_VOLUME_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteAppVolume") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete volume, mutation was not successful.",
                operation_name="srcDeleteAppVolumeMutation",
            )

    del_ = delete
