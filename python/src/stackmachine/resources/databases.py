from __future__ import annotations

from typing import Any, Mapping, Optional

from typing_extensions import Unpack

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import AppDatabase, AppDatabaseCredentialsResult
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


class AppsDatabasesResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        app: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[AppDatabase]:
        params = {"app": app, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_APP_DATABASES_QUERY,
                {"appId": page_params["app"], **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("databases") if response else None),
                AppDatabase.from_graphql,
            )

        return create_list(params, "/v1/apps/databases", fetch_page)

    def create(
        self,
        *,
        app: str,
        name: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppDatabaseCredentialsResult:
        response = self._client._mutation(
            gql.CREATE_APP_DATABASE_MUTATION,
            {"input": {"id": app, "name": name}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("createAppDb") if response else None,
            "Failed to create database, mutation failed.",
            "srcCreateAppDatabaseMutation",
        )
        database = required_payload(
            payload.get("database"),
            "Failed to create database, no database returned.",
            "srcCreateAppDatabaseMutation",
        )
        password = required_payload(
            payload.get("password"),
            "Failed to create database, no password returned.",
            "srcCreateAppDatabaseMutation",
        )
        return AppDatabaseCredentialsResult(
            database=AppDatabase.from_graphql(database),
            password=str(password),
        )

    def rotate_credentials(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> AppDatabaseCredentialsResult:
        response = self._client._mutation(
            gql.ROTATE_APP_DATABASE_CREDENTIALS_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("rotateCredentialsForAppDb") if response else None,
            "Failed to rotate database credentials, mutation failed.",
            "srcRotateAppDatabaseCredentialsMutation",
        )
        database = required_payload(
            payload.get("database"),
            "Failed to rotate database credentials, no database returned.",
            "srcRotateAppDatabaseCredentialsMutation",
        )
        password = required_payload(
            payload.get("password"),
            "Failed to rotate database credentials, no password returned.",
            "srcRotateAppDatabaseCredentialsMutation",
        )
        return AppDatabaseCredentialsResult(
            database=AppDatabase.from_graphql(database),
            password=str(password),
        )

    def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_APP_DATABASE_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteAppDb") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete database, mutation was not successful.",
                operation_name="srcDeleteAppDatabaseMutation",
            )

    del_ = delete
    rotateCredentials = rotate_credentials


class AsyncAppsDatabasesResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        app: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[AppDatabase]:
        params = {"app": app, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_APP_DATABASES_QUERY,
                {"appId": page_params["app"], **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("databases") if response else None),
                AppDatabase.from_graphql,
            )

        return create_async_list(params, "/v1/apps/databases", fetch_page)

    async def create(
        self,
        *,
        app: str,
        name: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppDatabaseCredentialsResult:
        response = await self._client._mutation(
            gql.CREATE_APP_DATABASE_MUTATION,
            {"input": {"id": app, "name": name}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("createAppDb") if response else None,
            "Failed to create database, mutation failed.",
            "srcCreateAppDatabaseMutation",
        )
        database = required_payload(
            payload.get("database"),
            "Failed to create database, no database returned.",
            "srcCreateAppDatabaseMutation",
        )
        password = required_payload(
            payload.get("password"),
            "Failed to create database, no password returned.",
            "srcCreateAppDatabaseMutation",
        )
        return AppDatabaseCredentialsResult(
            database=AppDatabase.from_graphql(database),
            password=str(password),
        )

    async def rotate_credentials(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> AppDatabaseCredentialsResult:
        response = await self._client._mutation(
            gql.ROTATE_APP_DATABASE_CREDENTIALS_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("rotateCredentialsForAppDb") if response else None,
            "Failed to rotate database credentials, mutation failed.",
            "srcRotateAppDatabaseCredentialsMutation",
        )
        database = required_payload(
            payload.get("database"),
            "Failed to rotate database credentials, no database returned.",
            "srcRotateAppDatabaseCredentialsMutation",
        )
        password = required_payload(
            payload.get("password"),
            "Failed to rotate database credentials, no password returned.",
            "srcRotateAppDatabaseCredentialsMutation",
        )
        return AppDatabaseCredentialsResult(
            database=AppDatabase.from_graphql(database),
            password=str(password),
        )

    async def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_APP_DATABASE_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteAppDb") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete database, mutation was not successful.",
                operation_name="srcDeleteAppDatabaseMutation",
            )

    del_ = delete
    rotateCredentials = rotate_credentials
