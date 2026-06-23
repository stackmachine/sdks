from __future__ import annotations

from typing import Any, List, Mapping, Optional

from typing_extensions import Unpack

from .._errors import StackMachineAPIError, StackMachineValidationError
from .._graphql import operations as gql
from .._models import DNSDomain, DNSRecord
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import DNSRecordKind, PaginationOptions, RequestOptionsLike
from ._shared import page_variables, required_payload, resource_missing_error

DNS_RECORD_EXTRA_KEYS = {"caa", "mx", "soa", "srv", "sshfp"}


def _record_input(
    *,
    domain: str,
    kind: DNSRecordKind,
    name: str,
    value: str,
    ttl: Optional[int],
    record_id: Optional[str] = None,
    caa: Optional[Mapping[str, Any]] = None,
    mx: Optional[Mapping[str, Any]] = None,
    soa: Optional[Mapping[str, Any]] = None,
    srv: Optional[Mapping[str, Any]] = None,
    sshfp: Optional[Mapping[str, Any]] = None,
    extras: Mapping[str, Any],
) -> dict[str, Any]:
    unknown = sorted(set(extras) - DNS_RECORD_EXTRA_KEYS)
    if unknown:
        raise StackMachineValidationError(
            f"Unknown DNS record extra option: {unknown[0]}.",
            code="invalid_dns_record_extra",
            param=unknown[0],
        )

    payload: dict[str, Any] = {
        "domainId": domain,
        "kind": kind,
        "name": name,
        "value": value,
        "ttl": ttl,
        "recordId": record_id,
        "caa": caa if caa is not None else extras.get("caa"),
        "mx": mx if mx is not None else extras.get("mx"),
        "soa": soa if soa is not None else extras.get("soa"),
        "srv": srv if srv is not None else extras.get("srv"),
        "sshfp": sshfp if sshfp is not None else extras.get("sshfp"),
    }
    return payload


class DNSDomainsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        owner: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[DNSDomain]:
        params = {"owner": owner, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_DNS_DOMAINS_QUERY,
                {"namespace": page_params.get("owner"), **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                response.get("getAllDomains") if response else None,
                DNSDomain.from_graphql,
            )

        return create_list(params, "/v1/dns/domains", fetch_page)

    def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[DNSDomain]]:
        if not ids:
            return []
        response = self._client._query(
            gql.GET_DNS_DOMAINS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: List[Optional[DNSDomain]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                DNSDomain.from_graphql(node)
                if node and node.get("__typename") == "DNSDomain"
                else None
            )
        return result

    def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DNSDomain:
        domain = self.retrieve_many([id], request_options=request_options)[0]
        if not domain:
            raise resource_missing_error("DNS domain", id, "srcGetDNSDomainsQuery")
        return domain

    def retrieve_by_name(
        self, name: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DNSDomain:
        response = self._client._query(
            gql.GET_DNS_DOMAIN_BY_NAME_QUERY,
            {"name": name},
            request_options=request_options,
        )
        domain = response.get("getDomain") if response else None
        if not domain:
            raise resource_missing_error(
                "DNS domain", name, "srcGetDNSDomainByNameQuery", "name"
            )
        return DNSDomain.from_graphql(domain)

    def create(
        self,
        *,
        name: str,
        owner: Optional[str] = None,
        import_records: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> DNSDomain:
        response = self._client._mutation(
            gql.REGISTER_DNS_DOMAIN_MUTATION,
            {
                "input": {
                    "name": name,
                    "namespace": owner,
                    "importRecords": import_records,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("registerDomain") if response else None,
            "Failed to create DNS domain, mutation failed.",
            "srcRegisterDNSDomainMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to create DNS domain, mutation was not successful.",
                operation_name="srcRegisterDNSDomainMutation",
            )
        domain = required_payload(
            payload.get("domain"),
            "Failed to create DNS domain, no domain returned.",
            "srcRegisterDNSDomainMutation",
        )
        return DNSDomain.from_graphql(domain)

    def import_zone_file(
        self,
        *,
        zone_file: str,
        delete_missing_records: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> DNSDomain:
        response = self._client._mutation(
            gql.UPSERT_DNS_DOMAIN_FROM_ZONE_FILE_MUTATION,
            {
                "input": {
                    "zoneFile": zone_file,
                    "deleteMissingRecords": delete_missing_records,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("upsertDomainFromZoneFile") if response else None,
            "Failed to import DNS zone file, mutation failed.",
            "srcUpsertDNSDomainFromZoneFileMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to import DNS zone file, mutation was not successful.",
                operation_name="srcUpsertDNSDomainFromZoneFileMutation",
            )
        domain = required_payload(
            payload.get("domain"),
            "Failed to import DNS zone file, no domain returned.",
            "srcUpsertDNSDomainFromZoneFileMutation",
        )
        return DNSDomain.from_graphql(domain)

    def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_DNS_DOMAIN_MUTATION,
            {"input": {"domainId": id}},
            request_options=request_options,
        )
        if not (response.get("deleteDomain") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete DNS domain, mutation was not successful.",
                operation_name="srcDeleteDNSDomainMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many
    retrieveByName = retrieve_by_name
    importZoneFile = import_zone_file


class DNSRecordsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self, *, domain: str, request_options: Optional[RequestOptionsLike] = None
    ) -> List[DNSRecord]:
        response = self._client._query(
            gql.LIST_DNS_RECORDS_QUERY,
            {"domainId": domain},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        if not node or node.get("__typename") != "DNSDomain":
            raise resource_missing_error(
                "DNS domain", domain, "srcListDNSRecordsQuery", "domain"
            )
        return [
            DNSRecord.from_graphql(record)
            for record in node.get("records") or []
            if record
        ]

    def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[DNSRecord]]:
        if not ids:
            return []
        response = self._client._query(
            gql.GET_DNS_RECORDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: List[Optional[DNSRecord]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                DNSRecord.from_graphql(node)
                if node and node.get("name") and node.get("domain")
                else None
            )
        return result

    def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DNSRecord:
        record = self.retrieve_many([id], request_options=request_options)[0]
        if not record:
            raise resource_missing_error("DNS record", id, "srcGetDNSRecordsQuery")
        return record

    def create(
        self,
        *,
        domain: str,
        kind: DNSRecordKind,
        name: str,
        value: str,
        ttl: Optional[int] = None,
        caa: Optional[Mapping[str, Any]] = None,
        mx: Optional[Mapping[str, Any]] = None,
        soa: Optional[Mapping[str, Any]] = None,
        srv: Optional[Mapping[str, Any]] = None,
        sshfp: Optional[Mapping[str, Any]] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **extras: Any,
    ) -> DNSRecord:
        return self._upsert(
            None,
            domain=domain,
            kind=kind,
            name=name,
            value=value,
            ttl=ttl,
            caa=caa,
            mx=mx,
            soa=soa,
            srv=srv,
            sshfp=sshfp,
            request_options=request_options,
            **extras,
        )

    def update(
        self,
        id: str,
        *,
        domain: str,
        kind: DNSRecordKind,
        name: str,
        value: str,
        ttl: Optional[int] = None,
        caa: Optional[Mapping[str, Any]] = None,
        mx: Optional[Mapping[str, Any]] = None,
        soa: Optional[Mapping[str, Any]] = None,
        srv: Optional[Mapping[str, Any]] = None,
        sshfp: Optional[Mapping[str, Any]] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **extras: Any,
    ) -> DNSRecord:
        return self._upsert(
            id,
            domain=domain,
            kind=kind,
            name=name,
            value=value,
            ttl=ttl,
            caa=caa,
            mx=mx,
            soa=soa,
            srv=srv,
            sshfp=sshfp,
            request_options=request_options,
            **extras,
        )

    def _upsert(
        self,
        record_id: Optional[str],
        *,
        domain: str,
        kind: DNSRecordKind,
        name: str,
        value: str,
        ttl: Optional[int],
        caa: Optional[Mapping[str, Any]],
        mx: Optional[Mapping[str, Any]],
        soa: Optional[Mapping[str, Any]],
        srv: Optional[Mapping[str, Any]],
        sshfp: Optional[Mapping[str, Any]],
        request_options: Optional[RequestOptionsLike],
        **extras: Any,
    ) -> DNSRecord:
        response = self._client._mutation(
            gql.UPSERT_DNS_RECORD_MUTATION,
            {
                "input": _record_input(
                    domain=domain,
                    kind=kind,
                    name=name,
                    value=value,
                    ttl=ttl,
                    record_id=record_id,
                    caa=caa,
                    mx=mx,
                    soa=soa,
                    srv=srv,
                    sshfp=sshfp,
                    extras=extras,
                )
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("upsertDNSRecord") if response else None,
            "Failed to upsert DNS record, mutation failed.",
            "srcUpsertDNSRecordMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to upsert DNS record, mutation was not successful.",
                operation_name="srcUpsertDNSRecordMutation",
            )
        record = required_payload(
            payload.get("record"),
            "Failed to upsert DNS record, no record returned.",
            "srcUpsertDNSRecordMutation",
        )
        return DNSRecord.from_graphql(record)

    def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_DNS_RECORD_MUTATION,
            {"input": {"recordId": id}},
            request_options=request_options,
        )
        if not (response.get("deleteDNSRecord") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete DNS record, mutation was not successful.",
                operation_name="srcDeleteDNSRecordMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many


class DNSResource:
    def __init__(self, client: Any) -> None:
        self.domains = DNSDomainsResource(client)
        self.records = DNSRecordsResource(client)


class AsyncDNSDomainsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        owner: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[DNSDomain]:
        params = {"owner": owner, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_DNS_DOMAINS_QUERY,
                {"namespace": page_params.get("owner"), **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                response.get("getAllDomains") if response else None,
                DNSDomain.from_graphql,
            )

        return create_async_list(params, "/v1/dns/domains", fetch_page)

    async def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[DNSDomain]]:
        if not ids:
            return []
        response = await self._client._query(
            gql.GET_DNS_DOMAINS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: List[Optional[DNSDomain]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                DNSDomain.from_graphql(node)
                if node and node.get("__typename") == "DNSDomain"
                else None
            )
        return result

    async def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DNSDomain:
        domain = (await self.retrieve_many([id], request_options=request_options))[0]
        if not domain:
            raise resource_missing_error("DNS domain", id, "srcGetDNSDomainsQuery")
        return domain

    async def retrieve_by_name(
        self, name: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DNSDomain:
        response = await self._client._query(
            gql.GET_DNS_DOMAIN_BY_NAME_QUERY,
            {"name": name},
            request_options=request_options,
        )
        domain = response.get("getDomain") if response else None
        if not domain:
            raise resource_missing_error(
                "DNS domain", name, "srcGetDNSDomainByNameQuery", "name"
            )
        return DNSDomain.from_graphql(domain)

    async def create(
        self,
        *,
        name: str,
        owner: Optional[str] = None,
        import_records: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> DNSDomain:
        response = await self._client._mutation(
            gql.REGISTER_DNS_DOMAIN_MUTATION,
            {
                "input": {
                    "name": name,
                    "namespace": owner,
                    "importRecords": import_records,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("registerDomain") if response else None,
            "Failed to create DNS domain, mutation failed.",
            "srcRegisterDNSDomainMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to create DNS domain, mutation was not successful.",
                operation_name="srcRegisterDNSDomainMutation",
            )
        domain = required_payload(
            payload.get("domain"),
            "Failed to create DNS domain, no domain returned.",
            "srcRegisterDNSDomainMutation",
        )
        return DNSDomain.from_graphql(domain)

    async def import_zone_file(
        self,
        *,
        zone_file: str,
        delete_missing_records: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> DNSDomain:
        response = await self._client._mutation(
            gql.UPSERT_DNS_DOMAIN_FROM_ZONE_FILE_MUTATION,
            {
                "input": {
                    "zoneFile": zone_file,
                    "deleteMissingRecords": delete_missing_records,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("upsertDomainFromZoneFile") if response else None,
            "Failed to import DNS zone file, mutation failed.",
            "srcUpsertDNSDomainFromZoneFileMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to import DNS zone file, mutation was not successful.",
                operation_name="srcUpsertDNSDomainFromZoneFileMutation",
            )
        domain = required_payload(
            payload.get("domain"),
            "Failed to import DNS zone file, no domain returned.",
            "srcUpsertDNSDomainFromZoneFileMutation",
        )
        return DNSDomain.from_graphql(domain)

    async def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_DNS_DOMAIN_MUTATION,
            {"input": {"domainId": id}},
            request_options=request_options,
        )
        if not (response.get("deleteDomain") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete DNS domain, mutation was not successful.",
                operation_name="srcDeleteDNSDomainMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many
    retrieveByName = retrieve_by_name
    importZoneFile = import_zone_file


class AsyncDNSRecordsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def list(
        self, *, domain: str, request_options: Optional[RequestOptionsLike] = None
    ) -> List[DNSRecord]:
        response = await self._client._query(
            gql.LIST_DNS_RECORDS_QUERY,
            {"domainId": domain},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        if not node or node.get("__typename") != "DNSDomain":
            raise resource_missing_error(
                "DNS domain", domain, "srcListDNSRecordsQuery", "domain"
            )
        return [
            DNSRecord.from_graphql(record)
            for record in node.get("records") or []
            if record
        ]

    async def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[DNSRecord]]:
        if not ids:
            return []
        response = await self._client._query(
            gql.GET_DNS_RECORDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: List[Optional[DNSRecord]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                DNSRecord.from_graphql(node)
                if node and node.get("name") and node.get("domain")
                else None
            )
        return result

    async def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> DNSRecord:
        record = (await self.retrieve_many([id], request_options=request_options))[0]
        if not record:
            raise resource_missing_error("DNS record", id, "srcGetDNSRecordsQuery")
        return record

    async def create(
        self,
        *,
        domain: str,
        kind: DNSRecordKind,
        name: str,
        value: str,
        ttl: Optional[int] = None,
        caa: Optional[Mapping[str, Any]] = None,
        mx: Optional[Mapping[str, Any]] = None,
        soa: Optional[Mapping[str, Any]] = None,
        srv: Optional[Mapping[str, Any]] = None,
        sshfp: Optional[Mapping[str, Any]] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **extras: Any,
    ) -> DNSRecord:
        return await self._upsert(
            None,
            domain=domain,
            kind=kind,
            name=name,
            value=value,
            ttl=ttl,
            caa=caa,
            mx=mx,
            soa=soa,
            srv=srv,
            sshfp=sshfp,
            request_options=request_options,
            **extras,
        )

    async def update(
        self,
        id: str,
        *,
        domain: str,
        kind: DNSRecordKind,
        name: str,
        value: str,
        ttl: Optional[int] = None,
        caa: Optional[Mapping[str, Any]] = None,
        mx: Optional[Mapping[str, Any]] = None,
        soa: Optional[Mapping[str, Any]] = None,
        srv: Optional[Mapping[str, Any]] = None,
        sshfp: Optional[Mapping[str, Any]] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **extras: Any,
    ) -> DNSRecord:
        return await self._upsert(
            id,
            domain=domain,
            kind=kind,
            name=name,
            value=value,
            ttl=ttl,
            caa=caa,
            mx=mx,
            soa=soa,
            srv=srv,
            sshfp=sshfp,
            request_options=request_options,
            **extras,
        )

    async def _upsert(
        self,
        record_id: Optional[str],
        *,
        domain: str,
        kind: DNSRecordKind,
        name: str,
        value: str,
        ttl: Optional[int],
        caa: Optional[Mapping[str, Any]],
        mx: Optional[Mapping[str, Any]],
        soa: Optional[Mapping[str, Any]],
        srv: Optional[Mapping[str, Any]],
        sshfp: Optional[Mapping[str, Any]],
        request_options: Optional[RequestOptionsLike],
        **extras: Any,
    ) -> DNSRecord:
        response = await self._client._mutation(
            gql.UPSERT_DNS_RECORD_MUTATION,
            {
                "input": _record_input(
                    domain=domain,
                    kind=kind,
                    name=name,
                    value=value,
                    ttl=ttl,
                    record_id=record_id,
                    caa=caa,
                    mx=mx,
                    soa=soa,
                    srv=srv,
                    sshfp=sshfp,
                    extras=extras,
                )
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("upsertDNSRecord") if response else None,
            "Failed to upsert DNS record, mutation failed.",
            "srcUpsertDNSRecordMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to upsert DNS record, mutation was not successful.",
                operation_name="srcUpsertDNSRecordMutation",
            )
        record = required_payload(
            payload.get("record"),
            "Failed to upsert DNS record, no record returned.",
            "srcUpsertDNSRecordMutation",
        )
        return DNSRecord.from_graphql(record)

    async def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_DNS_RECORD_MUTATION,
            {"input": {"recordId": id}},
            request_options=request_options,
        )
        if not (response.get("deleteDNSRecord") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete DNS record, mutation was not successful.",
                operation_name="srcDeleteDNSRecordMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many


class AsyncDNSResource:
    def __init__(self, client: Any) -> None:
        self.domains = AsyncDNSDomainsResource(client)
        self.records = AsyncDNSRecordsResource(client)
