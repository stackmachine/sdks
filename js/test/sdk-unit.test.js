import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import StackMachineDefault, {
  AutobuildApp,
  AppVolume,
  Deployment,
  StackMachine,
  StackMachineAPIError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineGraphQLError,
  StackMachineInvalidRequestError,
  StackMachineRateLimitError,
  StackMachineValidationError,
} from "../dist/index.js";

const require = createRequire(import.meta.url);

const jsonResponse = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const viewerResponse = (username = "tester") =>
  jsonResponse({
    data: {
      viewer: {
        id: `viewer-${username}`,
        username,
      },
    },
  });

const deleteAppResponse = (success = true) =>
  jsonResponse({
    data: {
      deleteApp: {
        success,
      },
    },
  });

const appNode = (id) => ({
  __typename: "DeployApp",
  id,
  willPerishAt: null,
  name: `app-${id}`,
  url: `https://${id}.example.test`,
  adminUrl: `https://${id}.example.test/admin`,
  activeVersion: null,
  favicon: null,
  screenshot: null,
});

const appAliasNode = (id) => ({
  __typename: "AppAlias",
  id,
  hostname: `${id}.example.test`,
  url: `https://${id}.example.test`,
  state: "VERIFIED",
  redirectionHttpCode: null,
  redirectsFrom: [],
  redirectsTo: null,
  expectedDnsRecords: [
    {
      host: `${id}.example.test`,
      recordType: "CNAME",
      value: "stackmachine.example.test",
    },
  ],
  firstCheckedAt: null,
  lastCheckedAt: null,
  updatedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
});

const appVolumeNode = (id, overrides = {}) => ({
  __typename: "AppVolume",
  id,
  volumeId: `volume-${id}`,
  mountPath: "/data",
  maxSizeBytes: 1_073_741_824,
  s3Enabled: false,
  s3Url: null,
  explorerUrl: `https://console.example.test/volumes/${id}`,
  isAddedByUi: true,
  ...overrides,
});

const sshUserNode = (id) => ({
  __typename: "SshUser",
  id,
  username: `user-${id}`,
  port: 2222,
  serverHost: "ssh.example.test",
  sftpRootFolder: "/",
  authenticationMethods: ["PUBLIC_KEY"],
});

const appVersionNode = (id = "version_1", appId = "app_1") => ({
  id,
  app: appNode(appId),
});

const deploymentCreateResponse = (buildId = "build_1", success = true) =>
  jsonResponse({
    data: {
      deployViaAutobuild: {
        success,
        buildId,
      },
    },
  });

const deploymentStatusResponse = (status) =>
  jsonResponse({
    data: {
      autobuildDeploymentStatus: status,
    },
  });

const uploadQueryResponse = (url = "https://storage.example.test/upload.zip") =>
  jsonResponse({
    data: {
      getSignedUrl: {
        url,
      },
    },
  });

const uploadSessionResponse = (
  uploadUrl = "https://storage.example.test/session",
) =>
  new Response(null, {
    status: 200,
    headers: {
      location: uploadUrl,
    },
  });

const uploadRangeResponse = (endByte) =>
  new Response(null, {
    status: 308,
    headers: {
      range: `bytes=0-${endByte}`,
    },
  });

const uploadCompleteResponse = () => new Response(null, { status: 200 });

const appsListResponse = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) =>
  jsonResponse({
    data: {
      viewer: {
        id: "viewer-1",
        apps: {
          edges: items.map((item) => ({
            cursor: item.cursor,
            node: appNode(item.id),
          })),
          pageInfo,
          totalCount,
        },
      },
    },
  });

const appVolumesListResponse = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) =>
  jsonResponse({
    data: {
      node: {
        __typename: "DeployApp",
        id: "app_1",
        volumes: {
          edges: items.map((item) => ({
            cursor: item.cursor,
            node: appVolumeNode(item.id, item.overrides),
          })),
          pageInfo,
          totalCount,
        },
      },
    },
  });

const abortError = () =>
  Object.assign(new Error("Aborted"), { name: "AbortError" });

function mockFetch(handler) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    const body =
      typeof init.body === "string" && init.body
        ? JSON.parse(init.body)
        : init.body;
    const call = {
      url: String(url),
      init,
      headers: new Headers(init.headers),
      body,
    };
    calls.push(call);
    return handler(call, calls.length - 1);
  };
  fetch.calls = calls;
  return fetch;
}

function mockSubscriptionClient(events) {
  const subscriptions = [];
  const client = {
    _getFragmentData: (_, data) => data,
    _requestSubscription: (_subscription, variables, handlers, options) => {
      const subscription = {
        variables,
        options,
        disposed: false,
      };
      subscriptions.push(subscription);
      queueMicrotask(() => {
        for (const event of events) {
          handlers.onNext?.({
            autobuildDeployment: event,
          });
        }
        handlers.onCompleted?.();
      });
      return {
        dispose: () => {
          subscription.disposed = true;
        },
      };
    },
  };
  return { client, subscriptions };
}

