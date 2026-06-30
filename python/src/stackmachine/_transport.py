from __future__ import annotations

import asyncio
import json
import random
import time
from dataclasses import asdict, is_dataclass
from typing import Any, AsyncIterator, Dict, Iterator, Mapping, Optional, cast
from urllib.parse import urlparse, urlunparse

import httpx

from ._config import DEFAULT_MAX_NETWORK_RETRIES, DEFAULT_TIMEOUT, ClientConfig
from ._errors import (
    GraphQLErrorPayload,
    StackMachineAPIError,
    StackMachineAuthenticationError,
    StackMachineConnectionError,
    StackMachineInvalidRequestError,
    StackMachinePermissionError,
    StackMachineRateLimitError,
    StackMachineValidationError,
    stackmachine_error_from_graphql_errors,
)
from ._types import FileInput, RequestOptionsLike
from ._utils import operation_name, read_file_bytes

RETRYABLE_STATUS_CODES = {408, 409, 425, 429, 500, 502, 503, 504}


def _request_options_dict(
    request_options: Optional[RequestOptionsLike],
) -> Dict[str, Any]:
    if request_options is None:
        return {}
    if is_dataclass(request_options):
        return {
            key: value
            for key, value in asdict(request_options).items()
            if value is not None
        }
    return {
        str(key): value
        for key, value in request_options.items()
        if value is not None
    }


def _headers(
    api_key: str,
    config: ClientConfig,
    request_options: Optional[RequestOptionsLike],
) -> Dict[str, str]:
    options = _request_options_dict(request_options)
    headers: Dict[str, str] = {"Accept": "application/json"}
    if config.headers:
        headers.update({str(key): str(value) for key, value in config.headers.items()})
    if options.get("headers"):
        headers.update(
            {str(key): str(value) for key, value in options["headers"].items()}
        )
    resolved_api_key = options.get("api_key") or options.get("apiKey") or api_key
    if resolved_api_key:
        headers["Authorization"] = f"Bearer {resolved_api_key}"
    return headers


def _timeout(
    config: ClientConfig,
    request_options: Optional[RequestOptionsLike],
) -> float:
    options = _request_options_dict(request_options)
    return float(options.get("timeout") or config.timeout or DEFAULT_TIMEOUT)


def _max_retries(
    config: ClientConfig,
    request_options: Optional[RequestOptionsLike],
) -> int:
    options = _request_options_dict(request_options)
    return int(
        options.get("max_network_retries")
        or options.get("maxNetworkRetries")
        or config.max_network_retries
        or DEFAULT_MAX_NETWORK_RETRIES
    )


def _retry_delay(attempt: int) -> float:
    base = min(0.1 * 2**attempt, 2.0)
    return base / 2 + random.random() * (base / 2)


def _should_retry(error: BaseException, attempt: int, max_retries: int) -> bool:
    if attempt >= max_retries:
        return False
    if (
        isinstance(error, StackMachineConnectionError)
        and error.code != "request_aborted"
    ):
        return True
    if isinstance(error, StackMachineAPIError):
        return error.status_code in RETRYABLE_STATUS_CODES
    return False


def _request_id(headers: httpx.Headers) -> Optional[str]:
    return headers.get("x-request-id") or headers.get("x-stackmachine-request-id")


def _json_body(response: httpx.Response) -> Any:
    if not response.content:
        return None
    try:
        return response.json()
    except ValueError:
        return response.text


def _body_message(body: Any, fallback: str) -> str:
    if isinstance(body, str):
        return body or fallback
    if isinstance(body, Mapping):
        errors = body.get("errors")
        if isinstance(errors, list) and errors and errors[0].get("message"):
            return str(errors[0]["message"])
        error = body.get("error")
        if isinstance(error, Mapping) and error.get("message"):
            return str(error["message"])
        if body.get("message"):
            return str(body["message"])
    return fallback


def _body_code(body: Any) -> Optional[str]:
    if not isinstance(body, Mapping):
        return None
    error = body.get("error")
    if isinstance(error, Mapping) and isinstance(error.get("code"), str):
        return error["code"]
    if isinstance(body.get("code"), str):
        return body["code"]
    errors = body.get("errors")
    first = errors[0] if isinstance(errors, list) and errors else None
    extensions = first.get("extensions") if isinstance(first, Mapping) else None
    return extensions.get("code") if isinstance(extensions, Mapping) else None


