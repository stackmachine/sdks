from __future__ import annotations

import shlex
from typing import Any, List, Mapping, Optional, Union

from typing_extensions import Unpack

from .._errors import StackMachineAPIError, StackMachineValidationError
from .._graphql import operations as gql
from .._models import CronJob
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import (
    CronJobExecuteTargetInput,
    CronJobFetchTargetInput,
    CronJobKind,
    CronJobsSortBy,
    PaginationOptions,
    RequestOptionsLike,
)
from .._utils import EXPLICIT_NULL
from ._shared import page_variables, required_payload, resource_missing_error


class _NotGiven:
    pass


NOT_GIVEN = _NotGiven()
OptionalStringUpdate = Union[str, None, _NotGiven]
OptionalIntUpdate = Union[int, None, _NotGiven]
OptionalBoolUpdate = Union[bool, None, _NotGiven]


def _target_value(
    data: Mapping[str, Any], snake_name: str, camel_name: Optional[str] = None
) -> tuple[bool, Any]:
    if snake_name in data:
        return True, data[snake_name]
    if camel_name and camel_name in data:
        return True, data[camel_name]
    return False, None


def _explicit_null(value: Any) -> Any:
    return EXPLICIT_NULL if value is None else value


def _serialize_execute_target(
    target: Mapping[str, Any],
) -> dict[str, Any]:
    result: dict[str, Any] = {}
    has_command, command = _target_value(target, "command")
    if has_command:
        if command is None:
            result["command"] = EXPLICIT_NULL
            result["cliArgs"] = []
        else:
            try:
                tokens = shlex.split(str(command), posix=True)
            except ValueError as exc:
                raise StackMachineValidationError(
                    "`command` contains an unterminated quote or escape sequence.",
                    code="invalid_cron_command",
                    param="command",
                    cause=exc,
                ) from exc
            if not tokens or not tokens[0]:
                raise StackMachineValidationError(
                    "`command` must contain a non-empty command.",
                    code="invalid_cron_command",
                    param="command",
                )
            result["command"] = tokens[0]
            result["cliArgs"] = tokens[1:]

    has_env, env = _target_value(target, "env")
    if has_env:
        result["env"] = _explicit_null(env)
    has_package, package_name = _target_value(target, "package_name", "packageName")
    if has_package:
        result["packageName"] = _explicit_null(package_name)
    return result