test("clients keep independent keys, endpoints, caches, and resources", async () => {
  const fetchA = mockFetch(() => viewerResponse("client-a"));
  const fetchB = mockFetch(() => viewerResponse("client-b"));
  const clientA = new StackMachine("key-a", {
    apiUrl: "https://api-a.example.test/graphql",
    fetch: fetchA,
  });
  const clientB = new StackMachine("key-b", {
    apiUrl: "https://api-b.example.test/graphql",
    fetch: fetchB,
  });

  assert.notEqual(clientA.environment, clientB.environment);
  assert.notEqual(clientA.apps, clientB.apps);
  assert.notEqual(clientA.apps.volumes, clientB.apps.volumes);
  assert.notEqual(clientA.deployments, clientB.deployments);
  assert.notEqual(clientA.files, clientB.files);

  assert.deepEqual(await clientA.viewer({ force: false }), {
    username: "client-a",
  });
  assert.deepEqual(await clientA.viewer({ force: false }), {
    username: "client-a",
  });
  assert.deepEqual(await clientB.viewer({ force: false }), {
    username: "client-b",
  });
  assert.deepEqual(await clientB.viewer({ force: false }), {
    username: "client-b",
  });

  assert.equal(fetchA.calls.length, 1);
  assert.equal(fetchB.calls.length, 1);
  assert.equal(fetchA.calls[0].url, "https://api-a.example.test/graphql");
  assert.equal(fetchB.calls[0].url, "https://api-b.example.test/graphql");
  assert.equal(fetchA.calls[0].headers.get("authorization"), "Bearer key-a");
  assert.equal(fetchB.calls[0].headers.get("authorization"), "Bearer key-b");
});

test("per-request auth, headers, timeout, signal, and retry options override config", async () => {
  const controller = new AbortController();
  const fetch = mockFetch((call) => {
    assert.ok(call.init.signal instanceof AbortSignal);
    return viewerResponse("override");
  });
  const client = new StackMachine("global-key", {
    apiUrl: "https://api.example.test/graphql",
    headers: {
      "x-global": "global",
      "x-shared": "global",
    },
    timeout: 80_000,
    maxNetworkRetries: 4,
    fetch,
  });

  await client.viewer({
    apiKey: "request-key",
    headers: {
      "x-request": "request",
      "x-shared": "request",
    },
    timeout: 5_000,
    maxNetworkRetries: 0,
    signal: controller.signal,
  });

  const headers = fetch.calls[0].headers;
  assert.equal(headers.get("authorization"), "Bearer request-key");
  assert.equal(headers.get("x-global"), "global");
  assert.equal(headers.get("x-request"), "request");
  assert.equal(headers.get("x-shared"), "request");

  const failingFetch = mockFetch(() =>
    jsonResponse(
      { errors: [{ message: "temporarily unavailable" }] },
      { status: 503 },
    ),
  );
  const retryClient = new StackMachine("global-key", {
    apiUrl: "https://api.example.test/graphql",
    maxNetworkRetries: 4,
    fetch: failingFetch,
  });

  await assert.rejects(
    retryClient.viewer({ maxNetworkRetries: 0 }),
    StackMachineAPIError,
  );
  assert.equal(failingFetch.calls.length, 1);
});

test("StackMachine.init remains compatible and accepts token alias", async () => {
  const fetch = mockFetch(() => viewerResponse("token-user"));
  const warn = console.warn;
  console.warn = () => {};
  try {
    const client = await StackMachine.init({
      token: "token-key",
      apiUrl: "https://api.example.test/graphql",
      fetch,
    });
    assert.deepEqual(await client.viewer(), { username: "token-user" });
  } finally {
    console.warn = warn;
  }

  assert.equal(fetch.calls[0].headers.get("authorization"), "Bearer token-key");
});

test("package supports default import and CommonJS callable construction", async () => {
  assert.equal(StackMachineDefault, StackMachine);

  const StackMachineCjs = require("..");
  assert.equal(typeof StackMachineCjs, "function");
  assert.equal(typeof StackMachineCjs.default, "function");
  assert.equal(typeof StackMachineCjs.StackMachine, "function");
  assert.equal(typeof StackMachineCjs.StackMachineAPIError, "function");

  const callableClient = StackMachineCjs("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: mockFetch(() => viewerResponse("callable")),
  });
  assert.ok(callableClient instanceof StackMachineCjs);
  assert.ok(callableClient instanceof StackMachineCjs.StackMachine);
  assert.equal(callableClient.apiUrl, "https://api.example.test/graphql");
  assert.ok(callableClient.apps);
  assert.ok(callableClient.deployments);

  const constructedClient = new StackMachineCjs("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: mockFetch(() => viewerResponse("constructed")),
  });
  assert.ok(constructedClient instanceof StackMachineCjs);
  assert.ok(constructedClient instanceof StackMachineCjs.StackMachine);

  const namedClient = new StackMachineCjs.StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: mockFetch(() => viewerResponse("named")),
  });
  assert.ok(namedClient instanceof StackMachineCjs.StackMachine);
});

