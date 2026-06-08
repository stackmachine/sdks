from __future__ import annotations

import json
import zipfile
from importlib.metadata import version
from io import BytesIO
from typing import Any, Optional, get_type_hints

import httpx
import pytest

import stackmachine
from stackmachine import (
    AsyncStackMachine,
    StackMachine,
    StackMachineAPIError,
    StackMachineAuthenticationError,
    StackMachineGraphQLError,
    StackMachineValidationError,
    create_zip,
)
from stackmachine.resources.deployments import DeploymentsResource
from stackmachine.resources.files import FilesResource


def app_payload(id: str = "app_1") -> dict[str, Any]:
    return {
        "id": id,
        "willPerishAt": None,
        "name": f"app-{id}",
        "url": f"https://{id}.stackmachine.dev",
        "adminUrl": f"https://{id}.stackmachine.dev/admin",
        "activeVersion": None,
        "favicon": None,
        "screenshot": None,
    }


def volume_payload(id: str = "volume_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "id": id,
        "volumeId": f"volume-{id}",
        "mountPath": "/data",
        "maxSizeBytes": 1_073_741_824,
        "s3Enabled": False,
        "s3Url": None,
        "explorerUrl": f"https://console.example.test/volumes/{id}",
        "isAddedByUi": True,
    }
    payload.update(overrides)
    return payload


def graphql_response(data: dict[str, Any], status_code: int = 200) -> httpx.Response:
    return httpx.Response(status_code, json={"data": data})


def test_version_matches_package_metadata() -> None:
    assert stackmachine.__version__ == version("stackmachine")


def test_exports_clients_and_models() -> None:
    assert stackmachine.StackMachine is StackMachine
    assert stackmachine.AsyncStackMachine is AsyncStackMachine
    assert stackmachine.AppVolume.__name__ == "AppVolume"
    assert "StackMachine" in stackmachine.__all__
    assert "AsyncStackMachine" in stackmachine.__all__
    assert "AppVolume" in stackmachine.__all__


def test_exports_public_input_types() -> None:
    assert "DeployAppAutobuildInput" in stackmachine.__all__
    assert "DeploymentFilesInput" in stackmachine.__all__
    assert "AppsVolumesCreateInput" in stackmachine.__all__
    assert "AppsVolumesListInput" in stackmachine.__all__
    assert "AppsVolumesUpdateInput" in stackmachine.__all__
    assert "RequestOptionsInput" in stackmachine.__all__
    assert "FileInput" in stackmachine.__all__
    assert stackmachine.DeployAppAutobuildInput.__name__ == "DeployAppAutobuildInput"
    assert stackmachine.AppsVolumesCreateInput.__name__ == "AppsVolumesCreateInput"
    assert stackmachine.DeploymentFilesInput == stackmachine.CreateZipFiles
    assert stackmachine.RequestOptionsInput.__name__ == "RequestOptionsInput"


def test_file_upload_signature_uses_public_types() -> None:
    hints = get_type_hints(FilesResource.upload)

    assert hints["file"] == stackmachine.FileInput
    assert hints["on_progress"] == Optional[stackmachine.UploadProgressCallback]
    assert hints["request_options"] == Optional[stackmachine.RequestOptionsLike]


def test_deployment_create_signature_uses_upload_progress_type() -> None:
    hints = get_type_hints(DeploymentsResource.create)

    assert hints["on_upload_progress"] == Optional[stackmachine.UploadProgressCallback]


def test_client_constructor_accepts_configuration_aliases() -> None:
    client = StackMachine(
        "token-1",
        apiUrl="https://api.example/graphql",
        maxNetworkRetries=3,
        http_transport=httpx.MockTransport(lambda _: graphql_response({})),
    )
    try:
        assert client.api_key == "token-1"
        assert client.api_url == "https://api.example/graphql"
        assert client.apiUrl == "https://api.example/graphql"
        assert client.max_network_retries == 3
        assert client.maxNetworkRetries == 3
    finally:
        client.close()


