# StackMachine Python SDK

Python SDK for StackMachine. It mirrors the JavaScript SDK surface with a
Pythonic sync client and a native async client.

## Installation

```bash
uv add stackmachine
```

## Usage

```python
from stackmachine import StackMachine

with StackMachine("sk_stackmachine_...") as stackmachine:
    app = stackmachine.apps.retrieve_by_name("my-app")
    print(app.url)
```

```python
from stackmachine import AsyncStackMachine

async with AsyncStackMachine("sk_stackmachine_...") as stackmachine:
    app = await stackmachine.apps.retrieve_by_name("my-app")
    print(app.url)
```

## Clients

`StackMachine` exposes sync methods. `AsyncStackMachine` exposes the same
resource tree with awaitable methods.

```python
from stackmachine import AsyncStackMachine, StackMachine

stackmachine = StackMachine("sk_stackmachine_...")
async_stackmachine = AsyncStackMachine("sk_stackmachine_...")
```

Both clients accept JavaScript-style aliases during initialization:

```python
stackmachine = StackMachine.init(
    {
        "token": "sk_stackmachine_...",
        "apiUrl": "https://api.stackmachine.com/graphql",
        "maxNetworkRetries": 2,
    }
)
```

## Apps

```python
apps = stackmachine.apps.list(limit=10)

for app in apps:
    print(app.id, app.name)

app = stackmachine.apps.retrieve("app_id")
app = stackmachine.apps.retrieve_by_name("my-app")
apps = stackmachine.apps.retrieve_many(["app_1", "app_2"])
stackmachine.apps.delete("app_id")
```

Async lists can either be awaited for the first page or iterated directly:

```python
apps = async_stackmachine.apps.list(limit=10)
first_page = await apps

async for app in apps:
    print(app.name)
```

## Deployments

```python
deployment = stackmachine.deployments.create(
    {
        "file": "https://example.com/app.zip",
        "name": "my-app",
    }
)

version = deployment.wait()
```

```python
deployment = stackmachine.apps.autobuild(
    {
        "file": "https://example.com/app.zip",
        "name": "my-app",
    }
)
```

## Files

```python
from stackmachine import create_zip

zip_bytes = create_zip({"index.html": "<h1>Hello</h1>"})
url = stackmachine.files.upload(zip_bytes)
```

## Domains

```python
domain = stackmachine.apps.domains.create(
    app="app_id",
    hostname="example.com",
)

is_verified = stackmachine.apps.domains.verify(domain.id)
stackmachine.apps.domains.delete(domain.id)
```

## SSH

```python
server = stackmachine.apps.ssh.retrieve("app_id")
server = stackmachine.apps.ssh.update("app_id", enabled=True)
token = stackmachine.apps.ssh.tokens.create(app="app_id")

users = stackmachine.apps.ssh.users.list(app="app_id")
user = stackmachine.apps.ssh.users.retrieve("ssh_user_id")
password = stackmachine.apps.ssh.users.passwords.rotate("ssh_user_id")

key = stackmachine.apps.ssh.users.authorized_keys.create(
    user="ssh_user_id",
    public_key="ssh-ed25519 AAAA...",
)
```

## Request Options

Most methods accept `request_options` for per-request configuration:

```python
app = stackmachine.apps.retrieve(
    "app_id",
    request_options={
        "api_key": "sk_stackmachine_other",
        "timeout": 30,
        "idempotency_key": "deploy-123",
    },
)
```

## Development

```bash
cd python
uv sync --dev
uv run ruff check src examples tests
uv run pytest
uv build --no-sources
```

## Manual Publish

Use this path only for manual package uploads:

```bash
cd python
uv sync --dev
uv build --no-sources
uv publish
```
