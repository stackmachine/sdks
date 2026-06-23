# stackmachine

JavaScript SDK for deploying and managing apps on StackMachine.

## Functionality

- Deploy apps
- Fetch app information
- Fetch app logs
- Delete apps
- Manage app domains
- Manage app volumes
- ...

## Installation

```bash
npm install stackmachine
```

The examples in this repository use the `STACKMACHINE_API_KEY` environment variable:

```bash
export STACKMACHINE_API_KEY=your_api_key_here
```

## Basic Usage

Initialize the client:

```js
import StackMachine from "stackmachine";

const client = new StackMachine(process.env.STACKMACHINE_API_KEY);
```

Named imports and CommonJS are also supported:

```js
import { StackMachine } from "stackmachine";

const client = new StackMachine(process.env.STACKMACHINE_API_KEY);
```

```js
const StackMachine = require("stackmachine");

const client = StackMachine(process.env.STACKMACHINE_API_KEY);
```

`StackMachine.init({ apiKey, apiUrl })` is still supported for existing code. Pass constructor config such as `apiUrl`, `timeout`, or `maxNetworkRetries` only when you need to override the defaults.

Use the resource clients for app and file operations:

```js
const deployment = await client.deployments.create(
  {
    appName: "hello-stackmachine",
    owner: "stackmachine",
    files: {
      "index.html": "<html><body><h1>Hello StackMachine</h1></body></html>",
    },
  },
  {
    onUploadProgress: ({ percent }) => {
      console.log("Uploading", percent * 100, "%");
    },
  },
);
const appVersion = await deployment.wait({
  onProgress: ({ datetime, stream, kind, message }) => {
    console.log(datetime, stream, kind, message);
  },
});
const app = await client.apps.retrieve(appVersion.app.id);
```

For manual package uploads, use the lower-level file client:

```js
import StackMachine, { createZip } from "stackmachine";

const client = new StackMachine(process.env.STACKMACHINE_API_KEY);
const zip = await createZip({
  "index.html": "<html><body><h1>Hello StackMachine</h1></body></html>",
});
const uploadUrl = await client.files.upload(zip, {
  onProgress: ({ percent }) => {
    console.log("Uploading", percent * 100, "%");
  },
});
const deployment = await client.deployments.create({
  appName: "hello-stackmachine",
  owner: "stackmachine",
  uploadUrl,
});
```

Resources with `retrieve(...)` also expose `retrieveMany(...)`, preserving input order and returning `null` for missing IDs:

```js
const [firstApp, missingApp, secondApp] = await client.apps.retrieveMany([
  firstAppId,
  missingAppId,
  secondAppId,
]);
```

`client.apps.autobuild(...)` is still supported as a deprecated compatibility alias for `client.deployments.create(...)`; its returned deployment still supports the old `.finish()` and `.subscribeToProgress(...)` methods.

Resume an existing deployment by build ID:

```js
const deployment = await client.deployments.retrieve(buildId);
const appVersion = await deployment.wait();
```

List APIs return Stripe-style paginated list objects:

```js
const apps = await client.apps.list({ limit: 10 });
console.log(apps.data);

for await (const app of client.apps.list({ limit: 25 })) {
  console.log(app.name, app.url);
}

const domains = await client.apps.domains
  .list({ app: app.id, limit: 25 })
  .autoPagingToArray({ limit: 100 });
```

Manage app volumes:

```js
const volume = await client.apps.volumes.create({
  app: app.id,
  mountPath: "/data",
  maxSizeBytes: 1_073_741_824,
});

const volumes = await client.apps.volumes
  .list({ app: app.id, limit: 25 })
  .autoPagingToArray({ limit: 100 });

const updated = await client.apps.volumes.update(volume.id, {
  mountPath: "/uploads",
  s3Enabled: true,
});

await client.apps.volumes.del(updated.id);
```

Manage app databases:

```js
const { database, password } = await client.apps.databases.create({
  app: app.id,
  dbEngine: "POSTGRES",
  name: "primary",
});

const databases = await client.apps.databases
  .list({ app: app.id, limit: 25 })
  .autoPagingToArray({ limit: 100 });

const rotated = await client.apps.databases.rotateCredentials(database.id);
console.log(rotated.password);

await client.apps.databases.del(database.id);
```

Manage Git connections for an app:

```js
const connection = await client.apps.git.connect({
  app: app.id,
  installationRepoId: "github-installation-repo-id",
  deployBranch: "main",
});

const current = await client.apps.git.retrieve(app.id);

await client.apps.git.update(app.id, {
  deployBranch: "main",
  deploymentStatusEvents: true,
  pullRequestComments: true,
});

await client.apps.git.del(app.id);
```

Manage hosted DNS domains and records:

```js
const domain = await client.dns.domains.create({
  name: "example.com",
  owner: "owner-id",
  importRecords: true,
});

const domains = await client.dns.domains
  .list({ owner: "owner-id", limit: 25 })
  .autoPagingToArray({ limit: 100 });

const record = await client.dns.records.create({
  domain: domain.id,
  kind: "A",
  name: "www",
  value: "192.0.2.1",
  ttl: 300,
});

const records = await client.dns.records.list({ domain: domain.id });

await client.dns.records.update(record.id, {
  domain: domain.id,
  kind: "A",
  name: "www",
  value: "192.0.2.2",
  ttl: 300,
});

await client.dns.records.del(record.id);
await client.dns.domains.del(domain.id);
```

List and send app emails:

```js
const appSent = await client.emails.sent
  .list({ app: app.id, limit: 25 })
  .autoPagingToArray({ limit: 100 });

const ownerReceived = await client.emails.received
  .list({ owner: "owner-id", limit: 25 })
  .autoPagingToArray({ limit: 100 });

const sentFromApp = appSent[0]?.appId
  ? await client.apps.retrieve(appSent[0].appId)
  : null;

const message = await client.emails.send({
  app: app.id,
  to: ["user@example.com"],
  subject: "Hello from StackMachine",
  textBody: "Plain text body",
  htmlBody: "<p>HTML body</p>",
});
```

Check out the examples below for more client usage.

## Examples

Example scripts live in [`examples/`](./examples) and can be run with Node after installing the `stackmachine` dependency.

## Develop

Install dependencies with `npm install`.

Run the test suite with `npm test`. The tests use Node's built-in `node:test` runner. Live integration coverage runs when both `STACKMACHINE_API_KEY` and `STACKMACHINE_URL` are set; otherwise that integration test is skipped.

Load environment variables from an env file before running tests:

```bash
set -a
source .env
npm test
```

To test against another environment file, source that file instead, for example:

```bash
set -a
source .env-bugt
npm test
```

Run `npm run ci` before pushing changes. This runs the same validation steps as CI:

- formatting check
- type checking
- build
- `check-schema` to verify `schema.graphql` is up to date

Use `npm run format` to apply Prettier formatting locally.
