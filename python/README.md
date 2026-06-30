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

Both clients accept configuration options during initialization:

```python
stackmachine = StackMachine(
    "sk_stackmachine_...",
    apiUrl="https://api.stackmachine.com/graphql",
    maxNetworkRetries=2,
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
    app_name="hello-stackmachine",
    owner="stackmachine",
    files={
        "index.html": "<html><body><h1>Hello StackMachine</h1></body></html>",
    },
    on_upload_progress=lambda progress: print("Uploading", progress.percent * 100),
)

version = deployment.wait()
```

```python
deployment = stackmachine.apps.autobuild(
    app_name="hello-stackmachine",
    owner="stackmachine",
    files={
        "index.html": "<html><body><h1>Hello StackMachine</h1></body></html>",
    },
)
```

## Files

Use this path only for manual package uploads:

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

## Volumes

```python
volume = stackmachine.apps.volumes.create(
    app="app_id",
    mount_path="/data",
    max_size_bytes=1_073_741_824,
)

volumes = stackmachine.apps.volumes.list(app="app_id", limit=25)
updated = stackmachine.apps.volumes.update(
    volume.id,
    mount_path="/uploads",
    s3_enabled=True,
)
stackmachine.apps.volumes.delete(updated.id)
```

## Git Connections

```python
connection = stackmachine.apps.git.connect(
    app="app_id",
    installation_repo_id="github_installation_repo_id",
    deploy_branch="main",
)

connection = stackmachine.apps.git.retrieve("app_id")
updated = stackmachine.apps.git.update(
    "app_id",
    deploy_branch="main",
    deployment_status_events=True,
    pull_request_comments=True,
)
stackmachine.apps.git.delete("app_id")
```

## Databases

```python
result = stackmachine.apps.databases.create(
    app="app_id",
    db_engine="POSTGRES",
    name="primary",
)

database = result.database
password = result.password

databases = stackmachine.apps.databases.list(app="app_id", limit=25)
rotated = stackmachine.apps.databases.rotate_credentials(database.id)
stackmachine.apps.databases.delete(database.id)
```

## Hosted DNS

Hosted DNS is exposed at `stackmachine.dns`. App domains remain under
`stackmachine.apps.domains`.

```python
domain = stackmachine.dns.domains.create(
    name="example.com",
    owner="owner_id",
    import_records=True,
)

domains = stackmachine.dns.domains.list(owner="owner_id", limit=25)
domain = stackmachine.dns.domains.retrieve_by_name("example.com")

record = stackmachine.dns.records.create(
    domain=domain.id,
    kind="A",
    name="@",
    value="192.0.2.1",
    ttl=300,
)

record = stackmachine.dns.records.update(
    record.id,
    domain=domain.id,
    kind="A",
    name="@",
    value="192.0.2.2",
    ttl=300,
)

stackmachine.dns.records.delete(record.id)
stackmachine.dns.domains.delete(domain.id)
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

## Emails

```python
app_sent = stackmachine.emails.sent.list(app="app_id", limit=25)
owner_received = stackmachine.emails.received.list(owner="owner_id", limit=25)

sent_from_app = (
    stackmachine.apps.retrieve(app_sent.data[0].app_id)
    if app_sent.data and app_sent.data[0].app_id
    else None
)

message = stackmachine.emails.send(
    app="app_id",
    to=["user@example.com"],
    subject="Hello from StackMachine",
    text_body="Plain text body",
    html_body="<p>HTML body</p>",
)

raw_message = stackmachine.emails.send(
    app="app_id",
    to=["user@example.com"],
    subject="Raw MIME from StackMachine",
    raw_message=(
        b"From: app@example.com\r\n"
        b"To: user@example.com\r\n"
        b"Subject: Raw MIME from StackMachine\r\n\r\n"
        b"Plain text body"
    ),
)
```

## Request Options

Most methods accept `request_options` for per-request configuration:

```python
from stackmachine import RequestOptions

app = stackmachine.apps.retrieve(
    "app_id",
    request_options=RequestOptions(
        api_key="sk_stackmachine_other",
        timeout=30,
        idempotency_key="deploy-123",
    ),
)
```

## Development

```bash
cd python
uv sync --dev
uv run ruff check src examples tests
uv run mypy
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