def _graphql_errors(body: Any) -> Optional[list[GraphQLErrorPayload]]:
    if isinstance(body, Mapping) and isinstance(body.get("errors"), list):
        return body["errors"]
    return None


def _api_error(
    response: httpx.Response, body: Any, op_name: Optional[str]
) -> StackMachineAPIError:
    message = _body_message(
        body,
        f"StackMachine API request failed with status {response.status_code}.",
    )
    request_id = _request_id(response.headers)
    code = _body_code(body)
    graphql_errors = _graphql_errors(body)
    if response.status_code == 401:
        return StackMachineAuthenticationError(
            message,
            operation_name=op_name,
            status_code=response.status_code,
            request_id=request_id,
            code=code,
            graphql_errors=graphql_errors,
        )
    if response.status_code == 403:
        return StackMachinePermissionError(
            message,
            operation_name=op_name,
            status_code=response.status_code,
            request_id=request_id,
            code=code,
            graphql_errors=graphql_errors,
        )
    if response.status_code == 429:
        return StackMachineRateLimitError(
            message,
            operation_name=op_name,
            status_code=response.status_code,
            request_id=request_id,
            code=code,
            graphql_errors=graphql_errors,
        )
    if 400 <= response.status_code < 500:
        return StackMachineInvalidRequestError(
            message,
            operation_name=op_name,
            status_code=response.status_code,
            request_id=request_id,
            code=code,
            graphql_errors=graphql_errors,
        )
    return StackMachineAPIError(
        message,
        operation_name=op_name,
        status_code=response.status_code,
        request_id=request_id,
        code=code,
        graphql_errors=graphql_errors,
    )


def _variables_with_client_mutation_id(
    variables: Mapping[str, Any],
    request_options: Optional[RequestOptionsLike],
) -> Dict[str, Any]:
    resolved = dict(variables)
    options = _request_options_dict(request_options)
    mutation_id = (
        options.get("client_mutation_id")
        or options.get("clientMutationId")
        or options.get("idempotency_key")
        or options.get("idempotencyKey")
    )
    if not mutation_id:
        return resolved
    input_value = resolved.get("input")
    if not isinstance(input_value, Mapping):
        return resolved
    input_dict = dict(input_value)
    existing = input_dict.get("clientMutationId")
    if existing and existing != mutation_id:
        raise StackMachineValidationError(
            "`input.clientMutationId` must match idempotency_key/client_mutation_id "
            "when both are provided.",
            code="client_mutation_id_conflict",
            param="client_mutation_id",
        )
    input_dict["clientMutationId"] = mutation_id
    resolved["input"] = input_dict
    return resolved


def _clean_json(value: Any) -> Any:
    if isinstance(value, Mapping):
        return {
            key: _clean_json(item)
            for key, item in value.items()
            if item is not None
        }
    if isinstance(value, list):
        return [_clean_json(item) for item in value if item is not None]
    if isinstance(value, tuple):
        return [_clean_json(item) for item in value if item is not None]
    return value


def _multipart_files(
    payload: Mapping[str, Any],
    uploadables: Mapping[str, FileInput],
) -> Dict[str, Any]:
    upload_map = {
        str(index): [path] for index, path in enumerate(uploadables.keys())
    }
    files: Dict[str, Any] = {
        "operations": (None, json.dumps(payload), "application/json"),
        "map": (None, json.dumps(upload_map), "application/json"),
    }
    for index, file in enumerate(uploadables.values()):
        key = str(index)
        files[key] = ("upload", read_file_bytes(file), "application/octet-stream")
    return files


def _subscription_url(api_url: str) -> str:
    parsed = urlparse(api_url)
    scheme = "wss" if parsed.scheme == "https" else "ws"
    return urlunparse((scheme, parsed.netloc, parsed.path, "", parsed.query, ""))


