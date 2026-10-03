# StackMachine Rust SDK

Async Rust SDK for StackMachine, named `stackmachine`. Requires Rust 1.88 or
later and a Tokio runtime.

## Installation

Use the crate directly from this checkout until it is published to crates.io:

```toml
[dependencies]
stackmachine = { path = "path/to/sdks/rust" }
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
```

## Usage

```rust,no_run
use stackmachine::{StackMachine, resources::AppsListParams};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = StackMachine::new(std::env::var("STACKMACHINE_API_KEY")?)?;
    let viewer = client.viewer().await?;
    println!("Signed in as {}", viewer.username);

    let apps = client.apps().list(AppsListParams::default()).await?;
    for app in apps.data {
        println!("{}: {}", app.name, app.url);
    }

    let app = client.apps().retrieve_by_name("my-app", None).await?;
    println!("{}", app.url);
    Ok(())
}
```

The client is cheaply cloneable and shares its HTTP connection pool. All
network methods are asynchronous. Dropping a request future cancels it.

## Configuration

```rust,no_run
use stackmachine::{StackMachine, RequestOptions};
use std::time::Duration;

# fn example() -> stackmachine::Result<()> {
let client = StackMachine::builder("sk_stackmachine_...")
    .api_url("https://api.stackmachine.com/graphql")
    .timeout(Duration::from_secs(80))
    .max_network_retries(1)
    .build()?;

let scoped = client.with_options(RequestOptions {
    timeout: Some(Duration::from_secs(10)),
    max_network_retries: Some(0),
    idempotency_key: Some("unique-operation-id".into()),
    ..Default::default()
});
# Ok(())
# }
```

`ClientBuilder::headers` sets additional headers; `http_client` accepts a custom
`reqwest::Client`. `RequestOptions` overrides headers, API key, timeout and
retry count for a client clone and its resources. API credentials are sent as
`Authorization: Bearer <key>` and override custom authorization headers.

Defaults match the existing SDKs: the GraphQL URL above, an 80-second request
timeout, and one retry. Read queries retry transient connection failures and
HTTP 408, 409, 425, 429, 500, 502, 503 and 504, with exponential backoff. Numeric
`Retry-After` headers are honored up to 60 seconds. Mutations are sent once to
avoid repeating side effects. An idempotency key is passed to
`input.clientMutationId`; a conflicting explicit mutation ID is rejected.

## Pagination

```rust,no_run
use stackmachine::{StackMachine, Pagination, resources::AppsListParams};

# async fn example(client: &StackMachine) -> stackmachine::Result<()> {
let page = client.apps().list(AppsListParams {
    pagination: Pagination::new(10),
    ..Default::default()
}).await?;

println!("Total: {:?}", page.total_count);
if let Some(next) = page.next_page().await? {
    println!("Next page: {} apps", next.data.len());
}

// Starts with this page and fetches more pages until 100 items or exhaustion.
let apps = page.collect(100).await?;
# Ok(())
# }
```

`Pagination` supports forward cursors and page sizes from 1 to 100 (default 25).
Each page retains filters and request options. Missing or repeated pagination
cursors produce errors instead of an infinite loop. `collect` requires an
explicit item limit.

## Resources

| Resource | Methods |
| --- | --- |
| `client.apps()` | `list`, `retrieve`, `retrieve_many`, `retrieve_by_name`, `delete` |
| `client.apps().domains()` | `list`, `retrieve`, `retrieve_many`, `create`, `verify`, `delete` |
| `client.apps().volumes()` | `list`, `create`, `update`, `delete` |
| `client.apps().databases()` | `list`, `create`, `create_and_link`, `rotate_credentials`, `delete` |
| `client.apps().cache()` | `retrieve`, `update`, `purge` |
| `client.apps().cronjobs()` | `list`, `retrieve`, `retrieve_many`, `create`, `update`, `delete` |
| `client.apps().git()` | `retrieve`, `connect`, `update`, `delete` |
| `client.apps().versions()` | `list` |
| `client.apps().logs()` | `list` (takes an app **version** ID) |
| `client.apps().ssh()` | `retrieve`, `update`, `generate_token`, `users` |
| `client.apps().ssh().users()` | `list`, `retrieve`, `retrieve_many`, `update`, `reveal_password`, `rotate_password`, `authorized_keys` |
| `client.apps().ssh().users().authorized_keys()` | `list`, `create`, `delete` |
| `client.dns().domains()` | `list`, `retrieve`, `retrieve_many`, `retrieve_by_name`, `create`, `import_zone_file`, `delete` |
| `client.dns().records()` | `list`, `retrieve`, `create`, `update`, `update_many`, `delete` |
| `client.emails()` | `sent`, `received`, `send` (text or HTML) |
| `client.packages()` | `search` |
| `client.usage()` | `metrics` for a viewer, app or owner |
| `client.files()` | `upload`, `upload_with_options` |
| `client.deployments()` | `create`, `create_from_files`, `retrieve`, `wait` |

Mutation arguments use the schema-derived structs in `stackmachine::inputs`.
Fields use snake_case in Rust and serialize to the backend's exact GraphQL
names. Optional fields set to `None` are omitted, preserving backend defaults.
Use `graphql` with a JSON input when an update must explicitly clear a nullable
field with `null`.

