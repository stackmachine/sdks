import assert from "node:assert/strict";
import test from "node:test";
import {
  StackMachine,
  StackMachineAPIError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineGraphQLError,
  StackMachineInvalidRequestError,
  StackMachineRateLimitError,
  StackMachineValidationError,
} from "../dist/index.js";

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
