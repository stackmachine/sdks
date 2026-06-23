# StackMachine Python Examples

Set the API key before running any example:

```bash
export STACKMACHINE_API_KEY=sk_stackmachine_...
```

Each example uses editable placeholder IDs near the top of the file, such as
`da_example`, `github_repo_example`, and `dns_domain_example`.

Run an example with Python:

```bash
uv run python examples/manage_app_databases.py
```

Examples that create or update resources:

- `manage_app_git_connection.py`
- `manage_app_databases.py`
- `manage_app_volumes.py`
- `manage_hosted_dns_domains.py`
- `manage_hosted_dns_records.py`
- `import_hosted_dns_zone_file.py`

Destructive cleanup calls are included as commented lines. Uncomment them only
when you intend to delete or disconnect the resource shown in the example.