test("files.upload supports options object progress, chunk size, and injected fetch", async () => {
  const progress = [];
  const fetch = mockFetch((call) => {
    if (call.body?.operationName === "uploadQuery") {
      return uploadQueryResponse();
    }
    if (
      call.url === "https://storage.example.test/upload.zip" &&
      call.init.method === "POST"
    ) {
      return uploadSessionResponse();
    }
    if (
      call.url === "https://storage.example.test/session" &&
      call.init.method === "PUT"
    ) {
      const range = call.headers.get("content-range");
      if (range === "bytes 0-3/10") {
        return uploadRangeResponse(3);
      }
      if (range === "bytes 4-7/10") {
        return uploadRangeResponse(7);
      }
      if (range === "bytes 8-9/10") {
        return uploadCompleteResponse();
      }
    }
    throw new Error(`Unexpected upload call ${call.init.method} ${call.url}`);
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const uploadUrl = await client.files.upload(new Blob(["0123456789"]), {
    chunkSize: 4,
    onProgress: (value) => progress.push(value),
  });

  assert.equal(uploadUrl, "https://storage.example.test/upload.zip");
  assert.deepEqual(
    fetch.calls
      .filter((call) => call.url === "https://storage.example.test/session")
      .map((call) => call.headers.get("content-range")),
    ["bytes 0-3/10", "bytes 4-7/10", "bytes 8-9/10"],
  );
  assert.deepEqual(progress, [
    { loaded: 0, total: 10, percent: 0 },
    { loaded: 4, total: 10, percent: 0.4 },
    { loaded: 8, total: 10, percent: 0.8 },
    { loaded: 10, total: 10, percent: 1 },
  ]);
});

test("files.upload rejects the removed positional progress callback signature", async () => {
  const fetch = mockFetch(() => uploadQueryResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.files.upload(new Blob(["legacy"]), () => {}),
    (error) => {
      assert.ok(error instanceof StackMachineValidationError);
      assert.equal(
        error.message,
        "`client.files.upload` progress must be passed as `options.onProgress`.",
      );
      return true;
    },
  );
  assert.equal(fetch.calls.length, 0);
});

test("files.upload retries retryable chunk failures and resumes from server range", async () => {
  const progress = [];
  const ranges = [];
  let failedSecondChunk = false;
  const fetch = mockFetch((call) => {
    if (call.body?.operationName === "uploadQuery") {
      return uploadQueryResponse();
    }
    if (call.init.method === "POST") {
      return uploadSessionResponse();
    }
    if (call.init.method === "PUT") {
      const range = call.headers.get("content-range");
      ranges.push(range);
      if (range === "bytes 0-3/8") {
        return uploadRangeResponse(3);
      }
      if (range === "bytes 4-7/8" && !failedSecondChunk) {
        failedSecondChunk = true;
        return new Response("retry later", {
          status: 503,
          statusText: "Unavailable",
        });
      }
      if (range === "bytes */8") {
        return uploadRangeResponse(5);
      }
      if (range === "bytes 6-7/8") {
        return uploadCompleteResponse();
      }
    }
    throw new Error(`Unexpected upload call ${call.init.method} ${call.url}`);
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await client.files.upload(new Blob(["12345678"]), {
    chunkSize: 4,
    maxNetworkRetries: 1,
    onProgress: (value) => progress.push(value),
  });

  assert.deepEqual(ranges, [
    "bytes 0-3/8",
    "bytes 4-7/8",
    "bytes */8",
    "bytes 6-7/8",
  ]);
  assert.deepEqual(progress, [
    { loaded: 0, total: 8, percent: 0 },
    { loaded: 4, total: 8, percent: 0.5 },
    { loaded: 6, total: 8, percent: 0.75 },
    { loaded: 8, total: 8, percent: 1 },
  ]);
});

test("files.upload validates chunk size before fetching", async () => {
  const fetch = mockFetch(() => uploadQueryResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.files.upload(new Blob(["invalid"]), { chunkSize: 0 }),
    (error) => {
      assert.ok(error instanceof StackMachineValidationError);
      assert.equal(
        error.message,
        "`chunkSize` must be an integer between 1 and 536870912 bytes.",
      );
      return true;
    },
  );
  assert.equal(fetch.calls.length, 0);
});

test("deployments.create uses the autobuild mutation and apps.autobuild remains an alias", async () => {
  const createFetch = mockFetch(() => deploymentCreateResponse("build_create"));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: createFetch,
  });

  const deployment = await client.deployments.create(
    {
      appName: "app-create",
      owner: "tester",
      uploadUrl: "https://upload.example.test/app.zip",
    },
    {
      apiKey: "request-key",
      headers: { "x-request": "yes" },
      clientMutationId: "cmid-deploy",
    },
  );

  assert.ok(deployment instanceof Deployment);
  assert.ok(deployment instanceof AutobuildApp);
  assert.equal(deployment.buildId, "build_create");
  assert.equal(createFetch.calls[0].body.operationName, "srcAutobuildMutation");
  assert.equal(
    createFetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(createFetch.calls[0].headers.get("x-request"), "yes");
  assert.deepEqual(createFetch.calls[0].body.variables.input, {
    appName: "app-create",
    owner: "tester",
    uploadUrl: "https://upload.example.test/app.zip",
    clientMutationId: "cmid-deploy",
  });

  const aliasFetch = mockFetch(() => deploymentCreateResponse("build_alias"));
  const aliasClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: aliasFetch,
  });

  const aliasDeployment = await aliasClient.apps.autobuild({
    appName: "app-alias",
    owner: "tester",
    uploadUrl: "https://upload.example.test/app.zip",
  });

  assert.ok(aliasDeployment instanceof Deployment);
  assert.equal(aliasDeployment.buildId, "build_alias");
  assert.equal(aliasFetch.calls[0].body.operationName, "srcAutobuildMutation");
});

test("deployments.create accepts files and reports upload progress", async () => {
  const progress = [];
  const fetch = mockFetch((call) => {
    if (call.body?.operationName === "uploadQuery") {
      return uploadQueryResponse("https://storage.example.test/app.zip");
    }
    if (
      call.url === "https://storage.example.test/app.zip" &&
      call.init.method === "POST"
    ) {
      return uploadSessionResponse("https://storage.example.test/session");
    }
    if (
      call.url === "https://storage.example.test/session" &&
      call.init.method === "PUT"
    ) {
      assert.match(call.headers.get("content-range"), /^bytes 0-\d+\/\d+$/);
      return uploadCompleteResponse();
    }
    if (call.body?.operationName === "srcAutobuildMutation") {
      return deploymentCreateResponse("build_from_files");
    }
    throw new Error(`Unexpected call ${call.init.method} ${call.url}`);
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const deployment = await client.deployments.create(
    {
      appName: "hello-stackmachine",
      owner: "tester",
      files: {
        "index.html": "<html><body><h1>Hello World!</h1></body></html>",
      },
    },
    {
      chunkSize: 10_000_000,
      onUploadProgress: (entry) => progress.push(entry),
    },
  );

  const mutation = fetch.calls.find(
    (call) => call.body?.operationName === "srcAutobuildMutation",
  );
  assert.ok(mutation);
  assert.equal(deployment.buildId, "build_from_files");
  assert.equal(mutation.body.variables.input.appName, "hello-stackmachine");
  assert.equal(mutation.body.variables.input.owner, "tester");
  assert.equal(
    mutation.body.variables.input.uploadUrl,
    "https://storage.example.test/app.zip",
  );
  assert.match(mutation.body.variables.input.clientMutationId, /^sm_/);
  assert.equal(Object.hasOwn(mutation.body.variables.input, "files"), false);
  assert.equal(progress[0].loaded, 0);
  assert.equal(progress.at(-1).percent, 1);
});

test("deployments.create rejects files together with uploadUrl", async () => {
  const fetch = mockFetch(() => deploymentCreateResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.deployments.create({
      appName: "ambiguous",
      owner: "tester",
      uploadUrl: "https://storage.example.test/app.zip",
      files: {
        "index.html": "<h1>Hello</h1>",
      },
    }),
    (error) => {
      assert.ok(error instanceof StackMachineValidationError);
      assert.equal(error.code, "invalid_deployment_source");
      assert.equal(error.param, "files");
      return true;
    },
  );
  assert.equal(fetch.calls.length, 0);
});

test("deployments.retrieve maps status/appVersion and throws for missing deployments", async () => {
  const fetch = mockFetch(() =>
    deploymentStatusResponse({
      buildId: "build_found",
      status: "SUCCESS",
      appVersion: appVersionNode("version_1", "app_1"),
    }),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const deployment = await client.deployments.retrieve("build_found", {
    apiKey: "request-key",
  });

  assert.ok(deployment instanceof Deployment);
  assert.equal(deployment.buildId, "build_found");
  assert.equal(deployment.status, "SUCCESS");
  assert.equal(deployment.appVersion.id, "version_1");
  assert.equal(deployment.appVersion.app.id, "app_1");
  assert.equal(await deployment.wait(), deployment.appVersion);
  assert.equal(
    fetch.calls[0].body.operationName,
    "srcGetDeploymentStatusQuery",
  );
  assert.equal(fetch.calls[0].body.variables.buildId, "build_found");
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );

  const missingFetch = mockFetch(() => deploymentStatusResponse(null));
  const missingClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: missingFetch,
  });

  await assert.rejects(
    missingClient.deployments.retrieve("build_missing"),
    (error) => {
      assert.ok(error instanceof StackMachineInvalidRequestError);
      assert.equal(error.statusCode, 404);
      assert.equal(error.code, "resource_missing");
      assert.equal(error.param, "buildId");
      return true;
    },
  );
});

test("retrieve methods throw resource_missing errors instead of returning null", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcGetAppByIdQuery":
        return jsonResponse({ data: { app: null } });
      case "srcGetAppByNameQuery":
        return jsonResponse({ data: { app: null } });
      case "srcGetAppAliasesQuery":
        return jsonResponse({ data: { nodes: [null] } });
      case "srcGetSshUserByIdQuery":
        return jsonResponse({ data: { node: null } });
      case "srcGetAppSshServerQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              id: "app_missing",
              sshServer: null,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const cases = [
    () => client.apps.retrieve("app_missing"),
    () => client.apps.retrieveByName("app-name", "owner"),
    () => client.apps.domains.retrieve("domain_missing"),
    () => client.apps.ssh.users.retrieve("ssh_user_missing"),
    () => client.apps.ssh.retrieve("app_missing"),
  ];

  for (const retrieve of cases) {
    await assert.rejects(retrieve(), (error) => {
      assert.ok(error instanceof StackMachineInvalidRequestError);
      assert.equal(error.statusCode, 404);
      assert.equal(error.code, "resource_missing");
      return true;
    });
  }
});

