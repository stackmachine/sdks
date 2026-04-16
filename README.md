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

Run `npm run ci` before pushing changes. This runs the same validation steps as CI:

- formatting check
- type checking
- build
- `check-schema` to verify `schema.graphql` is up to date

Use `npm run format` to apply Prettier formatting locally.
