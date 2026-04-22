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

The examples in this repository use the `STACKMACHINE_TOKEN` environment variable:

```bash
export STACKMACHINE_TOKEN=your_token_here
```

## Basic Usage

Initialize the client:

```js
import { StackMachine } from "stackmachine";

const client = await StackMachine.init({
  token: process.env.STACKMACHINE_TOKEN,
});
```

Check out the examples below for client usage.

## Examples

Example scripts live in [`examples/`](./examples) and can be run with Node after installing the `stackmachine` dependency.

## Develop

Install dependencies with `npm install`.

Run the integration test suite with `npm test`. The tests use Node's built-in `node:test` runner and require both `STACKMACHINE_TOKEN` and `STACKMACHINE_URL`. The test suite will fail fast if the API URL is not set.

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