test("retrieveMany methods preserve input order and return null for missing ids", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcGetDeploymentStatusQuery": {
        const { buildId } = call.body.variables;
        return deploymentStatusResponse(
          buildId === "build_missing"
            ? null
            : {
                buildId,
                status: "RUNNING",
                appVersion: null,
              },
        );
      }
      case "srcGetAppsByIdsQuery":
        return jsonResponse({
          data: {
            nodes: [
              appNode("app_1"),
              null,
              sshUserNode("ssh_wrong_for_apps"),
              appNode("app_2"),
            ],
          },
        });
      case "srcGetAppAliasesQuery":
        return jsonResponse({
          data: {
            nodes: [
              appAliasNode("domain_1"),
              null,
              appNode("app_wrong_for_domains"),
              appAliasNode("domain_2"),
            ],
          },
        });
      case "srcGetSshUsersByIdsQuery":
        return jsonResponse({
          data: {
            nodes: [
              sshUserNode("ssh_1"),
              null,
              appNode("app_wrong_for_ssh_users"),
              sshUserNode("ssh_2"),
            ],
          },
        });
      case "srcGetAppSshServersQuery":
        return jsonResponse({
          data: {
            nodes: [
              {
                __typename: "DeployApp",
                id: "app_1",
                sshServer: { id: "ssh_server_1", enabled: true },
              },
              {
                __typename: "DeployApp",
                id: "app_without_ssh",
                sshServer: null,
              },
              sshUserNode("ssh_wrong_for_servers"),
              {
                __typename: "DeployApp",
                id: "app_2",
                sshServer: { id: "ssh_server_2", enabled: false },
              },
            ],
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });
  const options = { apiKey: "request-key" };

  const deployments = await client.deployments.retrieveMany(
    ["build_1", "build_missing", "build_2"],
    options,
  );
  assert.deepEqual(
    deployments.map((deployment) => deployment?.buildId ?? null),
    ["build_1", null, "build_2"],
  );

  const apps = await client.apps.retrieveMany(
    ["app_1", "app_missing", "wrong_type", "app_2"],
    options,
  );
  assert.deepEqual(
    apps.map((app) => app?.id ?? null),
    ["app_1", null, null, "app_2"],
  );

  const domains = await client.apps.domains.retrieveMany(
    ["domain_1", "domain_missing", "wrong_type", "domain_2"],
    options,
  );
  assert.deepEqual(
    domains.map((domain) => domain?.id ?? null),
    ["domain_1", null, null, "domain_2"],
  );

  const sshUsers = await client.apps.ssh.users.retrieveMany(
    ["ssh_1", "ssh_missing", "wrong_type", "ssh_2"],
    options,
  );
  assert.deepEqual(
    sshUsers.map((user) => user?.id ?? null),
    ["ssh_1", null, null, "ssh_2"],
  );

  const sshServers = await client.apps.ssh.retrieveMany(
    ["app_1", "app_without_ssh", "wrong_type", "app_2"],
    options,
  );
  assert.deepEqual(
    sshServers.map((server) => server?.id ?? null),
    ["ssh_server_1", null, null, "ssh_server_2"],
  );

  const callsBeforeEmptyBatches = fetch.calls.length;
  assert.deepEqual(await client.deployments.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.domains.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.ssh.users.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.ssh.retrieveMany([], options), []);
  assert.equal(fetch.calls.length, callsBeforeEmptyBatches);

  assert.deepEqual(
    fetch.calls
      .filter(
        (call) => call.body.operationName === "srcGetDeploymentStatusQuery",
      )
      .map((call) => call.body.variables.buildId),
    ["build_1", "build_missing", "build_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppsByIdsQuery",
    ).body.variables.ids,
    ["app_1", "app_missing", "wrong_type", "app_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppAliasesQuery",
    ).body.variables.ids,
    ["domain_1", "domain_missing", "wrong_type", "domain_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetSshUsersByIdsQuery",
    ).body.variables.ids,
    ["ssh_1", "ssh_missing", "wrong_type", "ssh_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppSshServersQuery",
    ).body.variables.ids,
    ["app_1", "app_without_ssh", "wrong_type", "app_2"],
  );
  assert.ok(
    fetch.calls.every(
      (call) => call.headers.get("authorization") === "Bearer request-key",
    ),
  );
});

