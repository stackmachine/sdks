from __future__ import annotations

from typing import Any, Mapping, Optional, TypeVar

from .._errors import StackMachineAPIError, StackMachineInvalidRequestError
from .._pagination import NormalizedPagination

T = TypeVar("T")


def required_payload(value: T | None, message: str, operation_name: str) -> T:
    if value is None:
        raise StackMachineAPIError(message, operation_name=operation_name)
    return value


def resource_missing_error(
    resource: str,
    identifier: str,
    operation_name: str,
    param: str = "id",
) -> StackMachineInvalidRequestError:
    return StackMachineInvalidRequestError(
        f"No such {resource}: {identifier}",
        operation_name=operation_name,
        code="resource_missing",
        param=param,
    )


def page_variables(pagination: NormalizedPagination) -> dict[str, Optional[int | str]]:
    return {
        "first": pagination.first,
        "after": pagination.after,
        "last": pagination.last,
        "before": pagination.before,
    }


def nodes_for_ids(
    ids: list[str],
    nodes: list[Mapping[str, Any] | None],
) -> list[Mapping[str, Any] | None]:
    return [nodes[index] if index < len(nodes) else None for index, _ in enumerate(ids)]
