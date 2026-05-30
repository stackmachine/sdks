# stackmachine

JavaScript SDK for deploying and managing apps on StackMachine.

## Functionality

- Deploy apps
- Fetch app information
- Fetch app logs
- Delete apps
- Manage app domains
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
import { StackMachine } from "stackmachine";

const client = new StackMachine(process.env.STACKMACHINE_API_KEY);
```

`StackMachine.init({ apiKey, apiUrl })` is still supported for existing code. Pass constructor config such as `apiUrl`, `timeout`, or `maxNetworkRetries` only when you need to override the defaults.

Use the resource clients for app and file operations:

```js
const zip = await createZip({
  "index.php": "<html><body><h1>Hello StackMachine</h1></body></html>",
});
const uploadUrl = await client.files.upload(zip);
const deployment = await client.deployments.create({
  appName: "hello-stackmachine",
  owner: "stackmachine",
  uploadUrl,
});
const appVersion = await deployment.wait({
  onProgress: ({ datetime, stream, kind, message }) => {
    console.log(datetime, stream, kind, message);
  },
});
const app = await client.apps.retrieve(appVersion.app.id);
```

`client.apps.autobuild(...)` is still supported as a deprecated compatibility alias for `client.deployments.create(...)`; its returned deployment still supports the old `.finish()` and `.subscribeToProgress(...)` methods.

Resume an existing deployment by build ID:

```js
const deployment = await client.deployments.retrieve(buildId);
if (deployment) {
  const appVersion = await deployment.wait();
}
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