test("deployment.wait emits progress, resolves on complete, and preserves request options", async () => {
  const { client, subscriptions } = mockSubscriptionClient([
    {
      kind: "LOG",
      message: "Installing dependencies",
      datetime: "2026-01-01T00:00:00Z",
      stream: "STDOUT",
      appVersion: null,
    },
    {
      kind: "COMPLETE",
      message: null,
      datetime: "2026-01-01T00:00:01Z",
      stream: null,
      appVersion: appVersionNode("version_complete", "app_complete"),
    },
  ]);
  const deployment = new Deployment("build_wait", client);
  const progress = [];

  const appVersion = await deployment.wait(
    {
      onProgress: (entry) => {
        progress.push(entry);
      },
    },
    { apiKey: "subscription-key" },
  );

  assert.equal(appVersion.id, "version_complete");
  assert.equal(appVersion.app.id, "app_complete");
  assert.equal(deployment.status, "SUCCESS");
  assert.equal(deployment.appVersion, appVersion);
  assert.equal(progress.length, 1);
  assert.equal(progress[0].kind, "LOG");
  assert.ok(progress[0].datetime instanceof Date);
  assert.equal(subscriptions.length, 1);
  assert.deepEqual(subscriptions[0].variables, { buildId: "build_wait" });
  assert.equal(subscriptions[0].options.apiKey, "subscription-key");
  assert.equal(subscriptions[0].disposed, true);
});

test("deployment.wait rejects typed errors on failed deployments", async () => {
  const { client } = mockSubscriptionClient([
    {
      kind: "FAILED",
      message: "Build failed",
      datetime: "2026-01-01T00:00:00Z",
      stream: "STDERR",
      appVersion: null,
    },
  ]);
  const deployment = new Deployment("build_failed", client);

  await assert.rejects(deployment.wait(), (error) => {
    assert.ok(error instanceof StackMachineAPIError);
    assert.equal(error.message, "Build failed");
    assert.equal(error.operationName, "srcAutobuildSubscription");
    return true;
  });
  assert.equal(deployment.status, "FAILED");
});

