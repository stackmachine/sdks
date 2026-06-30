from __future__ import annotations

from datetime import datetime
from typing import Any, Mapping, Optional, Union

from .._errors import StackMachineValidationError
from .._graphql import operations as gql
from .._models import UsageMetrics, UsageMetricsScope
from .._types import MetricGrouping, RequestOptionsLike, UsageMetricsInput
from ._shared import required_payload, resource_missing_error

UsageDate = Union[str, datetime]


def _iso(value: UsageDate) -> str:
    return value.isoformat() if isinstance(value, datetime) else value


def _input_value(
    input: Mapping[str, Any],
    snake_name: str,
    camel_name: str,
    explicit: Any,
) -> Any:
    if explicit is not None:
        return explicit
    if snake_name in input:
        return input[snake_name]
    return input.get(camel_name)


def _metrics_variables(
    input: Optional[UsageMetricsInput],
    *,
    app: Optional[str],
    owner: Optional[str],
    start: Optional[UsageDate],
    end: Optional[UsageDate],
    grouped_by: Optional[MetricGrouping],
    groupedBy: Optional[MetricGrouping],
) -> dict[str, Any]:
    input_data: Mapping[str, Any] = input or {}
    resolved_app = _input_value(input_data, "app", "app", app)
    resolved_owner = _input_value(input_data, "owner", "owner", owner)
    resolved_start = _input_value(input_data, "start", "start", start)
    resolved_end = _input_value(input_data, "end", "end", end)
    resolved_grouped_by = (
        groupedBy
        or grouped_by
        or input_data.get("grouped_by")
        or input_data.get("groupedBy")
        or "BY_DAY"
    )

    if resolved_app is not None and resolved_owner is not None:
        raise StackMachineValidationError(
            "`app` and `owner` cannot both be provided.",
            param="owner",
        )
    if resolved_start is None:
        raise StackMachineValidationError("`start` is required.", param="start")
    if resolved_end is None:
        raise StackMachineValidationError("`end` is required.", param="end")

    return {
        "app": resolved_app,
        "owner": resolved_owner,
        "start": _iso(resolved_start),
        "end": _iso(resolved_end),
        "groupedBy": resolved_grouped_by,
    }


class UsageResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def metrics(
        self,
        input: Optional[UsageMetricsInput] = None,
        *,
        app: Optional[str] = None,
        owner: Optional[str] = None,
        start: Optional[UsageDate] = None,
        end: Optional[UsageDate] = None,
        grouped_by: Optional[MetricGrouping] = None,
        groupedBy: Optional[MetricGrouping] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> UsageMetrics:
        variables = _metrics_variables(
            input,
            app=app,
            owner=owner,
            start=start,
            end=end,
            grouped_by=grouped_by,
            groupedBy=groupedBy,
        )
        if variables["app"] is not None:
            app_id = str(variables.pop("app"))
            variables.pop("owner", None)
            response = self._client._query(
                gql.USAGE_APP_METRICS_QUERY,
                {"appId": app_id, **variables},
                request_options=request_options,
            )
            node = response.get("node") if response else None
            if not node or node.get("__typename") != "DeployApp":
                raise resource_missing_error("app", app_id, "srcUsageAppMetricsQuery")
            return UsageMetrics.from_graphql(
                node["groupedMetrics"],
                scope=UsageMetricsScope(type="app", app_id=app_id),
            )

        if variables["owner"] is not None:
            owner_name = str(variables.pop("owner"))
            variables.pop("app", None)
            response = self._client._query(
                gql.USAGE_OWNER_METRICS_QUERY,
                {"owner": owner_name, **variables},
                request_options=request_options,
            )
            owner_data = response.get("owner") if response else None
            owner_type = owner_data.get("__typename") if owner_data else None
            if owner_data is None or owner_type not in {"Namespace", "User"}:
                raise resource_missing_error(
                    "owner",
                    owner_name,
                    "srcUsageOwnerMetricsQuery",
                    "owner",
                )
            return UsageMetrics.from_graphql(
                owner_data["groupedMetrics"],
                scope=UsageMetricsScope(
                    type="owner",
                    owner=owner_name,
                    owner_type=str(owner_type),
                ),
            )

        variables.pop("app", None)
        variables.pop("owner", None)
        response = self._client._query(
            gql.USAGE_VIEWER_METRICS_QUERY,
            variables,
            request_options=request_options,
        )
        viewer = required_payload(
            response.get("viewer") if response else None,
            "Failed to retrieve usage metrics, no viewer returned.",
            "srcUsageViewerMetricsQuery",
        )
        return UsageMetrics.from_graphql(
            viewer["groupedMetrics"],
            scope=UsageMetricsScope(type="viewer"),
        )


class AsyncUsageResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def metrics(
        self,
        input: Optional[UsageMetricsInput] = None,
        *,
        app: Optional[str] = None,
        owner: Optional[str] = None,
        start: Optional[UsageDate] = None,
        end: Optional[UsageDate] = None,
        grouped_by: Optional[MetricGrouping] = None,
        groupedBy: Optional[MetricGrouping] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> UsageMetrics:
        variables = _metrics_variables(
            input,
            app=app,
            owner=owner,
            start=start,
            end=end,
            grouped_by=grouped_by,
            groupedBy=groupedBy,
        )
        if variables["app"] is not None:
            app_id = str(variables.pop("app"))
            variables.pop("owner", None)
            response = await self._client._query(
                gql.USAGE_APP_METRICS_QUERY,
                {"appId": app_id, **variables},
                request_options=request_options,
            )
            node = response.get("node") if response else None
            if not node or node.get("__typename") != "DeployApp":
                raise resource_missing_error("app", app_id, "srcUsageAppMetricsQuery")
            return UsageMetrics.from_graphql(
                node["groupedMetrics"],
                scope=UsageMetricsScope(type="app", app_id=app_id),
            )

        if variables["owner"] is not None:
            owner_name = str(variables.pop("owner"))
            variables.pop("app", None)
            response = await self._client._query(
                gql.USAGE_OWNER_METRICS_QUERY,
                {"owner": owner_name, **variables},
                request_options=request_options,
            )
            owner_data = response.get("owner") if response else None
            owner_type = owner_data.get("__typename") if owner_data else None
            if owner_data is None or owner_type not in {"Namespace", "User"}:
                raise resource_missing_error(
                    "owner",
                    owner_name,
                    "srcUsageOwnerMetricsQuery",
                    "owner",
                )
            return UsageMetrics.from_graphql(
                owner_data["groupedMetrics"],
                scope=UsageMetricsScope(
                    type="owner",
                    owner=owner_name,
                    owner_type=str(owner_type),
                ),
            )

        variables.pop("app", None)
        variables.pop("owner", None)
        response = await self._client._query(
            gql.USAGE_VIEWER_METRICS_QUERY,
            variables,
            request_options=request_options,
        )
        viewer = required_payload(
            response.get("viewer") if response else None,
            "Failed to retrieve usage metrics, no viewer returned.",
            "srcUsageViewerMetricsQuery",
        )
        return UsageMetrics.from_graphql(
            viewer["groupedMetrics"],
            scope=UsageMetricsScope(type="viewer"),
        )
