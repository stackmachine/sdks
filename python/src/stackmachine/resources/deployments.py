from __future__ import annotations

import asyncio
import threading
import warnings
from typing import Any, Callable, Mapping, Optional

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import DeployAppVersion, DeploymentProgress
from .._utils import camelize, merge_input
from ._shared import required_payload, resource_missing_error

FAILED_STATUSES = {"CANCELLED", "FAILED", "INTERNAL_ERROR", "TIMEOUT"}


class Deployment:
    def __init__(
        self,
        build_id: str,
        client: Any,
        *,
        status: Optional[str] = None,
        app_version: Optional[DeployAppVersion] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> None:
        self.build_id = build_id
        self.buildId = build_id
        self.status = status
        self.app_version = app_version
        self.appVersion = app_version
        self._client = client
        self._request_options = request_options
        self._pending_progress: list[DeploymentProgress] = []
        self._on_progress: Optional[Callable[[DeploymentProgress], None]] = None

    def _terminal_error(self) -> StackMachineAPIError:
        return StackMachineAPIError(
            f"The app build ended with status {self.status}.",
            operation_name="srcAutobuildSubscription",
        )

    def _missing_app_version_error(self) -> StackMachineAPIError:
        return StackMachineAPIError(
            "Error when building the app: build finished without deployed app.",
            operation_name="srcAutobuildSubscription",
        )

    def _set_progress_callback(
        self, callback: Optional[Callable[[DeploymentProgress], None]]
    ) -> None:
        if callback is None:
            return
        for progress in self._pending_progress:
            callback(progress)
        self._pending_progress = []
        self._on_progress = callback

    def _dispatch_progress(self, progress: DeploymentProgress) -> None:
        if self._on_progress:
            self._on_progress(progress)
        else:
            self._pending_progress.append(progress)

    def wait(
        self,
        *,
        on_progress: Optional[Callable[[DeploymentProgress], None]] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> DeployAppVersion:
        self._set_progress_callback(on_progress)
        if self.app_version and self.status == "SUCCESS":
            return self.app_version
        if self.status in FAILED_STATUSES:
            raise self._terminal_error()
        for data in self._client._subscribe_deployment(
            self.build_id, request_options or self._request_options
        ):
            event = data.get("autobuildDeployment") if data else None
            if not event:
                continue
            kind = event.get("kind")
            message = event.get("message")
            if kind == "FAILED":
                self.status = "FAILED"
                raise StackMachineAPIError(
                    message or "The app build failed.",
                    operation_name="srcAutobuildSubscription",
                )
            if kind == "COMPLETE":
                self.status = "SUCCESS"
                app_version = event.get("appVersion")
                if not app_version:
                    raise self._missing_app_version_error()
                self.app_version = DeployAppVersion.from_graphql(app_version)
                self.appVersion = self.app_version
                return self.app_version
            self._dispatch_progress(DeploymentProgress.from_graphql(event))
        if self.app_version:
            return self.app_version
        raise self._missing_app_version_error()

    def finish(self) -> DeployAppVersion:
        warnings.warn(
            "`finish()` is deprecated. Use `wait()` instead.",
            DeprecationWarning,
            stacklevel=2,
        )
        return self.wait()

    def subscribe_to_progress(
        self, callback: Callable[[DeploymentProgress], None]
    ) -> threading.Thread:
        warnings.warn(
            "`subscribe_to_progress()` is deprecated. Use `wait(on_progress=...)`.",
            DeprecationWarning,
            stacklevel=2,
        )
        self._set_progress_callback(callback)
        thread = threading.Thread(target=self.wait, daemon=True)
        thread.start()
        return thread

    subscribeToProgress = subscribe_to_progress


class AsyncDeployment:
    def __init__(
        self,
        build_id: str,
        client: Any,
        *,
        status: Optional[str] = None,
        app_version: Optional[DeployAppVersion] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> None:
        self.build_id = build_id
        self.buildId = build_id
        self.status = status
        self.app_version = app_version
        self.appVersion = app_version
        self._client = client
        self._request_options = request_options
        self._pending_progress: list[DeploymentProgress] = []
        self._on_progress: Optional[Callable[[DeploymentProgress], None]] = None

    def _terminal_error(self) -> StackMachineAPIError:
        return StackMachineAPIError(
            f"The app build ended with status {self.status}.",
            operation_name="srcAutobuildSubscription",
        )

    def _missing_app_version_error(self) -> StackMachineAPIError:
        return StackMachineAPIError(
            "Error when building the app: build finished without deployed app.",
            operation_name="srcAutobuildSubscription",
        )

    def _set_progress_callback(
        self, callback: Optional[Callable[[DeploymentProgress], None]]
    ) -> None:
        if callback is None:
            return
        for progress in self._pending_progress:
            callback(progress)
        self._pending_progress = []
        self._on_progress = callback

    def _dispatch_progress(self, progress: DeploymentProgress) -> None:
        if self._on_progress:
            self._on_progress(progress)
        else:
            self._pending_progress.append(progress)

    async def wait(
        self,
        *,
        on_progress: Optional[Callable[[DeploymentProgress], None]] = None,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> DeployAppVersion:
        self._set_progress_callback(on_progress)
        if self.app_version and self.status == "SUCCESS":
            return self.app_version
        if self.status in FAILED_STATUSES:
            raise self._terminal_error()
        async for data in self._client._subscribe_deployment(
            self.build_id, request_options or self._request_options
        ):
            event = data.get("autobuildDeployment") if data else None
            if not event:
                continue
            kind = event.get("kind")
            message = event.get("message")
            if kind == "FAILED":
                self.status = "FAILED"
                raise StackMachineAPIError(
                    message or "The app build failed.",
                    operation_name="srcAutobuildSubscription",
                )
            if kind == "COMPLETE":
                self.status = "SUCCESS"
                app_version = event.get("appVersion")
                if not app_version:
                    raise self._missing_app_version_error()
                self.app_version = DeployAppVersion.from_graphql(app_version)
                self.appVersion = self.app_version
                return self.app_version
            self._dispatch_progress(DeploymentProgress.from_graphql(event))
        if self.app_version:
            return self.app_version
        raise self._missing_app_version_error()

    async def finish(self) -> DeployAppVersion:
        warnings.warn(
            "`finish()` is deprecated. Use `wait()` instead.",
            DeprecationWarning,
            stacklevel=2,
        )
        return await self.wait()

    def subscribe_to_progress(
        self, callback: Callable[[DeploymentProgress], None]
    ) -> asyncio.Task[DeployAppVersion]:
        warnings.warn(
            "`subscribe_to_progress()` is deprecated. Use `wait(on_progress=...)`.",
            DeprecationWarning,
            stacklevel=2,
        )
        self._set_progress_callback(callback)
        return asyncio.create_task(self.wait())

    subscribeToProgress = subscribe_to_progress


class DeploymentsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def _from_status(
        self, data: Mapping[str, Any], request_options: Optional[Mapping[str, Any]]
    ) -> Deployment:
        app_version = (
            DeployAppVersion.from_graphql(data["appVersion"])
            if data.get("appVersion")
            else None
        )
        return Deployment(
            str(data["buildId"]),
            self._client,
            status=data.get("status"),
            app_version=app_version,
            request_options=request_options,
        )

    def _retrieve_or_none(
        self, build_id: str, request_options: Optional[Mapping[str, Any]] = None
    ) -> Optional[Deployment]:
        data = self._client._query(
            gql.GET_DEPLOYMENT_STATUS_QUERY,
            {"buildId": build_id},
            request_options=request_options,
        )
        status = data.get("autobuildDeploymentStatus") if data else None
        return self._from_status(status, request_options) if status else None

    def create(
        self,
        input: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[Mapping[str, Any]] = None,
        **kwargs: Any,
    ) -> Deployment:
        response = self._client._mutation(
            gql.AUTOBUILD_MUTATION,
            {"input": camelize(merge_input(input, **kwargs))},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("deployViaAutobuild") if response else None,
            "The app could not be built.",
            "srcAutobuildMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "The app could not be built.",
                operation_name="srcAutobuildMutation",
            )
        return Deployment(
            str(payload["buildId"]),
            self._client,
            request_options=request_options,
        )

    def retrieve(
        self, build_id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> Deployment:
        deployment = self._retrieve_or_none(build_id, request_options)
        if not deployment:
            raise resource_missing_error(
                "deployment", build_id, "srcGetDeploymentStatusQuery", "build_id"
            )
        return deployment

    def retrieve_many(
        self,
        build_ids: list[str],
        *,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> list[Optional[Deployment]]:
        return [
            self._retrieve_or_none(build_id, request_options)
            for build_id in build_ids
        ]

    retrieveMany = retrieve_many


class AsyncDeploymentsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def _from_status(
        self, data: Mapping[str, Any], request_options: Optional[Mapping[str, Any]]
    ) -> AsyncDeployment:
        app_version = (
            DeployAppVersion.from_graphql(data["appVersion"])
            if data.get("appVersion")
            else None
        )
        return AsyncDeployment(
            str(data["buildId"]),
            self._client,
            status=data.get("status"),
            app_version=app_version,
            request_options=request_options,
        )

    async def _retrieve_or_none(
        self, build_id: str, request_options: Optional[Mapping[str, Any]] = None
    ) -> Optional[AsyncDeployment]:
        data = await self._client._query(
            gql.GET_DEPLOYMENT_STATUS_QUERY,
            {"buildId": build_id},
            request_options=request_options,
        )
        status = data.get("autobuildDeploymentStatus") if data else None
        return self._from_status(status, request_options) if status else None

    async def create(
        self,
        input: Optional[Mapping[str, Any]] = None,
        *,
        request_options: Optional[Mapping[str, Any]] = None,
        **kwargs: Any,
    ) -> AsyncDeployment:
        response = await self._client._mutation(
            gql.AUTOBUILD_MUTATION,
            {"input": camelize(merge_input(input, **kwargs))},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("deployViaAutobuild") if response else None,
            "The app could not be built.",
            "srcAutobuildMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "The app could not be built.",
                operation_name="srcAutobuildMutation",
            )
        return AsyncDeployment(
            str(payload["buildId"]),
            self._client,
            request_options=request_options,
        )

    async def retrieve(
        self, build_id: str, *, request_options: Optional[Mapping[str, Any]] = None
    ) -> AsyncDeployment:
        deployment = await self._retrieve_or_none(build_id, request_options)
        if not deployment:
            raise resource_missing_error(
                "deployment", build_id, "srcGetDeploymentStatusQuery", "build_id"
            )
        return deployment

    async def retrieve_many(
        self,
        build_ids: list[str],
        *,
        request_options: Optional[Mapping[str, Any]] = None,
    ) -> list[Optional[AsyncDeployment]]:
        return [
            await self._retrieve_or_none(build_id, request_options)
            for build_id in build_ids
        ]

    retrieveMany = retrieve_many
