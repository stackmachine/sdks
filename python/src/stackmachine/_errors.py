from __future__ import annotations

from typing import Any, Mapping, Optional, Sequence

GraphQLErrorPayload = Mapping[str, Any]


class StackMachineError(Exception):
    """Base exception raised by the StackMachine SDK."""

    def __init__(
        self,
        message: str,
        *,
        operation_name: Optional[str] = None,
        status_code: Optional[int] = None,
        request_id: Optional[str] = None,
        code: Optional[str] = None,
        param: Optional[str] = None,
        graphql_errors: Optional[Sequence[GraphQLErrorPayload]] = None,
        cause: Optional[BaseException] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.type = type(self).__name__
        self.operation_name = operation_name
        self.status_code = status_code
        self.request_id = request_id
        self.code = code
        self.param = param
        self.graphql_errors = graphql_errors
        self.__cause__ = cause


class StackMachineConnectionError(StackMachineError):
    pass


class StackMachineAPIError(StackMachineError):
    pass


class StackMachineGraphQLError(StackMachineError):
    pass


class StackMachineAuthenticationError(StackMachineAPIError):
    pass


class StackMachinePermissionError(StackMachineAPIError):
    pass


class StackMachineRateLimitError(StackMachineAPIError):
    pass


class StackMachineInvalidRequestError(StackMachineAPIError):
    pass


class StackMachineValidationError(StackMachineError):
    pass


def is_stackmachine_error(error: BaseException) -> bool:
    return isinstance(error, StackMachineError)


def stackmachine_error_from_graphql_errors(
    graphql_errors: Sequence[GraphQLErrorPayload],
    operation_name: Optional[str] = None,
) -> StackMachineGraphQLError:
    first = graphql_errors[0] if graphql_errors else {}
    extensions = first.get("extensions") if isinstance(first, Mapping) else None
    message = first.get("message") if isinstance(first, Mapping) else None
    return StackMachineGraphQLError(
        str(message or "StackMachine GraphQL request failed."),
        operation_name=operation_name,
        graphql_errors=graphql_errors,
        code=extensions.get("code") if isinstance(extensions, Mapping) else None,
        param=extensions.get("param") if isinstance(extensions, Mapping) else None,
    )


def stackmachine_error_from_unknown(
    error: BaseException,
    operation_name: Optional[str] = None,
) -> StackMachineError:
    if isinstance(error, StackMachineError):
        return error
    return StackMachineConnectionError(
        str(error) or "StackMachine request failed.",
        operation_name=operation_name,
        cause=error,
    )
