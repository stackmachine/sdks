from __future__ import annotations

import asyncio
import io
import random
import time
import zipfile
from typing import Any, Callable, Mapping, Optional

import httpx

from ._errors import (
    StackMachineAPIError,
    StackMachineConnectionError,
    StackMachineValidationError,
)
from ._models import UploadProgress
from ._transport import AsyncTransport, SyncTransport
from ._utils import read_file_bytes

DEFAULT_CHUNK_SIZE = 1024 * 1024
MAX_CHUNK_SIZE = 512 * 1024 * 1024
RETRYABLE_UPLOAD_STATUS_CODES = {408, 409, 425, 429, 500, 502, 503, 504}


def create_zip(files: Mapping[str, Any]) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name, value in files.items():
            archive.writestr(name, read_file_bytes(value))
    return buffer.getvalue()


def _validate_chunk_size(chunk_size: Optional[int]) -> int:
    value = chunk_size or DEFAULT_CHUNK_SIZE
    if value < 1 or value > MAX_CHUNK_SIZE:
        raise StackMachineValidationError(
            f"`chunk_size` must be an integer between 1 and {MAX_CHUNK_SIZE} bytes.",
            code="invalid_upload_chunk_size",
            param="chunk_size",
        )
    return value


def _short_name() -> str:
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    return "".join(random.choice(chars) for _ in range(8))


def _progress_reporter(
    total: int,
    on_progress: Optional[Callable[[UploadProgress], None]],
) -> Callable[[int], None]:
    last_percent = -1.0

    def report(loaded: int) -> None:
        nonlocal last_percent
        normalized = max(0, min(total, loaded))
        percent = 1.0 if total == 0 else normalized / total
        if percent <= last_percent:
            return
        last_percent = percent
        if on_progress:
            on_progress(UploadProgress(loaded=normalized, total=total, percent=percent))

    return report


def _uploaded_bytes_from_range(header: Optional[str]) -> Optional[int]:
    if not header or not header.startswith("bytes=0-"):
        return None
    try:
        return int(header.split("-", 1)[1]) + 1
    except ValueError:
        return None


def _upload_api_error(response: httpx.Response, operation_name: str, fallback: str):
    return StackMachineAPIError(
        f"{fallback}: {response.reason_phrase or response.status_code}",
        operation_name=operation_name,
        status_code=response.status_code,
    )


def _should_retry_upload(error: BaseException, attempt: int, max_retries: int) -> bool:
    if attempt >= max_retries:
        return False
    if isinstance(error, StackMachineConnectionError):
        return error.code != "request_aborted"
    if isinstance(error, StackMachineAPIError):
        return error.status_code in RETRYABLE_UPLOAD_STATUS_CODES
    return False


def _retry_delay(attempt: int) -> float:
    base = min(0.1 * 2**attempt, 2.0)
    return base / 2 + random.random() * (base / 2)


class SyncUploader:
    def __init__(self, transport: SyncTransport) -> None:
        self.transport = transport

    def upload(
        self,
        signed_url: str,
        file: Any,
        *,
        chunk_size: Optional[int] = None,
        on_progress: Optional[Callable[[UploadProgress], None]] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
    ) -> None:
        data = read_file_bytes(file)
        chunk_size = _validate_chunk_size(chunk_size)
        max_retries = (
            max_network_retries
            if max_network_retries is not None
            else self.transport.config.max_network_retries
        )
        report = _progress_reporter(len(data), on_progress)
        report(0)
        upload_url = self._initiate(signed_url, timeout, max_retries)
        if not data:
            report(0)
            return
        start = 0
        while start < len(data):
            end = min(start + chunk_size, len(data))
            response = self._put_chunk(
                upload_url, data[start:end], start, end, len(data), timeout, max_retries
            )
            if response.status_code == 308:
                uploaded = (
                    _uploaded_bytes_from_range(response.headers.get("Range")) or end
                )
                if uploaded <= start:
                    raise StackMachineAPIError(
                        "Upload did not report progress after chunk upload.",
                        operation_name="uploadChunk",
                        status_code=response.status_code,
                    )
                start = uploaded
                report(start)
            elif response.is_success:
                start = len(data)
                report(start)

    def _request_with_retry(
        self,
        operation_name: str,
        max_retries: int,
        request: Callable[[], httpx.Response],
    ) -> httpx.Response:
        attempt = 0
        while True:
            try:
                return request()
            except httpx.TimeoutException as exc:
                error: BaseException = StackMachineConnectionError(
                    "StackMachine upload timed out.",
                    operation_name=operation_name,
                    code="request_timeout",
                    cause=exc,
                )
            except httpx.RequestError as exc:
                error = StackMachineConnectionError(
                    str(exc) or "StackMachine upload failed.",
                    operation_name=operation_name,
                    cause=exc,
                )
            except BaseException as exc:
                error = exc
            if not _should_retry_upload(error, attempt, max_retries):
                raise error
            time.sleep(_retry_delay(attempt))
            attempt += 1

    def _initiate(
        self, url: str, timeout: Optional[float], max_retries: int
    ) -> str:
        response = self._request_with_retry(
            "initiateResumableUpload",
            max_retries,
            lambda: self.transport.client.post(
                url,
                headers={
                    "Content-Type": "application/octet-stream",
                    "x-goog-resumable": "start",
                    "Content-Length": "0",
                },
                timeout=timeout or self.transport.config.timeout,
            ),
        )
        if not response.is_success:
            raise _upload_api_error(
                response, "initiateResumableUpload", "Failed to initiate upload"
            )
        upload_url = response.headers.get("Location")
        if not upload_url:
            raise StackMachineAPIError(
                "No upload URL received from server.",
                operation_name="initiateResumableUpload",
                status_code=response.status_code,
            )
        return upload_url

    def _put_chunk(
        self,
        upload_url: str,
        chunk: bytes,
        start: int,
        end: int,
        total: int,
        timeout: Optional[float],
        max_retries: int,
    ) -> httpx.Response:
        response = self._request_with_retry(
            "uploadChunk",
            max_retries,
            lambda: self.transport.client.put(
                upload_url,
                content=chunk,
                headers={
                    "Content-Type": "application/octet-stream",
                    "Content-Range": f"bytes {start}-{end - 1}/{total}",
                    "Content-Length": str(len(chunk)),
                },
                timeout=timeout or self.transport.config.timeout,
            ),
        )
        if not response.is_success and response.status_code != 308:
            raise _upload_api_error(response, "uploadChunk", "Upload failed")
        return response