test("finish and subscribeToProgress remain deployment compatibility aliases", async () => {
  const { client } = mockSubscriptionClient([
    {
      kind: "LOG",
      message: "Preparing",
      datetime: "2026-01-01T00:00:00Z",
      stream: "STDOUT",
      appVersion: null,
    },
    {
      kind: "COMPLETE",
      message: null,
      datetime: "2026-01-01T00:00:01Z",
      stream: null,
      appVersion: appVersionNode("version_alias", "app_alias"),
    },
  ]);
  const deployment = new Deployment("build_alias_wait", client);
  const progress = [];

  deployment.subscribeToProgress((entry) => {
    progress.push(entry);
  });
  const appVersion = await deployment.finish();

  assert.equal(appVersion.id, "version_alias");
  assert.deepEqual(
    progress.map((entry) => entry.message),
    ["Preparing"],
  );
});

test("list methods return Stripe-like list objects", async () => {
  const fetch = mockFetch(() =>
    appsListResponse(
      [{ id: "app_1", cursor: "cursor_1" }],
      {
        hasNextPage: true,
        hasPreviousPage: false,
        endCursor: "cursor_1",
        startCursor: "cursor_1",
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.apps.list({ limit: 1 });

  assert.equal(page.object, "list");
  assert.equal(page.url, "/v1/apps");
  assert.equal(page.hasMore, true);
  assert.equal(page.has_more, true);
  assert.equal(page.nextPageCursor, "cursor_1");
  assert.equal(page.previousPageCursor, "cursor_1");
  assert.equal(page.totalCount, 3);
  assert.equal(page.data.length, 1);
  assert.equal(page.data[0].id, "app_1");
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[0].body.variables.sortBy, "NEWEST");
});

test("app volumes list, create, update, and delete map to GraphQL operations", async () => {
  const fetch = mockFetch((call, index) => {
    switch (call.body.operationName) {
      case "srcListAppVolumesQuery":
        return appVolumesListResponse(
          [
            {
              id: index === 0 ? "volume_1" : "volume_2",
              cursor: index === 0 ? "cursor_1" : "cursor_2",
              overrides:
                index === 0
                  ? { s3Enabled: true, s3Url: "https://s3.example.test/v1" }
                  : { mountPath: "/cache" },
            },
          ],
          {
            hasNextPage: index === 0,
            hasPreviousPage: index > 0,
            endCursor: index === 0 ? "cursor_1" : "cursor_2",
            startCursor: index === 0 ? "cursor_1" : "cursor_2",
          },
          2,
        );
      case "srcCreateAppVolumeMutation":
        return jsonResponse({
          data: {
            createAppVolume: {
              success: true,
              volume: appVolumeNode("volume_created", {
                mountPath: "/uploads",
                maxSizeBytes: 2_147_483_648,
              }),
            },
          },
        });
      case "srcUpdateVolumeMutation":
        return jsonResponse({
          data: {
            updateVolume: {
              success: true,
              volume: appVolumeNode("volume_created", {
                mountPath: "/uploads-v2",
                s3Enabled: true,
              }),
            },
          },
        });
      case "srcDeleteAppVolumeMutation":
        return jsonResponse({
          data: {
            deleteAppVolume: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const volumes = await client.apps.volumes
    .list(
      { app: "app_1", limit: 1 },
      { apiKey: "request-key", headers: { "x-request": "yes" } },
    )
    .autoPagingToArray({ limit: 2 });
  const created = await client.apps.volumes.create(
    {
      app: "app_1",
      mountPath: "/uploads",
      maxSizeBytes: 2_147_483_648,
    },
    { clientMutationId: "cmid-create-volume" },
  );
  const updated = await client.apps.volumes.update(
    "volume_created",
    { mountPath: "/uploads-v2", s3Enabled: true },
    { idempotencyKey: "idem-update-volume" },
  );
  await client.apps.volumes.del("volume_created", {
    clientMutationId: "cmid-delete-volume",
  });

  assert.deepEqual(
    volumes.map((volume) => volume.id),
    ["volume_1", "volume_2"],
  );
  assert.ok(volumes[0] instanceof AppVolume);
  assert.equal(volumes[0].volumeId, "volume-volume_1");
  assert.equal(volumes[0].mountPath, "/data");
  assert.equal(volumes[0].maxSizeBytes, 1_073_741_824);
  assert.equal(volumes[0].s3Enabled, true);
  assert.equal(volumes[0].s3Url, "https://s3.example.test/v1");
  assert.equal(
    volumes[0].explorerUrl,
    "https://console.example.test/volumes/volume_1",
  );
  assert.equal(volumes[0].isAddedByUi, true);
  assert.equal(created.id, "volume_created");
  assert.equal(created.mountPath, "/uploads");
  assert.equal(updated.mountPath, "/uploads-v2");
  assert.equal(updated.s3Enabled, true);

  assert.equal(fetch.calls[0].body.variables.appId, "app_1");
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[0].body.variables.after, undefined);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_1");
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(fetch.calls[1].headers.get("x-request"), "yes");
  assert.deepEqual(fetch.calls[2].body.variables.input, {
    appId: "app_1",
    mountPath: "/uploads",
    maxSizeBytes: 2_147_483_648,
    clientMutationId: "cmid-create-volume",
  });
  assert.deepEqual(fetch.calls[3].body.variables.input, {
    id: "volume_created",
    mountPath: "/uploads-v2",
    s3Enabled: true,
    clientMutationId: "idem-update-volume",
  });
  assert.deepEqual(fetch.calls[4].body.variables.input, {
    id: "volume_created",
    clientMutationId: "cmid-delete-volume",
  });
});

test("app volume mutations throw when backend success is false", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcCreateAppVolumeMutation":
        return jsonResponse({
          data: {
            createAppVolume: {
              success: false,
              volume: appVolumeNode("volume_failed"),
            },
          },
        });
      case "srcUpdateVolumeMutation":
        return jsonResponse({
          data: {
            updateVolume: {
              success: false,
              volume: appVolumeNode("volume_failed"),
            },
          },
        });
      case "srcDeleteAppVolumeMutation":
        return jsonResponse({
          data: {
            deleteAppVolume: {
              success: false,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.volumes.create({ app: "app_1", mountPath: "/data" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.volumes.update("volume_1", { mountPath: "/data" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.volumes.del("volume_1"),
    StackMachineAPIError,
  );
});

test("pagination aliases map to GraphQL variables and validate conflicts", async () => {
  const fetch = mockFetch(() => appsListResponse([]));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await client.apps.list({ limit: 2, starting_after: "cursor_a" });
  await client.apps.list({ limit: 3, startingAfter: "cursor_b" });

  assert.equal(fetch.calls[0].body.variables.first, 2);
  assert.equal(fetch.calls[0].body.variables.after, "cursor_a");
  assert.equal(fetch.calls[1].body.variables.first, 3);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_b");

  assert.throws(
    () =>
      client.apps.list({
        startingAfter: "cursor_a",
        starting_after: "cursor_b",
      }),
    StackMachineValidationError,
  );
  assert.throws(
    () =>
      client.apps.list({
        startingAfter: "cursor_a",
        endingBefore: "cursor_b",
      }),
    StackMachineValidationError,
  );
  assert.throws(
    () => client.apps.list({ limit: 0 }),
    StackMachineValidationError,
  );
  assert.throws(
    () => client.apps.list({ limit: 101 }),
    StackMachineValidationError,
  );
});

test("async iteration fetches subsequent pages and preserves request options", async () => {
  const fetch = mockFetch((_, index) => {
    if (index === 0) {
      return appsListResponse(
        [{ id: "app_1", cursor: "cursor_1" }],
        {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: "cursor_1",
          startCursor: "cursor_1",
        },
        2,
      );
    }
    return appsListResponse(
      [{ id: "app_2", cursor: "cursor_2" }],
      {
        hasNextPage: false,
        hasPreviousPage: true,
        endCursor: "cursor_2",
        startCursor: "cursor_2",
      },
      2,
    );
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const ids = [];
  for await (const app of client.apps.list(
    { limit: 1 },
    {
      apiKey: "request-key",
      headers: { "x-request": "yes" },
    },
  )) {
    ids.push(app.id);
  }

  assert.deepEqual(ids, ["app_1", "app_2"]);
  assert.equal(fetch.calls.length, 2);
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[0].body.variables.after, undefined);
  assert.equal(fetch.calls[1].body.variables.first, 1);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_1");
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(
    fetch.calls[1].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(fetch.calls[1].headers.get("x-request"), "yes");
});

test("autoPagingEach stops when the handler returns false", async () => {
  const fetch = mockFetch(() =>
    appsListResponse(
      [{ id: "app_1", cursor: "cursor_1" }],
      {
        hasNextPage: true,
        hasPreviousPage: false,
        endCursor: "cursor_1",
        startCursor: "cursor_1",
      },
      2,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const ids = [];
  await client.apps.list({ limit: 1 }).autoPagingEach((app) => {
    ids.push(app.id);
    return false;
  });

  assert.deepEqual(ids, ["app_1"]);
  assert.equal(fetch.calls.length, 1);
});

test("autoPagingToArray requires a limit and stops at that cap", async () => {
  const fetch = mockFetch((_, index) =>
    appsListResponse(
      [{ id: `app_${index + 1}`, cursor: `cursor_${index + 1}` }],
      {
        hasNextPage: index < 2,
        hasPreviousPage: index > 0,
        endCursor: `cursor_${index + 1}`,
        startCursor: `cursor_${index + 1}`,
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.list({ limit: 1 }).autoPagingToArray(),
    StackMachineValidationError,
  );

  const apps = await client.apps
    .list({ limit: 1 })
    .autoPagingToArray({ limit: 2 });

  assert.deepEqual(
    apps.map((app) => app.id),
    ["app_2", "app_3"],
  );
  assert.equal(fetch.calls.length, 3);
});

test("backward pagination maps endingBefore to GraphQL before and last", async () => {
  const fetch = mockFetch(() =>
    appsListResponse(
      [{ id: "app_2", cursor: "cursor_2" }],
      {
        hasNextPage: true,
        hasPreviousPage: true,
        endCursor: "cursor_2",
        startCursor: "cursor_2",
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.apps.list({
    limit: 2,
    endingBefore: "cursor_3",
  });

  assert.equal(fetch.calls[0].body.variables.first, undefined);
  assert.equal(fetch.calls[0].body.variables.after, undefined);
  assert.equal(fetch.calls[0].body.variables.last, 2);
  assert.equal(fetch.calls[0].body.variables.before, "cursor_3");
  assert.equal(page.hasMore, true);
  assert.equal(page.previousPageCursor, "cursor_2");
});

test("mutations receive explicit, aliased, and generated client mutation ids", async () => {
  const explicitFetch = mockFetch(() => deleteAppResponse());
  const explicitClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: explicitFetch,
  });
  await explicitClient.apps.del("app-explicit", {
    clientMutationId: "cmid-explicit",
  });
  assert.equal(
    explicitFetch.calls[0].body.variables.input.clientMutationId,
    "cmid-explicit",
  );

  const idempotencyFetch = mockFetch(() => deleteAppResponse());
  const idempotencyClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: idempotencyFetch,
  });
  await idempotencyClient.apps.del("app-idempotent", {
    idempotencyKey: "idem-key",
  });
  assert.equal(
    idempotencyFetch.calls[0].body.variables.input.clientMutationId,
    "idem-key",
  );

  const retryFetch = mockFetch((_, index) =>
    index === 0
      ? jsonResponse({ errors: [{ message: "retry later" }] }, { status: 503 })
      : deleteAppResponse(),
  );
  const retryClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: retryFetch,
  });
  await retryClient.apps.del("app-generated");

  assert.equal(retryFetch.calls.length, 2);
  const firstId = retryFetch.calls[0].body.variables.input.clientMutationId;
  const secondId = retryFetch.calls[1].body.variables.input.clientMutationId;
  assert.match(firstId, /^sm_/);
  assert.equal(secondId, firstId);
});

test("conflicting idempotency options throw validation errors before fetch", async () => {
  const fetch = mockFetch(() => deleteAppResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.del("app", {
      idempotencyKey: "idem-a",
      clientMutationId: "idem-b",
    }),
    StackMachineValidationError,
  );
  assert.equal(fetch.calls.length, 0);
});

test("retryable HTTP and network failures retry, but application errors do not", async () => {
  const httpFetch = mockFetch((_, index) =>
    index === 0
      ? jsonResponse(
          { errors: [{ message: "service unavailable" }] },
          { status: 503 },
        )
      : viewerResponse("after-http-retry"),
  );
  const httpClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: httpFetch,
  });
  assert.deepEqual(await httpClient.viewer(), {
    username: "after-http-retry",
  });
  assert.equal(httpFetch.calls.length, 2);

  const networkFetch = mockFetch((_, index) => {
    if (index === 0) {
      throw new Error("socket closed");
    }
    return viewerResponse("after-network-retry");
  });
  const networkClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: networkFetch,
  });
  assert.deepEqual(await networkClient.viewer(), {
    username: "after-network-retry",
  });
  assert.equal(networkFetch.calls.length, 2);

  const applicationFetch = mockFetch(() => deleteAppResponse(false));
  const applicationClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    maxNetworkRetries: 3,
    fetch: applicationFetch,
  });
  await assert.rejects(applicationClient.apps.del("app"), StackMachineAPIError);
  assert.equal(applicationFetch.calls.length, 1);
});

test("user aborts and timeouts become connection errors without retrying aborts", async () => {
  const abortedController = new AbortController();
  abortedController.abort();
  const abortFetch = mockFetch((call) => {
    if (call.init.signal?.aborted) {
      throw abortError();
    }
    return viewerResponse();
  });
  const abortClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: abortFetch,
  });

  await assert.rejects(
    abortClient.viewer({
      maxNetworkRetries: 2,
      signal: abortedController.signal,
    }),
    (error) => {
      assert.ok(error instanceof StackMachineConnectionError);
      assert.equal(error.code, "request_aborted");
      return true;
    },
  );
  assert.equal(abortFetch.calls.length, 1);

  const timeoutFetch = mockFetch(
    (call) =>
      new Promise((_, reject) => {
        call.init.signal?.addEventListener(
          "abort",
          () => reject(abortError()),
          { once: true },
        );
      }),
  );
  const timeoutClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: timeoutFetch,
  });

  await assert.rejects(
    timeoutClient.viewer({ timeout: 1, maxNetworkRetries: 0 }),
    (error) => {
      assert.ok(error instanceof StackMachineConnectionError);
      assert.equal(error.code, "request_timeout");
      return true;
    },
  );
});

test("HTTP and GraphQL failures normalize to typed SDK errors", async () => {
  const cases = [
    [400, StackMachineInvalidRequestError],
    [401, StackMachineAuthenticationError],
    [429, StackMachineRateLimitError],
  ];

  for (const [status, ErrorClass] of cases) {
    const fetch = mockFetch(() =>
      jsonResponse(
        {
          errors: [
            {
              message: `status ${status}`,
              extensions: { code: `STATUS_${status}` },
            },
          ],
        },
        {
          status,
          headers: { "x-request-id": `req_${status}` },
        },
      ),
    );
    const client = new StackMachine("key", {
      apiUrl: "https://api.example.test/graphql",
      fetch,
    });

    await assert.rejects(client.viewer(), (error) => {
      assert.ok(error instanceof ErrorClass);
      assert.equal(error.statusCode, status);
      assert.equal(error.requestId, `req_${status}`);
      assert.equal(error.code, `STATUS_${status}`);
      return true;
    });
  }

  const graphQLFetch = mockFetch(() =>
    jsonResponse({
      errors: [
        {
          message: "field validation failed",
          extensions: { code: "BAD_USER_INPUT", param: "input.name" },
        },
      ],
    }),
  );
  const graphQLClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: graphQLFetch,
  });

  await assert.rejects(graphQLClient.apps.del("app"), (error) => {
    assert.ok(error instanceof StackMachineGraphQLError);
    assert.equal(error.operationName, "srcDeleteAppMutation");
    assert.equal(error.code, "BAD_USER_INPUT");
    assert.equal(error.param, "input.name");
    assert.equal(error.graphQLErrors.length, 1);
    return true;
  });
  assert.equal(graphQLFetch.calls.length, 1);
});
