from __future__ import annotations

from typing import Any, Optional

from .._errors import (
    StackMachineAPIError,
    StackMachineGraphQLError,
    StackMachineInvalidRequestError,
)
from .._graphql import operations as gql
from .._models import GithubRepoConnection
from .._types import RequestOptionsLike
from ._shared import required_payload, resource_missing_error


def _should_retry_update_with_connection_id(error: BaseException) -> bool:
    return isinstance(
        error, (StackMachineGraphQLError, StackMachineInvalidRequestError)
    )


def _update_input(
    id_key: str,
    id_value: str,
    *,
    deploy_branch: Optional[str],
    deployment_status_events: Optional[bool],
    pull_request_comments: Optional[bool],
) -> dict[str, Any]:
    return {
        id_key: id_value,
        "deployBranch": deploy_branch,
        "deploymentStatusEvents": deployment_status_events,
        "pullRequestComments": pull_request_comments,
    }


class AppsGitResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def retrieve(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> GithubRepoConnection:
        response = self._client._query(
            gql.GET_APP_GIT_CONNECTION_QUERY,
            {"id": app_id},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        connection = node.get("githubRepoConnection") if node else None
        if not connection:
            raise resource_missing_error(
                "git connection",
                app_id,
                "srcGetAppGitConnectionQuery",
                "app",
            )
        return GithubRepoConnection.from_graphql(connection)

    def retrieve_many(
        self,
        app_ids: list[str],
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[Optional[GithubRepoConnection]]:
        if not app_ids:
            return []
        response = self._client._query(
            gql.GET_APP_GIT_CONNECTIONS_QUERY,
            {"ids": app_ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[GithubRepoConnection]] = []
        for index, _ in enumerate(app_ids):
            node = nodes[index] if index < len(nodes) else None
            connection = (
                node.get("githubRepoConnection")
                if node and node.get("__typename") == "DeployApp"
                else None
            )
            result.append(
                GithubRepoConnection.from_graphql(connection) if connection else None
            )
        return result

    def connect(
        self,
        *,
        app: str,
        installation_repo_id: str,
        deploy_branch: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> GithubRepoConnection:
        response = self._client._mutation(
            gql.CONNECT_GITHUB_REPO_TO_APP_MUTATION,
            {
                "input": {
                    "appId": app,
                    "installationRepoId": installation_repo_id,
                    "deployBranch": deploy_branch,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("connectGithubRepoToApp") if response else None,
            "Failed to connect GitHub repo to app, mutation failed.",
            "srcConnectGithubRepoToAppMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to connect GitHub repo to app, mutation was not successful.",
                operation_name="srcConnectGithubRepoToAppMutation",
            )
        connection = required_payload(
            payload.get("githubRepoConnection"),
            "Failed to connect GitHub repo to app, no connection returned.",
            "srcConnectGithubRepoToAppMutation",
        )
        return GithubRepoConnection.from_graphql(connection)

    def update(
        self,
        app_or_connection_id: str,
        *,
        deploy_branch: Optional[str] = None,
        deployment_status_events: Optional[bool] = None,
        pull_request_comments: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> GithubRepoConnection:
        try:
            return self._update_with_id(
                "appId",
                app_or_connection_id,
                deploy_branch=deploy_branch,
                deployment_status_events=deployment_status_events,
                pull_request_comments=pull_request_comments,
                request_options=request_options,
            )
        except (StackMachineGraphQLError, StackMachineInvalidRequestError) as exc:
            if not _should_retry_update_with_connection_id(exc):
                raise
            return self._update_with_id(
                "connectionId",
                app_or_connection_id,
                deploy_branch=deploy_branch,
                deployment_status_events=deployment_status_events,
                pull_request_comments=pull_request_comments,
                request_options=request_options,
            )

    def _update_with_id(
        self,
        id_key: str,
        id_value: str,
        *,
        deploy_branch: Optional[str],
        deployment_status_events: Optional[bool],
        pull_request_comments: Optional[bool],
        request_options: Optional[RequestOptionsLike],
    ) -> GithubRepoConnection:
        response = self._client._mutation(
            gql.UPDATE_GITHUB_REPO_CONNECTION_MUTATION,
            {
                "input": _update_input(
                    id_key,
                    id_value,
                    deploy_branch=deploy_branch,
                    deployment_status_events=deployment_status_events,
                    pull_request_comments=pull_request_comments,
                )
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("updateGithubRepoConnection") if response else None,
            "Failed to update GitHub repo connection, mutation failed.",
            "srcUpdateGithubRepoConnectionMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to update GitHub repo connection, mutation was not successful.",
                operation_name="srcUpdateGithubRepoConnectionMutation",
            )
        connection = required_payload(
            payload.get("githubRepoConnection"),
            "Failed to update GitHub repo connection, no connection returned.",
            "srcUpdateGithubRepoConnectionMutation",
        )
        return GithubRepoConnection.from_graphql(connection)

    def delete(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = self._client._mutation(
            gql.DISCONNECT_GITHUB_REPO_FROM_APP_MUTATION,
            {"input": {"appId": app_id}},
            request_options=request_options,
        )
        if not (response.get("disconnectGithubRepoFromApp") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to disconnect GitHub repo from app, mutation was not "
                "successful.",
                operation_name="srcDisconnectGithubRepoFromAppMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many


class AsyncAppsGitResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def retrieve(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> GithubRepoConnection:
        response = await self._client._query(
            gql.GET_APP_GIT_CONNECTION_QUERY,
            {"id": app_id},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        connection = node.get("githubRepoConnection") if node else None
        if not connection:
            raise resource_missing_error(
                "git connection",
                app_id,
                "srcGetAppGitConnectionQuery",
                "app",
            )
        return GithubRepoConnection.from_graphql(connection)

    async def retrieve_many(
        self,
        app_ids: list[str],
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[Optional[GithubRepoConnection]]:
        if not app_ids:
            return []
        response = await self._client._query(
            gql.GET_APP_GIT_CONNECTIONS_QUERY,
            {"ids": app_ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[GithubRepoConnection]] = []
        for index, _ in enumerate(app_ids):
            node = nodes[index] if index < len(nodes) else None
            connection = (
                node.get("githubRepoConnection")
                if node and node.get("__typename") == "DeployApp"
                else None
            )
            result.append(
                GithubRepoConnection.from_graphql(connection) if connection else None
            )
        return result

    async def connect(
        self,
        *,
        app: str,
        installation_repo_id: str,
        deploy_branch: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> GithubRepoConnection:
        response = await self._client._mutation(
            gql.CONNECT_GITHUB_REPO_TO_APP_MUTATION,
            {
                "input": {
                    "appId": app,
                    "installationRepoId": installation_repo_id,
                    "deployBranch": deploy_branch,
                }
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("connectGithubRepoToApp") if response else None,
            "Failed to connect GitHub repo to app, mutation failed.",
            "srcConnectGithubRepoToAppMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to connect GitHub repo to app, mutation was not successful.",
                operation_name="srcConnectGithubRepoToAppMutation",
            )
        connection = required_payload(
            payload.get("githubRepoConnection"),
            "Failed to connect GitHub repo to app, no connection returned.",
            "srcConnectGithubRepoToAppMutation",
        )
        return GithubRepoConnection.from_graphql(connection)

    async def update(
        self,
        app_or_connection_id: str,
        *,
        deploy_branch: Optional[str] = None,
        deployment_status_events: Optional[bool] = None,
        pull_request_comments: Optional[bool] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> GithubRepoConnection:
        try:
            return await self._update_with_id(
                "appId",
                app_or_connection_id,
                deploy_branch=deploy_branch,
                deployment_status_events=deployment_status_events,
                pull_request_comments=pull_request_comments,
                request_options=request_options,
            )
        except (StackMachineGraphQLError, StackMachineInvalidRequestError) as exc:
            if not _should_retry_update_with_connection_id(exc):
                raise
            return await self._update_with_id(
                "connectionId",
                app_or_connection_id,
                deploy_branch=deploy_branch,
                deployment_status_events=deployment_status_events,
                pull_request_comments=pull_request_comments,
                request_options=request_options,
            )

    async def _update_with_id(
        self,
        id_key: str,
        id_value: str,
        *,
        deploy_branch: Optional[str],
        deployment_status_events: Optional[bool],
        pull_request_comments: Optional[bool],
        request_options: Optional[RequestOptionsLike],
    ) -> GithubRepoConnection:
        response = await self._client._mutation(
            gql.UPDATE_GITHUB_REPO_CONNECTION_MUTATION,
            {
                "input": _update_input(
                    id_key,
                    id_value,
                    deploy_branch=deploy_branch,
                    deployment_status_events=deployment_status_events,
                    pull_request_comments=pull_request_comments,
                )
            },
            request_options=request_options,
        )
        payload = required_payload(
            response.get("updateGithubRepoConnection") if response else None,
            "Failed to update GitHub repo connection, mutation failed.",
            "srcUpdateGithubRepoConnectionMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to update GitHub repo connection, mutation was not successful.",
                operation_name="srcUpdateGithubRepoConnectionMutation",
            )
        connection = required_payload(
            payload.get("githubRepoConnection"),
            "Failed to update GitHub repo connection, no connection returned.",
            "srcUpdateGithubRepoConnectionMutation",
        )
        return GithubRepoConnection.from_graphql(connection)

    async def delete(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> None:
        response = await self._client._mutation(
            gql.DISCONNECT_GITHUB_REPO_FROM_APP_MUTATION,
            {"input": {"appId": app_id}},
            request_options=request_options,
        )
        if not (response.get("disconnectGithubRepoFromApp") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to disconnect GitHub repo from app, mutation was not "
                "successful.",
                operation_name="srcDisconnectGithubRepoFromAppMutation",
            )

    del_ = delete
    retrieveMany = retrieve_many
