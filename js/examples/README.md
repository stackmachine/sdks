# StackMachine JavaScript Examples

Set the API key before running any example:

```bash
export STACKMACHINE_API_KEY=sk_stackmachine_...
```

Each example uses editable placeholder IDs near the top of the file, such as
`da_example`, `github_repo_example`, and `dns_domain_example`.

Run an example with Node:

```bash
node manageAppDatabases.js
```

Examples that create or update resources:

- `manageAppGitConnection.js`
- `manageAppDatabases.js`
- `manageAppVolumes.js`
- `manageHostedDnsDomains.js`
- `manageHostedDnsRecords.js`
- `importHostedDnsZoneFile.js`

Destructive cleanup calls are included as commented lines. Uncomment them only
when you intend to delete or disconnect the resource shown in the example.