class AsyncUploader:
    def __init__(self, transport: AsyncTransport) -> None:
        self.transport = transport

    async def upload(
        self,
        signed_url: str,
        file: Any,
        *,
        chunk_size: Optional[int] = None,
        on_progress: Optional[Callable[[UploadProgress], None]] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
    ) -> None:
        data = read_file_bytes(file)
        chunk_size = _validate_chunk_size(chunk_size)
        max_retries = (
            max_network_retries
            if max_network_retries is not None
            else self.transport.config.max_network_retries
        )
        report = _progress_reporter(len(data), on_progress)
        report(0)
        upload_url = await self._initiate(signed_url, timeout, max_retries)
        if not data:
            report(0)
            return
        start = 0
        while start < len(data):
            end = min(start + chunk_size, len(data))
            response = await self._put_chunk(
                upload_url, data[start:end], start, end, len(data), timeout, max_retries
            )
            if response.status_code == 308:
                uploaded = (
                    _uploaded_bytes_from_range(response.headers.get("Range")) or end
                )
                if uploaded <= start:
                    raise StackMachineAPIError(
                        "Upload did not report progress after chunk upload.",
                        operation_name="uploadChunk",
                        status_code=response.status_code,
                    )
                start = uploaded
                report(start)
            elif response.is_success:
                start = len(data)
                report(start)

    async def _request_with_retry(
        self,
        operation_name: str,
        max_retries: int,
        request: Callable[[], Any],
    ) -> httpx.Response:
        attempt = 0
        while True:
            try:
                return await request()
            except httpx.TimeoutException as exc:
                error: BaseException = StackMachineConnectionError(
                    "StackMachine upload timed out.",
                    operation_name=operation_name,
                    code="request_timeout",
                    cause=exc,
                )
            except httpx.RequestError as exc:
                error = StackMachineConnectionError(
                    str(exc) or "StackMachine upload failed.",
                    operation_name=operation_name,
                    cause=exc,
                )
            except BaseException as exc:
                error = exc
            if not _should_retry_upload(error, attempt, max_retries):
                raise error
            await asyncio.sleep(_retry_delay(attempt))
            attempt += 1

    async def _initiate(
        self, url: str, timeout: Optional[float], max_retries: int
    ) -> str:
        response = await self._request_with_retry(
            "initiateResumableUpload",
            max_retries,
            lambda: self.transport.client.post(
                url,
                headers={
                    "Content-Type": "application/octet-stream",
                    "x-goog-resumable": "start",
                    "Content-Length": "0",
                },
                timeout=timeout or self.transport.config.timeout,
            ),
        )
        if not response.is_success:
            raise _upload_api_error(
                response, "initiateResumableUpload", "Failed to initiate upload"
            )
        upload_url = response.headers.get("Location")
        if not upload_url:
            raise StackMachineAPIError(
                "No upload URL received from server.",
                operation_name="initiateResumableUpload",
                status_code=response.status_code,
            )
        return upload_url

    async def _put_chunk(
        self,
        upload_url: str,
        chunk: bytes,
        start: int,
        end: int,
        total: int,
        timeout: Optional[float],
        max_retries: int,
    ) -> httpx.Response:
        response = await self._request_with_retry(
            "uploadChunk",
            max_retries,
            lambda: self.transport.client.put(
                upload_url,
                content=chunk,
                headers={
                    "Content-Type": "application/octet-stream",
                    "Content-Range": f"bytes {start}-{end - 1}/{total}",
                    "Content-Length": str(len(chunk)),
                },
                timeout=timeout or self.transport.config.timeout,
            ),
        )
        if not response.is_success and response.status_code != 308:
            raise _upload_api_error(response, "uploadChunk", "Upload failed")
        return response