def test_client_init_accepts_mapping_settings() -> None:
    client = StackMachine.init(
        {"token": "token-1", "apiUrl": "https://api.example/graphql"},
        maxNetworkRetries=3,
        http_transport=httpx.MockTransport(lambda _: graphql_response({})),
    )
    try:
        assert client.api_key == "token-1"
        assert client.api_url == "https://api.example/graphql"
        assert client.max_network_retries == 3
    finally:
        client.close()


def test_sync_viewer_sends_auth_header_and_returns_model() -> None:
    seen: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["authorization"] = request.headers["authorization"]
        seen["body"] = json.loads(request.content)
        return graphql_response({"viewer": {"username": "syrus"}})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        viewer = client.viewer()

    assert viewer is not None
    assert viewer.username == "syrus"
    assert seen["authorization"] == "Bearer secret"
    assert seen["body"]["operationName"] == "srcViewerQuery"


def test_request_options_override_auth_and_mutation_id() -> None:
    seen: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["authorization"] = request.headers["authorization"]
        seen["body"] = json.loads(request.content)
        return graphql_response(
            {"deployViaAutobuild": {"success": True, "buildId": "build-1"}}
        )

    with StackMachine("default", http_transport=httpx.MockTransport(handler)) as client:
        deployment = client.deployments.create(
            {"upload_url": "zip://example"},
            request_options={
                "api_key": "override",
                "idempotency_key": "mutation-1",
            },
        )

    assert deployment.build_id == "build-1"
    assert seen["authorization"] == "Bearer override"
    assert seen["body"]["variables"]["input"]["uploadUrl"] == "zip://example"
    assert seen["body"]["variables"]["input"]["clientMutationId"] == "mutation-1"