class SyncTransport:
    def __init__(
        self,
        api_key: str,
        config: ClientConfig,
        *,
        http_client: Optional[httpx.Client] = None,
        http_transport: Optional[httpx.BaseTransport] = None,
    ) -> None:
        self.api_key = api_key
        self.config = config
        self.client = http_client or httpx.Client(transport=http_transport)
        self._owns_client = http_client is None

    def close(self) -> None:
        if self._owns_client:
            self.client.close()

    def execute(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
        mutation: bool = False,
        uploadables: Optional[Mapping[str, FileInput]] = None,
    ) -> Any:
        op_name = operation_name(query)
        resolved_variables = dict(variables or {})
        if mutation:
            resolved_variables = _variables_with_client_mutation_id(
                resolved_variables, request_options
            )
        payload = {
            "query": query,
            "variables": resolved_variables
            if uploadables
            else _clean_json(resolved_variables),
            "operationName": op_name,
        }
        attempt = 0
        max_retries = _max_retries(self.config, request_options)
        while True:
            try:
                headers = _headers(self.api_key, self.config, request_options)
                if uploadables:
                    response = self.client.post(
                        self.config.api_url,
                        files=_multipart_files(payload, uploadables),
                        headers=headers,
                        timeout=_timeout(self.config, request_options),
                    )
                else:
                    response = self.client.post(
                        self.config.api_url,
                        json=payload,
                        headers={
                            **headers,
                            "Content-Type": "application/json",
                        },
                        timeout=_timeout(self.config, request_options),
                    )
                body = _json_body(response)
                if response.status_code >= 400:
                    raise _api_error(response, body, op_name)
                errors = _graphql_errors(body)
                if errors:
                    raise stackmachine_error_from_graphql_errors(errors, op_name)
                return body.get("data") if isinstance(body, Mapping) else body
            except httpx.TimeoutException as exc:
                error: BaseException = StackMachineConnectionError(
                    "StackMachine request timed out after "
                    f"{_timeout(self.config, request_options)}s.",
                    operation_name=op_name,
                    code="request_timeout",
                    cause=exc,
                )
            except httpx.RequestError as exc:
                error = StackMachineConnectionError(
                    str(exc) or "StackMachine network request failed.",
                    operation_name=op_name,
                    cause=exc,
                )
            except BaseException as exc:
                error = exc
            if not _should_retry(error, attempt, max_retries):
                raise error
            time.sleep(_retry_delay(attempt))
            attempt += 1

    def subscribe(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> Iterator[Any]:
        import websocket

        op_name = operation_name(query)
        headers = [
            f"{key}: {value}"
            for key, value in _headers(
                self.api_key, self.config, request_options
            ).items()
        ]
        ws = websocket.create_connection(
            _subscription_url(self.config.api_url),
            header=headers,
            subprotocols=["graphql-transport-ws"],
            timeout=_timeout(self.config, request_options),
        )
        try:
            ws.send(json.dumps({"type": "connection_init"}))
            while True:
                message = json.loads(ws.recv())
                if message.get("type") == "connection_ack":
                    break
                if message.get("type") in {"connection_error", "error"}:
                    raise StackMachineAPIError(
                        "StackMachine GraphQL subscription connection failed.",
                        operation_name=op_name,
                    )
            ws.send(
                json.dumps(
                    {
                        "id": "1",
                        "type": "subscribe",
                        "payload": {
                            "query": query,
                            "variables": variables or {},
                            "operationName": op_name,
                        },
                    }
                )
            )
            while True:
                message = json.loads(ws.recv())
                kind = message.get("type")
                if kind == "next":
                    payload = message.get("payload") or {}
                    errors = payload.get("errors")
                    if errors:
                        raise stackmachine_error_from_graphql_errors(errors, op_name)
                    yield payload.get("data")
                elif kind == "complete":
                    return
                elif kind == "error":
                    raise StackMachineAPIError(
                        "StackMachine GraphQL subscription failed.",
                        operation_name=op_name,
                    )
        except websocket.WebSocketException as exc:
            raise StackMachineConnectionError(
                str(exc) or "StackMachine subscription failed.",
                operation_name=op_name,
                cause=exc,
            ) from exc
        finally:
            ws.close()


class AsyncTransport:
    def __init__(
        self,
        api_key: str,
        config: ClientConfig,
        *,
        http_client: Optional[httpx.AsyncClient] = None,
        http_transport: Optional[httpx.AsyncBaseTransport] = None,
    ) -> None:
        self.api_key = api_key
        self.config = config
        self.client = http_client or httpx.AsyncClient(transport=http_transport)
        self._owns_client = http_client is None

    async def close(self) -> None:
        if self._owns_client:
            await self.client.aclose()

    async def execute(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
        mutation: bool = False,
        uploadables: Optional[Mapping[str, FileInput]] = None,
    ) -> Any:
        op_name = operation_name(query)
        resolved_variables = dict(variables or {})
        if mutation:
            resolved_variables = _variables_with_client_mutation_id(
                resolved_variables, request_options
            )
        payload = {
            "query": query,
            "variables": resolved_variables
            if uploadables
            else _clean_json(resolved_variables),
            "operationName": op_name,
        }
        attempt = 0
        max_retries = _max_retries(self.config, request_options)
        while True:
            try:
                headers = _headers(self.api_key, self.config, request_options)
                if uploadables:
                    response = await self.client.post(
                        self.config.api_url,
                        files=_multipart_files(payload, uploadables),
                        headers=headers,
                        timeout=_timeout(self.config, request_options),
                    )
                else:
                    response = await self.client.post(
                        self.config.api_url,
                        json=payload,
                        headers={
                            **headers,
                            "Content-Type": "application/json",
                        },
                        timeout=_timeout(self.config, request_options),
                    )
                body = _json_body(response)
                if response.status_code >= 400:
                    raise _api_error(response, body, op_name)
                errors = _graphql_errors(body)
                if errors:
                    raise stackmachine_error_from_graphql_errors(errors, op_name)
                return body.get("data") if isinstance(body, Mapping) else body
            except httpx.TimeoutException as exc:
                error: BaseException = StackMachineConnectionError(
                    "StackMachine request timed out after "
                    f"{_timeout(self.config, request_options)}s.",
                    operation_name=op_name,
                    code="request_timeout",
                    cause=exc,
                )
            except httpx.RequestError as exc:
                error = StackMachineConnectionError(
                    str(exc) or "StackMachine network request failed.",
                    operation_name=op_name,
                    cause=exc,
                )
            except BaseException as exc:
                error = exc
            if not _should_retry(error, attempt, max_retries):
                raise error
            await asyncio.sleep(_retry_delay(attempt))
            attempt += 1

    async def subscribe(
        self,
        query: str,
        variables: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AsyncIterator[Any]:
        import websockets

        op_name = operation_name(query)
        headers = _headers(self.api_key, self.config, request_options)
        subprotocols = cast(Any, ["graphql-transport-ws"])
        open_timeout = _timeout(self.config, request_options)
        try:
            async with websockets.connect(
                _subscription_url(self.config.api_url),
                additional_headers=headers,
                subprotocols=subprotocols,
                open_timeout=open_timeout,
            ) as ws:
                await ws.send(json.dumps({"type": "connection_init"}))
                async for raw in ws:
                    message = json.loads(raw)
                    if message.get("type") == "connection_ack":
                        break
                    if message.get("type") in {"connection_error", "error"}:
                        raise StackMachineAPIError(
                            "StackMachine GraphQL subscription connection failed.",
                            operation_name=op_name,
                        )
                await ws.send(
                    json.dumps(
                        {
                            "id": "1",
                            "type": "subscribe",
                            "payload": {
                                "query": query,
                                "variables": variables or {},
                                "operationName": op_name,
                            },
                        }
                    )
                )
                async for raw in ws:
                    message = json.loads(raw)
                    kind = message.get("type")
                    if kind == "next":
                        payload = message.get("payload") or {}
                        errors = payload.get("errors")
                        if errors:
                            raise stackmachine_error_from_graphql_errors(
                                errors, op_name
                            )
                        yield payload.get("data")
                    elif kind == "complete":
                        return
                    elif kind == "error":
                        raise StackMachineAPIError(
                            "StackMachine GraphQL subscription failed.",
                            operation_name=op_name,
                        )
        except TypeError:
            legacy_connect = cast(Any, websockets.connect)
            async with legacy_connect(
                _subscription_url(self.config.api_url),
                extra_headers=headers,
                subprotocols=subprotocols,
                open_timeout=open_timeout,
            ) as ws:
                await ws.send(json.dumps({"type": "connection_init"}))
                async for raw in ws:
                    message = json.loads(raw)
                    if message.get("type") == "connection_ack":
                        break
                await ws.send(
                    json.dumps(
                        {
                            "id": "1",
                            "type": "subscribe",
                            "payload": {
                                "query": query,
                                "variables": variables or {},
                                "operationName": op_name,
                            },
                        }
                    )
                )
                async for raw in ws:
                    message = json.loads(raw)
                    if message.get("type") == "next":
                        yield (message.get("payload") or {}).get("data")
                    elif message.get("type") == "complete":
                        return
        except Exception as exc:
            if isinstance(exc, StackMachineAPIError):
                raise
            raise StackMachineConnectionError(
                str(exc) or "StackMachine subscription failed.",
                operation_name=op_name,
                cause=exc,
            ) from exc
