# StackMachine Python SDK

Python SDK for StackMachine.

## Installation

```bash
uv add stackmachine
```

## Status

This package currently contains the initial Python SDK scaffold. The public API implementation will be added in a follow-up release.

## Manual Publish

Use this path for the first package upload before PyPI Trusted Publishing is configured:

```bash
cd python
uv sync --dev
uv build --no-sources
uv publish
```
