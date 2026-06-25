from __future__ import annotations

from typing import Any, List, Mapping, Optional, Sequence

from typing_extensions import Unpack

from .._errors import StackMachineAPIError, StackMachineValidationError
from .._graphql import operations as gql
from .._models import AppSshServer, SshAuthorizedKey, SshUser
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import (
    PaginationOptions,
    RequestOptionsLike,
    SshAuthenticationMethod,
    SshTokenCreateResult,
    SshUserPasswordRevealResult,
    SshUserPasswordRotateResult,
)
from ._shared import page_variables, required_payload, resource_missing_error


class AppsSshUsersPasswordsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def reveal(
        self, user_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> SshUserPasswordRevealResult:
        response = self._client._mutation(
            gql.REVEAL_SSH_USER_PASSWORD_MUTATION,
            {"input": {"sshUserId": user_id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("revealSshUserPassword") if response else None,
            "Failed to reveal SSH user password.",
            "srcRevealSshUserPasswordMutation",
        )
        return {
            "password": payload.get("password"),
            "ssh_user": SshUser.from_graphql(payload["sshUser"]),
            "sshUser": SshUser.from_graphql(payload["sshUser"]),
        }

    def rotate(
        self, user_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> SshUserPasswordRotateResult:
        response = self._client._mutation(
            gql.ROTATE_SSH_USER_PASSWORD_MUTATION,
            {"input": {"sshUserId": user_id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("rotateSshUserPassword") if response else None,
            "Failed to rotate SSH user password.",
            "srcRotateSshUserPasswordMutation",
        )
        user = SshUser.from_graphql(payload["sshUser"])
        return {"password": payload["password"], "ssh_user": user, "sshUser": user}


class AsyncAppsSshUsersPasswordsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def reveal(
        self, user_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> SshUserPasswordRevealResult:
        response = await self._client._mutation(
            gql.REVEAL_SSH_USER_PASSWORD_MUTATION,
            {"input": {"sshUserId": user_id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("revealSshUserPassword") if response else None,
            "Failed to reveal SSH user password.",
            "srcRevealSshUserPasswordMutation",
        )
        user = SshUser.from_graphql(payload["sshUser"])
        return {"password": payload.get("password"), "ssh_user": user, "sshUser": user}

    async def rotate(
        self, user_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> SshUserPasswordRotateResult:
        response = await self._client._mutation(
            gql.ROTATE_SSH_USER_PASSWORD_MUTATION,
            {"input": {"sshUserId": user_id}},
            request_options=request_options,
        )
        payload = required_payload(
            response.get("rotateSshUserPassword") if response else None,
            "Failed to rotate SSH user password.",
            "srcRotateSshUserPasswordMutation",
        )
        user = SshUser.from_graphql(payload["sshUser"])
        return {"password": payload["password"], "ssh_user": user, "sshUser": user}


class AppsSshUsersAuthorizedKeysResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        user: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[SshAuthorizedKey]:
        params = {"user": user, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.GET_SSH_AUTHORIZED_KEYS_QUERY,
                {"id": page_params["user"], **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                (
                    (response.get("node") or {}).get("authorizedKeys")
                    if response
                    else None
                ),
                SshAuthorizedKey.from_graphql,
            )

        return create_list(params, "/v1/apps/ssh/users/authorized_keys", fetch_page)

    def create(
        self,
        *,
        user: str,
        public_key: str,
        name: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> SshAuthorizedKey:
        response = self._client._mutation(
            gql.ADD_SSH_AUTHORIZED_KEY_MUTATION,
            {"input": {"sshUserId": user, "publicKey": public_key, "name": name}},
            request_options=request_options,
        )
        data = required_payload(
            (response.get("addSshAuthorizedKey") or {}).get("authorizedKey")
            if response
            else None,
            "Failed to add SSH authorized key.",
            "srcAddSshAuthorizedKeyMutation",
        )
        return SshAuthorizedKey.from_graphql(data)

    def delete(
        self,
        authorized_key_id: Optional[str] = None,
        *,
        user: Optional[str] = None,
        name: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> None:
        if authorized_key_id:
            response = self._client._mutation(
                gql.DELETE_SSH_AUTHORIZED_KEY_BY_ID_MUTATION,
                {"input": {"authorizedKeyId": authorized_key_id}},
                request_options=request_options,
            )
            if not (response.get("deleteSshAuthorizedKeyById") or {}).get("success"):
                raise StackMachineAPIError(
                    "Failed to delete SSH authorized key.",
                    operation_name="srcDeleteSshAuthorizedKeyByIdMutation",
                )
            return

        if not user or not name:
            raise StackMachineValidationError(
                "`authorized_key_id` or both `user` and `name` are required to delete "
                "an SSH authorized key.",
                code="invalid_ssh_authorized_key_delete_input",
                param="authorized_key_id",
            )

        response = self._client._mutation(
            gql.DELETE_SSH_AUTHORIZED_KEY_MUTATION,
            {"input": {"sshUserId": user, "name": name}},
            request_options=request_options,
        )
        if not (response.get("deleteSshAuthorizedKey") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete SSH authorized key.",
                operation_name="srcDeleteSshAuthorizedKeyMutation",
            )

    del_ = delete


class AsyncAppsSshUsersAuthorizedKeysResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list(
        self,
        *,
        user: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[SshAuthorizedKey]:
        params = {"user": user, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.GET_SSH_AUTHORIZED_KEYS_QUERY,
                {"id": page_params["user"], **page_variables(normalized)},
                request_options=request_options,
            )
            return connection_to_page_data(
                (
                    (response.get("node") or {}).get("authorizedKeys")
                    if response
                    else None
                ),
                SshAuthorizedKey.from_graphql,
            )

        return create_async_list(
            params, "/v1/apps/ssh/users/authorized_keys", fetch_page
        )

    async def create(
        self,
        *,
        user: str,
        public_key: str,
        name: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> SshAuthorizedKey:
        response = await self._client._mutation(
            gql.ADD_SSH_AUTHORIZED_KEY_MUTATION,
            {"input": {"sshUserId": user, "publicKey": public_key, "name": name}},
            request_options=request_options,
        )
        data = required_payload(
            (response.get("addSshAuthorizedKey") or {}).get("authorizedKey")
            if response
            else None,
            "Failed to add SSH authorized key.",
            "srcAddSshAuthorizedKeyMutation",
        )
        return SshAuthorizedKey.from_graphql(data)

    async def delete(
        self,
        authorized_key_id: Optional[str] = None,
        *,
        user: Optional[str] = None,
        name: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> None:
        if authorized_key_id:
            response = await self._client._mutation(
                gql.DELETE_SSH_AUTHORIZED_KEY_BY_ID_MUTATION,
                {"input": {"authorizedKeyId": authorized_key_id}},
                request_options=request_options,
            )
            if not (response.get("deleteSshAuthorizedKeyById") or {}).get("success"):
                raise StackMachineAPIError(
                    "Failed to delete SSH authorized key.",
                    operation_name="srcDeleteSshAuthorizedKeyByIdMutation",
                )
            return

        if not user or not name:
            raise StackMachineValidationError(
                "`authorized_key_id` or both `user` and `name` are required to delete "
                "an SSH authorized key.",
                code="invalid_ssh_authorized_key_delete_input",
                param="authorized_key_id",
            )

        response = await self._client._mutation(
            gql.DELETE_SSH_AUTHORIZED_KEY_MUTATION,
            {"input": {"sshUserId": user, "name": name}},
            request_options=request_options,
        )
        if not (response.get("deleteSshAuthorizedKey") or {}).get("success"):
            raise StackMachineAPIError(
                "Failed to delete SSH authorized key.",
                operation_name="srcDeleteSshAuthorizedKeyMutation",
            )

    del_ = delete


class AppsSshUsersResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.passwords = AppsSshUsersPasswordsResource(client)
        self.authorized_keys = AppsSshUsersAuthorizedKeysResource(client)
        self.authorizedKeys = self.authorized_keys

    def list(
        self,
        *,
        app: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[SshUser]:
        params = {"app": app, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.GET_APP_SSH_USERS_QUERY,
                {"id": page_params["app"], **page_variables(normalized)},
                request_options=request_options,
            )
            ssh_server = (
                (response.get("node") or {}).get("sshServer")
                if response
                else None
            )
            return connection_to_page_data(
                ssh_server.get("users") if ssh_server else None,
                SshUser.from_graphql,
            )

        return create_list(params, "/v1/apps/ssh/users", fetch_page)

    def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> SshUser:
        response = self._client._query(
            gql.GET_SSH_USER_BY_ID_QUERY,
            {"id": id},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        if not node or node.get("__typename") != "SshUser":
            raise resource_missing_error("SSH user", id, "srcGetSshUserByIdQuery")
        return SshUser.from_graphql(node)

    def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[SshUser]]:
        if not ids:
            return []
        response = self._client._query(
            gql.GET_SSH_USERS_BY_IDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[SshUser]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                SshUser.from_graphql(node)
                if node and node.get("__typename") == "SshUser"
                else None
            )
        return result

    def update(
        self,
        id: str,
        *,
        username: Optional[str] = None,
        sftp_root_folder: Optional[str] = None,
        authentication_methods: Optional[Sequence[SshAuthenticationMethod]] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> SshUser:
        response = self._client._mutation(
            gql.EDIT_SSH_USER_MUTATION,
            {
                "input": {
                    "id": id,
                    "username": username,
                    "sftpRootFolder": sftp_root_folder,
                    "authenticationMethods": authentication_methods,
                }
            },
            request_options=request_options,
        )
        data = required_payload(
            (response.get("editSshUser") or {}).get("sshUser") if response else None,
            "Failed to update SSH user.",
            "srcEditSshUserMutation",
        )
        return SshUser.from_graphql(data)

    retrieveMany = retrieve_many


class AsyncAppsSshUsersResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.passwords = AsyncAppsSshUsersPasswordsResource(client)
        self.authorized_keys = AsyncAppsSshUsersAuthorizedKeysResource(client)
        self.authorizedKeys = self.authorized_keys

    def list(
        self,
        *,
        app: str,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[SshUser]:
        params = {"app": app, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.GET_APP_SSH_USERS_QUERY,
                {"id": page_params["app"], **page_variables(normalized)},
                request_options=request_options,
            )
            ssh_server = (
                (response.get("node") or {}).get("sshServer")
                if response
                else None
            )
            return connection_to_page_data(
                ssh_server.get("users") if ssh_server else None,
                SshUser.from_graphql,
            )

        return create_async_list(params, "/v1/apps/ssh/users", fetch_page)

    async def retrieve(
        self, id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> SshUser:
        response = await self._client._query(
            gql.GET_SSH_USER_BY_ID_QUERY,
            {"id": id},
            request_options=request_options,
        )
        node = response.get("node") if response else None
        if not node or node.get("__typename") != "SshUser":
            raise resource_missing_error("SSH user", id, "srcGetSshUserByIdQuery")
        return SshUser.from_graphql(node)

    async def retrieve_many(
        self, ids: List[str], *, request_options: Optional[RequestOptionsLike] = None
    ) -> List[Optional[SshUser]]:
        if not ids:
            return []
        response = await self._client._query(
            gql.GET_SSH_USERS_BY_IDS_QUERY,
            {"ids": ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[SshUser]] = []
        for index, _ in enumerate(ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                SshUser.from_graphql(node)
                if node and node.get("__typename") == "SshUser"
                else None
            )
        return result

    async def update(
        self,
        id: str,
        *,
        username: Optional[str] = None,
        sftp_root_folder: Optional[str] = None,
        authentication_methods: Optional[Sequence[SshAuthenticationMethod]] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> SshUser:
        response = await self._client._mutation(
            gql.EDIT_SSH_USER_MUTATION,
            {
                "input": {
                    "id": id,
                    "username": username,
                    "sftpRootFolder": sftp_root_folder,
                    "authenticationMethods": authentication_methods,
                }
            },
            request_options=request_options,
        )
        data = required_payload(
            (response.get("editSshUser") or {}).get("sshUser") if response else None,
            "Failed to update SSH user.",
            "srcEditSshUserMutation",
        )
        return SshUser.from_graphql(data)

    retrieveMany = retrieve_many


class AppsSshTokensResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def create(
        self, *, app: str, request_options: Optional[RequestOptionsLike] = None
    ) -> SshTokenCreateResult:
        response = self._client._mutation(
            gql.GENERATE_SSH_TOKEN_MUTATION,
            {"input": {"appId": app}},
            request_options=request_options,
        )
        token = (response.get("generateSshToken") or {}).get("token")
        if not token:
            raise StackMachineAPIError(
                "Failed to generate SSH token.",
                operation_name="srcGenerateSshTokenMutation",
            )
        return {"token": token}


class AsyncAppsSshTokensResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def create(
        self, *, app: str, request_options: Optional[RequestOptionsLike] = None
    ) -> SshTokenCreateResult:
        response = await self._client._mutation(
            gql.GENERATE_SSH_TOKEN_MUTATION,
            {"input": {"appId": app}},
            request_options=request_options,
        )
        token = (response.get("generateSshToken") or {}).get("token")
        if not token:
            raise StackMachineAPIError(
                "Failed to generate SSH token.",
                operation_name="srcGenerateSshTokenMutation",
            )
        return {"token": token}


class AppsSshResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.tokens = AppsSshTokensResource(client)
        self.users = AppsSshUsersResource(client)

    def retrieve(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> AppSshServer:
        response = self._client._query(
            gql.GET_APP_SSH_SERVER_QUERY,
            {"id": app_id},
            request_options=request_options,
        )
        ssh_server = (
            (response.get("node") or {}).get("sshServer") if response else None
        )
        if not ssh_server:
            raise resource_missing_error(
                "SSH server", app_id, "srcGetAppSshServerQuery", "app"
            )
        return AppSshServer.from_graphql(ssh_server)

    def retrieve_many(
        self,
        app_ids: list[str],
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[Optional[AppSshServer]]:
        if not app_ids:
            return []
        response = self._client._query(
            gql.GET_APP_SSH_SERVERS_QUERY,
            {"ids": app_ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[AppSshServer]] = []
        for index, _ in enumerate(app_ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                AppSshServer.from_graphql(node["sshServer"])
                if (
                    node
                    and node.get("__typename") == "DeployApp"
                    and node.get("sshServer")
                )
                else None
            )
        return result

    def update(
        self,
        app_id: str,
        *,
        enabled: bool,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppSshServer:
        response = self._client._mutation(
            gql.TOGGLE_SSH_SERVER_MUTATION,
            {"input": {"appId": app_id, "enabled": enabled}},
            request_options=request_options,
        )
        data = required_payload(
            (response.get("toggleSshServer") or {}).get("sshServer")
            if response
            else None,
            "Failed to update SSH server.",
            "srcToggleSshServerMutation",
        )
        return AppSshServer.from_graphql(data)

    retrieveMany = retrieve_many


class AsyncAppsSshResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.tokens = AsyncAppsSshTokensResource(client)
        self.users = AsyncAppsSshUsersResource(client)

    async def retrieve(
        self, app_id: str, *, request_options: Optional[RequestOptionsLike] = None
    ) -> AppSshServer:
        response = await self._client._query(
            gql.GET_APP_SSH_SERVER_QUERY,
            {"id": app_id},
            request_options=request_options,
        )
        ssh_server = (
            (response.get("node") or {}).get("sshServer") if response else None
        )
        if not ssh_server:
            raise resource_missing_error(
                "SSH server", app_id, "srcGetAppSshServerQuery", "app"
            )
        return AppSshServer.from_graphql(ssh_server)

    async def retrieve_many(
        self,
        app_ids: list[str],
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[Optional[AppSshServer]]:
        if not app_ids:
            return []
        response = await self._client._query(
            gql.GET_APP_SSH_SERVERS_QUERY,
            {"ids": app_ids},
            request_options=request_options,
        )
        nodes = response.get("nodes") or []
        result: list[Optional[AppSshServer]] = []
        for index, _ in enumerate(app_ids):
            node = nodes[index] if index < len(nodes) else None
            result.append(
                AppSshServer.from_graphql(node["sshServer"])
                if (
                    node
                    and node.get("__typename") == "DeployApp"
                    and node.get("sshServer")
                )
                else None
            )
        return result

    async def update(
        self,
        app_id: str,
        *,
        enabled: bool,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> AppSshServer:
        response = await self._client._mutation(
            gql.TOGGLE_SSH_SERVER_MUTATION,
            {"input": {"appId": app_id, "enabled": enabled}},
            request_options=request_options,
        )
        data = required_payload(
            (response.get("toggleSshServer") or {}).get("sshServer")
            if response
            else None,
            "Failed to update SSH server.",
            "srcToggleSshServerMutation",
        )
        return AppSshServer.from_graphql(data)

    retrieveMany = retrieve_many