```rust,no_run
use stackmachine::{StackMachine, inputs::CreateAppVolumeInput};

# async fn example(client: &StackMachine) -> stackmachine::Result<()> {
let volume = client.apps().volumes().create(&CreateAppVolumeInput {
    app_id: "app_id".into(),
    mount_path: "/data".into(),
    max_size_bytes: Some(1_073_741_824),
    ..Default::default()
}).await?;
println!("{}", volume.mount_path);
# Ok(())
# }
```

`retrieve_many` returns aligned `Vec<Option<T>>` values, preserving missing IDs
and wrong node types. DNS records expose common typed fields plus a `fields`
map for record-specific values. BigInt response fields accept numeric JSON and
decimal strings without losing integer precision.

Cron jobs require exactly one of `execute` or `fetch` when creating a job.
Execute inputs carry `command` and `cli_args` separately, as defined by the
GraphQL API; the SDK does not parse shell command strings.
`CronJobsListParams` accepts a `CronJobFilter`, `order_by` and `direction` for
listing jobs. The default order is newest first (`ID`, descending).

## Deployments and files

```rust,no_run
use stackmachine::{StackMachine, WaitOptions, inputs::DeployViaAutobuildInput};

# async fn example(client: &StackMachine) -> stackmachine::Result<()> {
let deployment = client.deployments().create_from_files(
    &DeployViaAutobuildInput {
        app_name: Some("hello-stackmachine".into()),
        owner: Some("my-workspace".into()),
        ..Default::default()
    },
    [("index.html", "<h1>Hello StackMachine</h1>")],
).await?;

let version = client.deployments()
    .wait(&deployment.build_id, WaitOptions::default())
    .await?;
println!("{}", version.app.url);
# Ok(())
# }
```

`create_zip` creates an in-memory ZIP from `(path, bytes)` or `(path, text)`
pairs. It rejects absolute paths, traversal, and duplicate entries. File uploads
use the backend's signed URL and resumable upload protocol, in 1 MiB chunks by
default. `upload_with_options` accepts a chunk size and progress callback.
Storage requests use a separate HTTP client and do not receive API credentials
or custom API headers.

Deployment waiting polls the HTTP status endpoint every second, with a
10-minute overall timeout by default. `WaitOptions` configures both durations;
the timeout includes in-flight requests. Failed, cancelled, internal-error and
timed-out builds return errors. Successful builds must include an app version.
This initial SDK does not implement WebSocket build-progress subscriptions or
multipart MIME email uploads.

## Errors and custom GraphQL

```rust,no_run
use stackmachine::{StackMachine, ErrorKind};

# async fn example(client: &StackMachine) -> stackmachine::Result<()> {
if let Err(error) = client.apps().retrieve("missing_id").await {
    if let Some(api) = error.api_error() {
        if api.kind == ErrorKind::NotFound {
            println!("App was not found");
        }
        println!("Request ID: {:?}", api.request_id);
    }
}
# Ok(())
# }
```

`Error::Api` includes a kind, message, HTTP status, request ID, operation name,
backend error code and GraphQL errors. Partial GraphQL data is preserved on the
error. Connection errors expose `is_timeout()`. Validation, malformed-response,
ZIP, JSON and deployment errors have distinct variants.

`StackMachine::graphql<T>` accepts any serializable variable object and
deserializes the response's `data` object into `T`. The checked-in operations
are available in `stackmachine::operations`. To pass JSON variables, add
`serde_json = "1"` to your application's dependencies.

## Development

```bash
cd rust
cargo fmt --all -- --check
cargo clippy --locked --all-targets -- -D warnings
cargo test --locked --all-targets
cargo test --locked --doc
cargo package --locked
```

Integration tests use local mock servers and require no credentials. Response
fixtures also test model types and nullable fields against the GraphQL schema.

To regenerate inputs, operation constants and response fixtures after updating
the checked-in GraphQL operations or schema, first install the JavaScript SDK's
development dependencies (`npm ci` in `js/`), then run from the repository root:

```bash
node rust/tools/generate.mjs
node rust/tools/generate.mjs --check
```

The generator validates all Rust GraphQL operations against `js/schema.graphql`.
CI checks generation, formatting, Clippy, tests and packaging.

## Releases

[Release Please](https://github.com/googleapis/release-please) tracks this crate
as the `stackmachine-rust` component, starting at `0.1.0`. Use conventional
commit messages such as `feat(rust): ...` and `fix(rust): ...`. Merging its release
PR updates `Cargo.toml`, the crate's entry in `Cargo.lock`, `CHANGELOG.md` and the
release manifest, then creates a `stackmachine-rust-v<version>` GitHub release.
The Release workflow validates and publishes that release's commit to crates.io.

Publishing uses the `crates-io` GitHub environment. Complete this one-time setup
before the first release:

1. Add a crates.io API token with permission to create/publish `stackmachine`
   as the environment secret `CARGO_REGISTRY_TOKEN`. crates.io requires an API
   token for a crate's first publication.
2. After the first publication, configure a
   [crates.io trusted publisher](https://crates.io/docs/trusted-publishing) for
   repository owner `stackmachine`, repository `sdks`, workflow filename
   `release.yml`, and environment `crates-io`.
3. Remove and revoke the bootstrap API token. Subsequent publications use a
   short-lived OIDC token through `rust-lang/crates-io-auth-action` automatically.

An existing `CARGO_REGISTRY_TOKEN` takes precedence over trusted publishing.
If publishing fails after a GitHub release was created, run the Release workflow
on `main` with **publish_existing_rust_version** enabled to retry the version
already in `Cargo.toml`. The default manual run does not publish Rust.