def test_deployments_create_accepts_files_and_upload_progress() -> None:
    seen: dict[str, Any] = {}
    upload_progress: list[stackmachine.UploadProgress] = []

    def on_upload_progress(progress: stackmachine.UploadProgress) -> None:
        upload_progress.append(progress)

    def handler(request: httpx.Request) -> httpx.Response:
        if str(request.url) == "https://storage.example.test/app.zip":
            assert request.method == "POST"
            return httpx.Response(
                200, headers={"Location": "https://storage.example.test/session"}
            )
        if str(request.url) == "https://storage.example.test/session":
            assert request.method == "PUT"
            seen["archive"] = request.content
            return httpx.Response(200)

        body = json.loads(request.content)
        if body["operationName"] == "uploadQuery":
            return graphql_response(
                {"getSignedUrl": {"url": "https://storage.example.test/app.zip"}}
            )
        if body["operationName"] == "srcAutobuildMutation":
            seen["mutation"] = body
            return graphql_response(
                {"deployViaAutobuild": {"success": True, "buildId": "build-files"}}
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        deployment = client.deployments.create(
            app_name="hello-stackmachine",
            owner="tester",
            files={"index.html": "<html><body><h1>Hello</h1></body></html>"},
            chunk_size=10_000_000,
            on_upload_progress=on_upload_progress,
        )

    assert deployment.build_id == "build-files"
    assert seen["mutation"]["variables"]["input"] == {
        "appName": "hello-stackmachine",
        "owner": "tester",
        "uploadUrl": "https://storage.example.test/app.zip",
    }
    assert "files" not in seen["mutation"]["variables"]["input"]
    assert upload_progress[0].loaded == 0
    assert upload_progress[-1].percent == 1
    with zipfile.ZipFile(BytesIO(seen["archive"])) as archive:
        assert archive.read("index.html") == b"<html><body><h1>Hello</h1></body></html>"


async def test_async_deployments_create_accepts_files() -> None:
    seen: dict[str, Any] = {}

    async def handler(request: httpx.Request) -> httpx.Response:
        if str(request.url) == "https://storage.example.test/app.zip":
            return httpx.Response(
                200, headers={"Location": "https://storage.example.test/session"}
            )
        if str(request.url) == "https://storage.example.test/session":
            return httpx.Response(200)

        body = json.loads(request.content)
        if body["operationName"] == "uploadQuery":
            return graphql_response(
                {"getSignedUrl": {"url": "https://storage.example.test/app.zip"}}
            )
        if body["operationName"] == "srcAutobuildMutation":
            seen["mutation"] = body
            return graphql_response(
                {
                    "deployViaAutobuild": {
                        "success": True,
                        "buildId": "build-files-async",
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        deployment = await client.deployments.create(
            app_name="hello-stackmachine",
            owner="tester",
            files={"index.html": "<h1>Hello</h1>"},
            chunk_size=10_000_000,
        )
    finally:
        await client.close()

    assert deployment.build_id == "build-files-async"
    assert seen["mutation"]["variables"]["input"] == {
        "appName": "hello-stackmachine",
        "owner": "tester",
        "uploadUrl": "https://storage.example.test/app.zip",
    }


def test_deployments_create_rejects_files_with_upload_url() -> None:
    calls = 0

    def handler(_: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        return graphql_response({})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineValidationError) as exc_info:
            client.deployments.create(
                app_name="ambiguous",
                owner="tester",
                upload_url="https://storage.example.test/app.zip",
                files={"index.html": "<h1>Hello</h1>"},
            )

    assert exc_info.value.code == "invalid_deployment_source"
    assert exc_info.value.param == "files"
    assert calls == 0


def test_graphql_errors_are_mapped() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "errors": [
                    {
                        "message": "No access",
                        "extensions": {"code": "FORBIDDEN", "param": "app"},
                    }
                ]
            },
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineGraphQLError) as exc_info:
            client.viewer()

    assert str(exc_info.value) == "No access"
    assert exc_info.value.code == "FORBIDDEN"
    assert exc_info.value.param == "app"


def test_http_errors_are_mapped() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            401,
            json={"error": {"message": "Bad token", "code": "bad_token"}},
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineAuthenticationError) as exc_info:
            client.viewer()

    assert str(exc_info.value) == "Bad token"
    assert exc_info.value.code == "bad_token"
    assert exc_info.value.status_code == 401


def test_sync_list_auto_paginates() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        variables = body["variables"]
        calls.append(variables)
        if variables.get("after") is None:
            return graphql_response(
                {
                    "viewer": {
                        "apps": {
                            "edges": [{"node": app_payload("app_1")}],
                            "pageInfo": {
                                "hasNextPage": True,
                                "hasPreviousPage": False,
                                "endCursor": "cursor-1",
                                "startCursor": "cursor-0",
                            },
                            "totalCount": 2,
                        }
                    }
                }
            )
        return graphql_response(
            {
                "viewer": {
                    "apps": {
                        "edges": [{"node": app_payload("app_2")}],
                        "pageInfo": {
                            "hasNextPage": False,
                            "hasPreviousPage": True,
                            "endCursor": "cursor-2",
                            "startCursor": "cursor-1",
                        },
                        "totalCount": 2,
                    }
                }
            }
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        apps = client.apps.list(limit=1)
        data = apps.auto_paging_to_array(limit=2)

    assert [app.id for app in data] == ["app_1", "app_2"]
    assert calls[0]["first"] == 1
    assert calls[1]["after"] == "cursor-1"


def test_sync_app_volumes_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        variables = body["variables"]
        if body["operationName"] == "srcListAppVolumesQuery":
            is_first_page = variables.get("after") is None
            volume_id = "volume_1" if is_first_page else "volume_2"
            return graphql_response(
                {
                    "node": {
                        "volumes": {
                            "edges": [{"node": volume_payload(volume_id)}],
                            "pageInfo": {
                                "hasNextPage": is_first_page,
                                "hasPreviousPage": not is_first_page,
                                "endCursor": "cursor-1"
                                if is_first_page
                                else "cursor-2",
                                "startCursor": "cursor-1"
                                if is_first_page
                                else "cursor-2",
                            },
                            "totalCount": 2,
                        }
                    }
                }
            )
        if body["operationName"] == "srcCreateAppVolumeMutation":
            return graphql_response(
                {
                    "createAppVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_created",
                            mountPath="/uploads",
                            maxSizeBytes=2_147_483_648,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcUpdateVolumeMutation":
            return graphql_response(
                {
                    "updateVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_created",
                            mountPath="/uploads-v2",
                            s3Enabled=True,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcDeleteAppVolumeMutation":
            return graphql_response({"deleteAppVolume": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        volumes = client.apps.volumes.list(
            app="app_1",
            limit=1,
            request_options={"api_key": "override"},
        ).auto_paging_to_array(limit=2)
        created = client.apps.volumes.create(
            app="app_1",
            mount_path="/uploads",
            max_size_bytes=2_147_483_648,
            request_options={"client_mutation_id": "cmid-create-volume"},
        )
        updated = client.apps.volumes.update(
            "volume_created",
            mount_path="/uploads-v2",
            s3_enabled=True,
            request_options={"idempotency_key": "idem-update-volume"},
        )
        client.apps.volumes.delete(
            "volume_created",
            request_options={"client_mutation_id": "cmid-delete-volume"},
        )

    assert [volume.id for volume in volumes] == ["volume_1", "volume_2"]
    assert isinstance(volumes[0], stackmachine.AppVolume)
    assert volumes[0].volume_id == "volume-volume_1"
    assert volumes[0].mount_path == "/data"
    assert volumes[0].max_size_bytes == 1_073_741_824
    assert volumes[0].s3_enabled is False
    assert volumes[0].s3_url is None
    assert volumes[0].explorer_url == "https://console.example.test/volumes/volume_1"
    assert volumes[0].is_added_by_ui is True
    assert created.id == "volume_created"
    assert created.mount_path == "/uploads"
    assert updated.mount_path == "/uploads-v2"
    assert updated.s3_enabled is True

    assert calls[0]["variables"]["appId"] == "app_1"
    assert calls[0]["variables"]["first"] == 1
    assert calls[1]["variables"]["after"] == "cursor-1"
    assert calls[0]["operationName"] == "srcListAppVolumesQuery"
    assert calls[2]["variables"]["input"] == {
        "appId": "app_1",
        "mountPath": "/uploads",
        "maxSizeBytes": 2_147_483_648,
        "clientMutationId": "cmid-create-volume",
    }
    assert calls[3]["variables"]["input"] == {
        "id": "volume_created",
        "mountPath": "/uploads-v2",
        "s3Enabled": True,
        "clientMutationId": "idem-update-volume",
    }
    assert calls[4]["variables"]["input"] == {
        "id": "volume_created",
        "clientMutationId": "cmid-delete-volume",
    }


def test_sync_app_volume_mutations_raise_on_unsuccessful_payloads() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        operation_name = json.loads(request.content)["operationName"]
        if operation_name == "srcCreateAppVolumeMutation":
            return graphql_response(
                {
                    "createAppVolume": {
                        "success": False,
                        "volume": volume_payload("volume_failed"),
                    }
                }
            )
        if operation_name == "srcUpdateVolumeMutation":
            return graphql_response(
                {
                    "updateVolume": {
                        "success": False,
                        "volume": volume_payload("volume_failed"),
                    }
                }
            )
        if operation_name == "srcDeleteAppVolumeMutation":
            return graphql_response({"deleteAppVolume": {"success": False}})
        raise AssertionError(f"Unexpected operation {operation_name}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineAPIError):
            client.apps.volumes.create(app="app_1", mount_path="/data")
        with pytest.raises(StackMachineAPIError):
            client.apps.volumes.update("volume_1", mount_path="/data")
        with pytest.raises(StackMachineAPIError):
            client.apps.volumes.delete("volume_1")


async def test_async_viewer_returns_model() -> None:
    async def handler(_: httpx.Request) -> httpx.Response:
        return graphql_response({"viewer": {"username": "async-user"}})

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        viewer = await client.viewer()
    finally:
        await client.close()

    assert viewer is not None
    assert viewer.username == "async-user"


async def test_async_list_request_can_be_awaited_and_iterated() -> None:
    async def handler(_: httpx.Request) -> httpx.Response:
        return graphql_response(
            {
                "viewer": {
                    "apps": {
                        "edges": [{"node": app_payload("app_1")}],
                        "pageInfo": {
                            "hasNextPage": False,
                            "hasPreviousPage": False,
                            "endCursor": "cursor-1",
                            "startCursor": "cursor-0",
                        },
                        "totalCount": 1,
                    }
                }
            }
        )

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        apps = client.apps.list(limit=1)
        page = await apps
        iterated = [app async for app in apps]
    finally:
        await client.close()

    assert page.data[0].id == "app_1"
    assert [app.id for app in iterated] == ["app_1"]


async def test_async_app_volumes_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    async def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcListAppVolumesQuery":
            return graphql_response(
                {
                    "node": {
                        "volumes": {
                            "edges": [{"node": volume_payload("volume_async")}],
                            "pageInfo": {
                                "hasNextPage": False,
                                "hasPreviousPage": False,
                                "endCursor": "cursor-async",
                                "startCursor": "cursor-async",
                            },
                            "totalCount": 1,
                        }
                    }
                }
            )
        if body["operationName"] == "srcCreateAppVolumeMutation":
            return graphql_response(
                {
                    "createAppVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_async_created",
                            mountPath="/async",
                        ),
                    }
                }
            )
        if body["operationName"] == "srcUpdateVolumeMutation":
            return graphql_response(
                {
                    "updateVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_async_created",
                            mountPath="/async-v2",
                            s3Enabled=True,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcDeleteAppVolumeMutation":
            return graphql_response({"deleteAppVolume": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        page = await client.apps.volumes.list(app="app_1", limit=1)
        created = await client.apps.volumes.create(
            app="app_1",
            mount_path="/async",
        )
        updated = await client.apps.volumes.update(
            "volume_async_created",
            mount_path="/async-v2",
            s3_enabled=True,
            request_options={"idempotency_key": "idem-async-volume"},
        )
        await client.apps.volumes.delete("volume_async_created")
    finally:
        await client.close()

    assert page.data[0].id == "volume_async"
    assert created.mount_path == "/async"
    assert updated.mount_path == "/async-v2"
    assert updated.s3_enabled is True
    assert calls[0]["variables"]["appId"] == "app_1"
    assert calls[1]["variables"]["input"] == {
        "appId": "app_1",
        "mountPath": "/async",
    }
    assert calls[2]["variables"]["input"] == {
        "id": "volume_async_created",
        "mountPath": "/async-v2",
        "s3Enabled": True,
        "clientMutationId": "idem-async-volume",
    }


def test_pagination_validation() -> None:
    transport = httpx.MockTransport(lambda _: graphql_response({}))
    with StackMachine("secret", http_transport=transport) as client:
        with pytest.raises(StackMachineValidationError):
            client.apps.list(limit=0)


def test_create_zip_supports_bytes_strings_and_file_paths(tmp_path) -> None:
    path = tmp_path / "file.txt"
    path.write_text("from disk")

    archive_bytes = create_zip(
        {
            "bytes.txt": b"raw",
            "string.txt": "inline",
            "file.txt": path,
        }
    )

    with zipfile.ZipFile(BytesIO(archive_bytes)) as archive:
        assert archive.read("bytes.txt") == b"raw"
        assert archive.read("string.txt") == b"inline"
        assert archive.read("file.txt") == b"from disk"
