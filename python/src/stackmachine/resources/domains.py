from __future__ import annotations

from typing import Any, Mapping, Optional

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import AppAlias
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from ._shared import page_variables, required_payload, resource_missing_error


class AppsDomainsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def retrieve_many(
        self, ids: list[str], *, request_options: Optional[Mapping[str, Any]] = None
    ) -> list[Optional[AppAlias]]:
        if not ids:
            return []
        response = self._client._query(
            gql.GET_APP_ALIASES_QUERY, {"ids": ids}, request_options=request_options
        )
        nodes = response.get("nodes") or []
        result: list[Optional[AppAlias]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                AppAlias.from_graphql(node)
                if node and node.get("__typename") == "AppAlias"
                else None
            )
        return result

    def retrieve(
        self, id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> AppAlias:
        alias = self.retrieve_many([id], request_options=request_options)[0]
        if not alias:
            raise resource_missing_error("domain", id, "srcGetAppAliasesQuery")
        return alias

    def list(
        self,
        *,
        app: str,
        sort_by: str = "NEWEST",
        request_options: Optional[Mapping[str, Any]] = None,
        **pagination: Any,
    ) -> StackMachineList[AppAlias]:
        params = {"app": app, "sort_by": sort_by, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_APP_DOMAINS_QUERY,
                {
                    "appId": page_params["app"],
                    "sortBy": (
                        page_params.get("sort_by")
                        or page_params.get("sortBy")
                        or "NEWEST"
                    ),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("domains") if response else None),
                AppAlias.from_graphql,
            )

        return create_list(params, "/v1/apps/domains", fetch_page)

    def create(
        self,
        *,
        app: str,
        hostname: str,
        is_default: Optional[bool] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> AppAlias:
        response = self._client._mutation(
            gql.UPSERT_APP_DOMAIN_MUTATION,
            {
                "input": {
                    "appId": app,
                    "name": hostname,
                    "isDefault": is_default,
                    "wait": False,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("upsertAppDomain") if response else None,
            "Failed to create domain, mutation failed.",
            "srcUpsertAppDomainMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to create domain, mutation was not successful.",
                operation_name="srcUpsertAppDomainMutation",
            )
        domains = required_payload(
            payload.get("domains"),
            "Failed to create domain, no domains returned.",
            "srcUpsertAppDomainMutation",
        )
        aliases = [AppAlias.from_graphql(domain) for domain in domains or [] if domain]
        for alias in aliases:
            if any(record.host == hostname for record in alias.expected_dns_records):
                return alias
        raise StackMachineAPIError(
            "Failed to create domain, domain not found in returned domains.",
            operation_name="srcUpsertAppDomainMutation",
        )

    def verify(
        self, id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> bool:
        response = self._client._mutation(
            gql.VERIFY_APP_DOMAIN_MUTATION,
            {"input": {"domainId": id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("verifyAppDomain") if response else None,
            "Failed to verify domain, mutation was not successful.",
            "srcVerifyAppDomainMutation",
        )
        return bool(payload.get("verified"))

    def delete(
        self, id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_APP_DOMAIN_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteAppDomain") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete domain, mutation was not successful.",
                operation_name="srcDeleteAppDomainMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many


class AsyncAppsDomainsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def retrieve_many(
        self, ids: list[str], *, request_options: Optional[Mapping[str, Any]] = None
    ) -> list[Optional[AppAlias]]:
        if not ids:
            return []
        response = await self._client._query(
            gql.GET_APP_ALIASES_QUERY, {"ids": ids}, request_options=request_options
        )
        nodes = response.get("nodes") or []
        result: list[Optional[AppAlias]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                AppAlias.from_graphql(node)
                if node and node.get("__typename") == "AppAlias"
                else None
            )
        return result

    async def retrieve(
        self, id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> AppAlias:
        alias = (await self.retrieve_many([id], request_options=request_options))[0]
        if not alias:
            raise resource_missing_error("domain", id, "srcGetAppAliasesQuery")
        return alias

    def list(
        self,
        *,
        app: str,
        sort_by: str = "NEWEST",
        request_options: Optional[Mapping[str, Any]] = None,
        **pagination: Any,
    ) -> AsyncStackMachineListRequest[AppAlias]:
        params = {"app": app, "sort_by": sort_by, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_APP_DOMAINS_QUERY,
                {
                    "appId": page_params["app"],
                    "sortBy": (
                        page_params.get("sort_by")
                        or page_params.get("sortBy")
                        or "NEWEST"
                    ),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("domains") if response else None),
                AppAlias.from_graphql,
            )

        return create_async_list(params, "/v1/apps/domains", fetch_page)

    async def create(
        self,
        *,
        app: str,
        hostname: str,
        is_default: Optional[bool] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> AppAlias:
        response = await self._client._mutation(
            gql.UPSERT_APP_DOMAIN_MUTATION,
            {
                "input": {
                    "appId": app,
                    "name": hostname,
                    "isDefault": is_default,
                    "wait": False,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("upsertAppDomain") if response else None,
            "Failed to create domain, mutation failed.",
            "srcUpsertAppDomainMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to create domain, mutation was not successful.",
                operation_name="srcUpsertAppDomainMutation",
            )
        domains = required_payload(
            payload.get("domains"),
            "Failed to create domain, no domains returned.",
            "srcUpsertAppDomainMutation",
        )
        aliases = [AppAlias.from_graphql(domain) for domain in domains or [] if domain]
        for alias in aliases:
            if any(record.host == hostname for record in alias.expected_dns_records):
                return alias
        raise StackMachineAPIError(
            "Failed to create domain, domain not found in returned domains.",
            operation_name="srcUpsertAppDomainMutation",
        )

    async def verify(
        self, id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> bool:
        response = await self._client._mutation(
            gql.VERIFY_APP_DOMAIN_MUTATION,
            {"input": {"domainId": id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("verifyAppDomain") if response else None,
            "Failed to verify domain, mutation was not successful.",
            "srcVerifyAppDomainMutation",
        )
        return bool(payload.get("verified"))

    async def delete(
        self, id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_APP_DOMAIN_MUTATION,
            {"input": {"id": id}},
            request_options=request_options,
        )
        if not (response.get("deleteAppDomain") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete domain, mutation was not successful.",
                operation_name="srcDeleteAppDomainMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many