def _serialize_fetch_target(target: Mapping[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    fields = (
        ("path", "path"),
        ("method", "method"),
        ("headers", "headers"),
        ("body", "body"),
        ("expect_body_includes", "expectBodyIncludes"),
        ("expect_body_regex", "expectBodyRegex"),
        ("expect_status_codes", "expectStatusCodes"),
    )
    for snake_name, graphql_name in fields:
        has_value, value = _target_value(target, snake_name, graphql_name)
        if has_value:
            result[graphql_name] = _explicit_null(value)
    return result


def _targets_input(
    execute: Optional[CronJobExecuteTargetInput],
    fetch: Optional[CronJobFetchTargetInput],
    *,
    required: bool,
) -> dict[str, Any]:
    target_count = int(execute is not None) + int(fetch is not None)
    if target_count > 1 or (required and target_count != 1):
        message = (
            "Exactly one of `execute` or `fetch` must be provided."
            if required
            else "`execute` and `fetch` cannot both be provided."
        )
        raise StackMachineValidationError(
            message,
            code="invalid_cron_target",
            param="execute",
        )
    result: dict[str, Any] = {}
    if execute is not None:
        result["execute"] = _serialize_execute_target(execute)
    if fetch is not None:
        result["fetch"] = _serialize_fetch_target(fetch)
    return result


def _set_update_value(values: dict[str, Any], graphql_name: str, value: Any) -> None:
    if value is not NOT_GIVEN:
        values[graphql_name] = _explicit_null(value)


def _create_input(
    *,
    app: str,
    name: str,
    schedule: str,
    execute: Optional[CronJobExecuteTargetInput],
    fetch: Optional[CronJobFetchTargetInput],
    enabled: Optional[bool],
    max_retries: Optional[int],
    max_schedule_drift: Optional[str],
    timeout: Optional[str],
) -> dict[str, Any]:
    return {
        "appId": app,
        "name": name,
        "schedule": schedule,
        "enabled": enabled,
        "maxRetries": max_retries,
        "maxScheduleDrift": max_schedule_drift,
        "timeout": timeout,
        **_targets_input(execute, fetch, required=True),
    }


def _update_input(
    id: str,
    *,
    execute: Optional[CronJobExecuteTargetInput],
    fetch: Optional[CronJobFetchTargetInput],
    name: OptionalStringUpdate,
    schedule: OptionalStringUpdate,
    enabled: OptionalBoolUpdate,
    max_retries: OptionalIntUpdate,
    max_schedule_drift: OptionalStringUpdate,
    timeout: OptionalStringUpdate,
) -> dict[str, Any]:
    values = {"cronJobId": id, **_targets_input(execute, fetch, required=False)}
    _set_update_value(values, "name", name)
    _set_update_value(values, "schedule", schedule)
    _set_update_value(values, "enabled", enabled)
    _set_update_value(values, "maxRetries", max_retries)
    _set_update_value(values, "maxScheduleDrift", max_schedule_drift)
    _set_update_value(values, "timeout", timeout)
    return values


def _cron_job_payload(response: Any, field: str, operation_name: str) -> CronJob:
    payload = required_payload(
        response.get(field) if response else None,
        "Failed to mutate cron job.",
        operation_name,
    )
    cron_job = required_payload(
        payload.get("cronJob"),
        "Failed to mutate cron job, no cron job returned.",
        operation_name,
    )
    return CronJob.from_graphql(cron_job)


class AppsCronJobsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        app: str,
        kind: Optional[CronJobKind] = None,
        sort_by: CronJobsSortBy = "NEWEST",
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[CronJob]:
        params = {
            "app": app,
            "kind": kind,
            "sort_by": sort_by,
            **pagination,
        }

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.LIST_APP_CRON_JOBS_QUERY,
                {
                    "appId": page_params["app"],
                    "kind": page_params.get("kind"),
                    "sortBy": page_params.get("sort_by") or "NEWEST",
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("cronJobs") if response else None),
                CronJob.from_graphql,
            )

        return create_list(params, "/v1/apps/cronjobs", fetch_page)

    def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> CronJob:
        cron_job = self.retrieve_many([id], request_options=request_options)[0]
        if cron_job is None:
            raise resource_missing_error("cron job", id, "srcGetCronJobsByIdsQuery")
        return cron_job

    def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[CronJob]]:
        if not ids:
            return []
        response = self._client._query(
            gql.GET_CRON_JOBS_BY_IDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: List[Optional[CronJob]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                CronJob.from_graphql(node)
                if node and node.get("__typename") == "CronJob"
                else None
            )
        return result

    def create(
        self,
        *,
        app: str,
        name: str,
        schedule: str,
        execute: Optional[CronJobExecuteTargetInput] = None,
        fetch: Optional[CronJobFetchTargetInput] = None,
        enabled: Optional[bool] = None,
        max_retries: Optional[int] = None,
        max_schedule_drift: Optional[str] = None,
        timeout: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> CronJob:
        response = self._client._mutation(
            gql.CREATE_CRON_JOB_MUTATION,
            {
                "input": _create_input(
                    app=app,
                    name=name,
                    schedule=schedule,
                    execute=execute,
                    fetch=fetch,
                    enabled=enabled,
                    max_retries=max_retries,
                    max_schedule_drift=max_schedule_drift,
                    timeout=timeout,
                )
            },
            request_options=request_options,
        )
        return _cron_job_payload(response, "createCronJob", "srcCreateCronJobMutation")

    def update(
        self,
        id: str,
        *,
        execute: Optional[CronJobExecuteTargetInput] = None,
        fetch: Optional[CronJobFetchTargetInput] = None,
        name: OptionalStringUpdate = NOT_GIVEN,
        schedule: OptionalStringUpdate = NOT_GIVEN,
        enabled: OptionalBoolUpdate = NOT_GIVEN,
        max_retries: OptionalIntUpdate = NOT_GIVEN,
        max_schedule_drift: OptionalStringUpdate = NOT_GIVEN,
        timeout: OptionalStringUpdate = NOT_GIVEN,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> CronJob:
        response = self._client._mutation(
            gql.UPDATE_CRON_JOB_MUTATION,
            {
                "input": _update_input(
                    id,
                    execute=execute,
                    fetch=fetch,
                    name=name,
                    schedule=schedule,
                    enabled=enabled,
                    max_retries=max_retries,
                    max_schedule_drift=max_schedule_drift,
                    timeout=timeout,
                )
            },
            request_options=request_options,
        )
        return _cron_job_payload(response, "updateCronJob", "srcUpdateCronJobMutation")

    def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DELETE_CRON_JOB_MUTATION,
            {"input": {"cronJobId": id}},
            request_options=request_options,
        )
        if not (response.get("deleteCronJob") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete cron job.",
                operation_name="srcDeleteCronJobMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many


class AsyncAppsCronJobsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        app: str,
        kind: Optional[CronJobKind] = None,
        sort_by: CronJobsSortBy = "NEWEST",
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[CronJob]:
        params = {
            "app": app,
            "kind": kind,
            "sort_by": sort_by,
            **pagination,
        }

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.LIST_APP_CRON_JOBS_QUERY,
                {
                    "appId": page_params["app"],
                    "kind": page_params.get("kind"),
                    "sortBy": page_params.get("sort_by") or "NEWEST",
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            return connection_to_page_data(
                ((response.get("node") or {}).get("cronJobs") if response else None),
                CronJob.from_graphql,
            )

        return create_async_list(params, "/v1/apps/cronjobs", fetch_page)

    async def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> CronJob:
        cron_job = (await self.retrieve_many([id], request_options=request_options))[0]
        if cron_job is None:
            raise resource_missing_error("cron job", id, "srcGetCronJobsByIdsQuery")
        return cron_job

    async def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[CronJob]]:
        if not ids:
            return []
        response = await self._client._query(
            gql.GET_CRON_JOBS_BY_IDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: List[Optional[CronJob]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                CronJob.from_graphql(node)
                if node and node.get("__typename") == "CronJob"
                else None
            )
        return result

    async def create(
        self,
        *,
        app: str,
        name: str,
        schedule: str,
        execute: Optional[CronJobExecuteTargetInput] = None,
        fetch: Optional[CronJobFetchTargetInput] = None,
        enabled: Optional[bool] = None,
        max_retries: Optional[int] = None,
        max_schedule_drift: Optional[str] = None,
        timeout: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> CronJob:
        response = await self._client._mutation(
            gql.CREATE_CRON_JOB_MUTATION,
            {
                "input": _create_input(
                    app=app,
                    name=name,
                    schedule=schedule,
                    execute=execute,
                    fetch=fetch,
                    enabled=enabled,
                    max_retries=max_retries,
                    max_schedule_drift=max_schedule_drift,
                    timeout=timeout,
                )
            },
            request_options=request_options,
        )
        return _cron_job_payload(response, "createCronJob", "srcCreateCronJobMutation")

    async def update(
        self,
        id: str,
        *,
        execute: Optional[CronJobExecuteTargetInput] = None,
        fetch: Optional[CronJobFetchTargetInput] = None,
        name: OptionalStringUpdate = NOT_GIVEN,
        schedule: OptionalStringUpdate = NOT_GIVEN,
        enabled: OptionalBoolUpdate = NOT_GIVEN,
        max_retries: OptionalIntUpdate = NOT_GIVEN,
        max_schedule_drift: OptionalStringUpdate = NOT_GIVEN,
        timeout: OptionalStringUpdate = NOT_GIVEN,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> CronJob:
        response = await self._client._mutation(
            gql.UPDATE_CRON_JOB_MUTATION,
            {
                "input": _update_input(
                    id,
                    execute=execute,
                    fetch=fetch,
                    name=name,
                    schedule=schedule,
                    enabled=enabled,
                    max_retries=max_retries,
                    max_schedule_drift=max_schedule_drift,
                    timeout=timeout,
                )
            },
            request_options=request_options,
        )
        return _cron_job_payload(response, "updateCronJob", "srcUpdateCronJobMutation")

    async def delete(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DELETE_CRON_JOB_MUTATION,
            {"input": {"cronJobId": id}},
            request_options=request_options,
        )
        if not (response.get("deleteCronJob") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete cron job.",
                operation_name="srcDeleteCronJobMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many
