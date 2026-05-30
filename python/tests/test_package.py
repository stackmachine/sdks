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
    StackMachineAuthenticationError,
    StackMachineGraphQLError,
    StackMachineValidationError,
    create_zip,
)
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


def graphql_response(data: dict[str, Any], status_code: int = 200) -> httpx.Response:
    return httpx.Response(status_code, json={"data": data})


def test_version_matches_package_metadata() -> None:
    assert stackmachine.__version__ == version("stackmachine")


def test_exports_clients_and_models() -> None:
    assert stackmachine.StackMachine is StackMachine
    assert stackmachine.AsyncStackMachine is AsyncStackMachine
    assert "StackMachine" in stackmachine.__all__
    assert "AsyncStackMachine" in stackmachine.__all__


def test_exports_public_input_types() -> None:
    assert "DeployAppAutobuildInput" in stackmachine.__all__
    assert "RequestOptionsInput" in stackmachine.__all__
    assert "FileInput" in stackmachine.__all__
    assert stackmachine.DeployAppAutobuildInput.__name__ == "DeployAppAutobuildInput"
    assert stackmachine.RequestOptionsInput.__name__ == "RequestOptionsInput"


def test_file_upload_signature_uses_public_types() -> None:
    hints = get_type_hints(FilesResource.upload)

    assert hints["file"] == stackmachine.FileInput
    assert hints["on_progress"] == Optional[stackmachine.UploadProgressCallback]
    assert hints["request_options"] == Optional[stackmachine.RequestOptionsLike]


def test_client_init_accepts_js_style_aliases() -> None:
    client = StackMachine.init(
        {"token": "token-1", "apiUrl": "https://api.example/graphql"},
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
