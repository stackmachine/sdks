from __future__ import annotations

from typing import Any, Callable, Mapping, Optional

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import UploadProgress
from .._uploads import AsyncUploader, SyncUploader, _short_name


class FilesResource:
    def __init__(self, client: Any, uploader: SyncUploader) -> None:
        self._client = client
        self._uploader = uploader

    def upload(
        self,
        file: Any,
        *,
        chunk_size: Optional[int] = None,
        on_progress: Optional[Callable[[UploadProgress], None]] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> str:
        response = self._client._query(
            gql.UPLOAD_QUERY,
            {"filename": f"{_short_name()}.zip"},
            request_options=request_options,
        )
        url = ((response.get("getSignedUrl") or {}).get("url") if response else None)
        if not url:
            raise StackMachineAPIError(
                "Failed to generate upload URL for the zip file.",
                operation_name="uploadQuery",
            )
        self._uploader.upload(
            url,
            file,
            chunk_size=chunk_size,
            on_progress=on_progress,
            timeout=timeout,
            max_network_retries=max_network_retries,
        )
        return url


class AsyncFilesResource:
    def __init__(self, client: Any, uploader: AsyncUploader) -> None:
        self._client = client
        self._uploader = uploader

    async def upload(
        self,
        file: Any,
        *,
        chunk_size: Optional[int] = None,
        on_progress: Optional[Callable[[UploadProgress], None]] = None,
        timeout: Optional[float] = None,
        max_network_retries: Optional[int] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> str:
        response = await self._client._query(
            gql.UPLOAD_QUERY,
            {"filename": f"{_short_name()}.zip"},
            request_options=request_options,
        )
        url = ((response.get("getSignedUrl") or {}).get("url") if response else None)
        if not url:
            raise StackMachineAPIError(
                "Failed to generate upload URL for the zip file.",
                operation_name="uploadQuery",
            )
        await self._uploader.upload(
            url,
            file,
            chunk_size=chunk_size,
            on_progress=on_progress,
            timeout=timeout,
            max_network_retries=max_network_retries,
        )
        return url
