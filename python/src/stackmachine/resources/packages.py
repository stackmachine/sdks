from __future__ import annotations

from typing import Any, Mapping, Optional

from typing_extensions import Unpack

from .._graphql import operations as gql
from .._models import SearchPackageVersion
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import PackagesFilter, PaginationOptions, RequestOptionsLike
from .._utils import camelize
from ._shared import page_variables


def _search_variables(
    page_params: Mapping[str, Any], normalized: NormalizedPagination
) -> dict:
    return {
        "query": page_params.get("query") or "",
        "packages": camelize(page_params.get("filter") or {}),
        **page_variables(normalized),
    }


class PackagesResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def search(
        self,
        *,
        query: str = "",
        filter: Optional[PackagesFilter] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[SearchPackageVersion]:
        params = {"query": query, "filter": filter, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.SEARCH_PACKAGES_QUERY,
                _search_variables(page_params, normalized),
                request_options=request_options,
            )
            return connection_to_page_data(
                response.get("search") if response else None,
                SearchPackageVersion.from_graphql,
            )

        return create_list(params, "/v1/packages", fetch_page)


class AsyncPackagesResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def search(
        self,
        *,
        query: str = "",
        filter: Optional[PackagesFilter] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[SearchPackageVersion]:
        params = {"query": query, "filter": filter, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.SEARCH_PACKAGES_QUERY,
                _search_variables(page_params, normalized),
                request_options=request_options,
            )
            return connection_to_page_data(
                response.get("search") if response else None,
                SearchPackageVersion.from_graphql,
            )

        return create_async_list(params, "/v1/packages", fetch_page)
