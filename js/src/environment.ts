import {
  type CacheConfig,
  type GraphQLResponse,
  type RequestParameters,
  type UploadableMap,
  type Variables,
  type QueryResponseCache as QueryResponseCacheType,
} from "relay-runtime";
import * as RelayRuntime from "relay-runtime";
import { createClient as createSubscriptionClient } from "graphql-ws";
import {
  StackMachineAPIError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineInvalidRequestError,
  StackMachinePermissionError,
  StackMachineRateLimitError,
  type StackMachineGraphQLErrorPayload,
} from "./errors";

const {
  Environment,
  Network,
  QueryResponseCache,
  RecordSource,
  Store,
  Observable,
} = RelayRuntime;

export const graphql = RelayRuntime.graphql;
export const fetchQuery = RelayRuntime.fetchQuery;

const DEFAULT_CACHE_TTL = 30 * 1000;
export const DEFAULT_TIMEOUT_MS = 80 * 1000;
export const DEFAULT_MAX_NETWORK_RETRIES = 1;

const RETRYABLE_STATUS_CODES = new Set([
  408, 409, 425, 429, 500, 502, 503, 504,
]);

export type StackMachineRequestOptions = {
  apiKey?: string;
  headers?: HeadersInit;
  timeout?: number;
  maxNetworkRetries?: number;
  signal?: AbortSignal;
  idempotencyKey?: string;
  clientMutationId?: string;
  force?: boolean;
};

export type StackMachineNetworkOptions = StackMachineRequestOptions & {
  fetch?: typeof fetch;
};

export type StackMachineCacheConfig = CacheConfig & {
  stackMachine?: StackMachineNetworkOptions;
};

type ResolvedNetworkOptions = {
  apiKey?: string;
  headers?: HeadersInit;
  timeout: number;
  maxNetworkRetries: number;
  signal?: AbortSignal;
  fetch: typeof fetch;
};

function createCache(): QueryResponseCacheType {
  return new QueryResponseCache({
    size: 100,
    ttl: DEFAULT_CACHE_TTL,
  });
}

function getFetch(fetchFn?: typeof fetch): typeof fetch {
  const resolvedFetch = fetchFn ?? globalThis.fetch;
  if (!resolvedFetch) {
    throw new StackMachineConnectionError({
      message: "`fetch` is not available in this runtime.",
    });
  }
  return resolvedFetch.bind(globalThis) as typeof fetch;
}

function applyHeaders(headers: Headers, init?: HeadersInit) {
  if (!init) {
    return;
  }
  new Headers(init).forEach((value, key) => {
    headers.set(key, value);
  });
}

function mergeHeaders(
  baseHeaders?: HeadersInit,
  requestHeaders?: HeadersInit,
): HeadersInit | undefined {
  if (!baseHeaders) {
    return requestHeaders;
  }
  if (!requestHeaders) {
    return baseHeaders;
  }
  const merged = new Headers(baseHeaders);
  applyHeaders(merged, requestHeaders);
  return merged;
}

function createHeaders(options: ResolvedNetworkOptions): Headers {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  applyHeaders(headers, options.headers);
  if (options.apiKey) {
    headers.set("Authorization", `Bearer ${options.apiKey}`);
  }
  return headers;
}

function headersKey(headers?: HeadersInit): string {
  if (!headers) {
    return "";
  }
  const entries: [string, string][] = [];
  new Headers(headers).forEach((value, key) => {
    entries.push([key, value]);
  });
  const sorted = entries.sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(sorted);
}

function resolveNetworkOptions(
  base: EnvironmentOptions,
  requestOptions?: StackMachineNetworkOptions,
): ResolvedNetworkOptions {
  return {
    apiKey: requestOptions?.apiKey ?? base.apiKey ?? base.token,
    headers: mergeHeaders(base.headers, requestOptions?.headers),
    timeout: requestOptions?.timeout ?? base.timeout ?? DEFAULT_TIMEOUT_MS,
    maxNetworkRetries:
      requestOptions?.maxNetworkRetries ??
      base.maxNetworkRetries ??
      DEFAULT_MAX_NETWORK_RETRIES,
    signal: requestOptions?.signal,
    fetch: getFetch(requestOptions?.fetch ?? base.fetch),
  };
}

function getRequestOptions(
  cacheConfig?: CacheConfig,
): StackMachineNetworkOptions {
  return ((cacheConfig as StackMachineCacheConfig | undefined)?.stackMachine ??
    {}) as StackMachineNetworkOptions;
}

function isRetryableStatus(statusCode?: number): boolean {
  return statusCode !== undefined && RETRYABLE_STATUS_CODES.has(statusCode);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function createRequestSignal(
  signal?: AbortSignal,
  timeout?: number,
): {
  signal?: AbortSignal;
  cleanup: () => void;
  timedOut: () => boolean;
  userAborted: () => boolean;
} {
  if (!signal && (!timeout || timeout <= 0)) {
    return {
      signal: undefined,
      cleanup: () => {},
      timedOut: () => false,
      userAborted: () => false,
    };
  }

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let timedOut = false;
  let userAborted = false;

  const abortFromSignal = () => {
    userAborted = true;
    controller.abort(signal?.reason);
  };

  if (signal) {
    if (signal.aborted) {
      abortFromSignal();
    } else {
      signal.addEventListener("abort", abortFromSignal, { once: true });
    }
  }

  if (timeout && timeout > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error(`Request timed out after ${timeout}ms.`));
    }, timeout);
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      signal?.removeEventListener("abort", abortFromSignal);
    },
    timedOut: () => timedOut,
    userAborted: () => userAborted,
  };
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelayMs(attempt: number): number {
  const base = Math.min(100 * 2 ** attempt, 2_000);
  return Math.round(base / 2 + Math.random() * (base / 2));
}

function cleanVariables(variables: Variables): Variables {
  return Object.entries(variables)
    .filter(([, value]) => value != null)
    .reduce<Variables>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

function requestIdFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-request-id") ??
    headers.get("x-stackmachine-request-id") ??
    null
  );
}

async function parseResponseBody(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorMessageFromBody(body: any, fallback: string): string {
  if (typeof body === "string") {
    return body || fallback;
  }
  if (Array.isArray(body?.errors) && body.errors[0]?.message) {
    return body.errors[0].message;
  }
  if (typeof body?.error?.message === "string") {
    return body.error.message;
  }
  if (typeof body?.message === "string") {
    return body.message;
  }
  return fallback;
}

function codeFromBody(body: any): string | undefined {
  if (typeof body?.error?.code === "string") {
    return body.error.code;
  }
  if (typeof body?.code === "string") {
    return body.code;
  }
  const firstGraphQLError = Array.isArray(body?.errors) ? body.errors[0] : null;
  if (typeof firstGraphQLError?.extensions?.code === "string") {
    return firstGraphQLError.extensions.code;
  }
  return undefined;
}

function graphQLErrorsFromBody(
  body: any,
): readonly StackMachineGraphQLErrorPayload[] | undefined {
  return Array.isArray(body?.errors) ? body.errors : undefined;
}

function apiErrorForResponse(
  response: Response,
  body: any,
  operationName?: string,
) {
  const options = {
    message: errorMessageFromBody(
      body,
      `StackMachine API request failed with status ${response.status}.`,
    ),
    operationName,
    statusCode: response.status,
    requestId: requestIdFromHeaders(response.headers),
    code: codeFromBody(body),
    graphQLErrors: graphQLErrorsFromBody(body),
  };

  if (response.status === 401) {
    return new StackMachineAuthenticationError(options);
  }
  if (response.status === 403) {
    return new StackMachinePermissionError(options);
  }
  if (response.status === 429) {
    return new StackMachineRateLimitError(options);
  }
  if (response.status >= 400 && response.status < 500) {
    return new StackMachineInvalidRequestError(options);
  }
  return new StackMachineAPIError(options);
}

function shouldRetry(
  error: unknown,
  attempt: number,
  maxRetries: number,
): boolean {
  if (attempt >= maxRetries) {
    return false;
  }
  if (
    error instanceof StackMachineConnectionError &&
    error.code !== "request_aborted"
  ) {
    return true;
  }
  if (error instanceof StackMachineAPIError) {
    return isRetryableStatus(error.statusCode);
  }
  return false;
}

async function performNetworkFetch(
  endpoint: string,
  request: RequestParameters,
  variables: Variables,
  options: ResolvedNetworkOptions,
  uploadables?: UploadableMap | null,
): Promise<GraphQLResponse> {
  const operationName = request.name;
  const requestHeaders = createHeaders(options);
  const signal = createRequestSignal(options.signal, options.timeout);

  let body: BodyInit;
  const cleanedVariables = cleanVariables(variables);

  if (uploadables && Object.keys(uploadables).length > 0) {
    if (!globalThis.FormData) {
      throw new StackMachineConnectionError({
        message: "Uploading files without `FormData` is not supported.",
        operationName,
      });
    }

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: request.text,
        variables: cleanedVariables,
        operationName,
        id: request.id,
      }),
    );

    const uploadEntries = Object.keys(uploadables)
      .filter((path) => Object.prototype.hasOwnProperty.call(uploadables, path))
      .map((path, index) => [path, String(index)] as const);
    const uploadMap = uploadEntries.reduce<Record<string, string[]>>(
      (map, [path, key]) => ({ ...map, [key]: [path] }),
      {},
    );
    formData.append("map", JSON.stringify(uploadMap));

    uploadEntries.forEach(([path, key]) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, path)) {
        formData.append(key, uploadables[path]);
      }
    });

    body = formData;
  } else {
    requestHeaders.set("Content-Type", "application/json");
    body = JSON.stringify({
      query: request.text,
      variables: cleanedVariables,
      operationName,
      id: request.id,
    });
  }

  try {
    const response = await options.fetch(endpoint, {
      method: "POST",
      headers: requestHeaders,
      body,
      signal: signal.signal,
    });
    const parsedBody = await parseResponseBody(response);
    if (!response.ok) {
      throw apiErrorForResponse(response, parsedBody, operationName);
    }
    return parsedBody as GraphQLResponse;
  } catch (error) {
    if (error instanceof StackMachineAPIError) {
      throw error;
    }
    if (isAbortError(error) || signal.timedOut() || signal.userAborted()) {
      throw new StackMachineConnectionError({
        message: signal.userAborted()
          ? "StackMachine request was aborted."
          : `StackMachine request timed out after ${options.timeout}ms.`,
        operationName,
        code: signal.userAborted() ? "request_aborted" : "request_timeout",
        cause: error,
      });
    }
    throw new StackMachineConnectionError({
      message:
        error instanceof Error
          ? error.message
          : "StackMachine network request failed.",
      operationName,
      cause: error,
    });
  } finally {
    signal.cleanup();
  }
}

export async function networkFetch(
  endpoint: string,
  request: RequestParameters,
  variables: Variables,
  baseOptions: EnvironmentOptions,
  requestOptions?: StackMachineNetworkOptions,
  uploadables?: UploadableMap | null,
): Promise<GraphQLResponse> {
  const resolvedOptions = resolveNetworkOptions(baseOptions, requestOptions);
  let attempt = 0;

  while (true) {
    try {
      return await performNetworkFetch(
        endpoint,
        request,
        variables,
        resolvedOptions,
        uploadables,
      );
    } catch (error) {
      if (!shouldRetry(error, attempt, resolvedOptions.maxNetworkRetries)) {
        throw error;
      }
      await sleep(retryDelayMs(attempt));
      attempt += 1;
    }
  }
}

function createNetwork(
  endpoint: string,
  responseCache: QueryResponseCacheType,
  baseOptions: EnvironmentOptions,
) {
  const subscriptionClients = new Map<string, any>();

  const fetchResponse = async (
    params: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null,
  ) => {
    const requestOptions = getRequestOptions(cacheConfig);
    const forceFetch = Boolean(cacheConfig?.force ?? requestOptions.force);
    const isQuery = params.operationKind === "query";
    const usesRequestScopedAuthOrHeaders =
      requestOptions.apiKey !== undefined ||
      requestOptions.headers !== undefined;
    const cacheKey = params.id ?? params.cacheID;

    if (
      responseCache != null &&
      isQuery &&
      !forceFetch &&
      !usesRequestScopedAuthOrHeaders
    ) {
      const fromCache = responseCache.get(cacheKey, variables);
      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    const response = await networkFetch(
      endpoint,
      params,
      variables,
      baseOptions,
      requestOptions,
      uploadables,
    );

    if (responseCache != null && isQuery && !usesRequestScopedAuthOrHeaders) {
      responseCache.set(cacheKey, variables, response);
    }
    return response;
  };

  const getSubscriptionClient = (
    requestOptions: StackMachineNetworkOptions,
  ) => {
    const resolved = resolveNetworkOptions(baseOptions, requestOptions);
    const key = JSON.stringify({
      endpoint,
      apiKey: resolved.apiKey,
      headers: headersKey(resolved.headers),
    });
    let subscriptionClient = subscriptionClients.get(key);
    if (!subscriptionClient || subscriptionClient.status === 3) {
      const connectionHeaders = createHeaders(resolved);
      const connectionParams: Record<string, string> = {};
      connectionHeaders.forEach((value, key) => {
        connectionParams[key] = value;
      });
      subscriptionClient = createSubscriptionClient({
        url: endpoint
          .replace(/^http:\/\//, "ws://")
          .replace(/^https:\/\//, "wss://"),
        connectionParams,
      });
      subscriptionClients.set(key, subscriptionClient);
    }
    return subscriptionClient;
  };

  const subscribe = (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
  ) => {
    const client = getSubscriptionClient(getRequestOptions(cacheConfig));
    return Observable.create((sink) => {
      return client.subscribe(
        {
          query: request.text || "",
          id: request.id,
          operationName: request.name,
          variables,
        },
        sink,
      );
    });
  };

  return Network.create(fetchResponse, subscribe as any);
}

export type EnvironmentOptions = {
  endpoint: string;
  apiKey?: string;
  token?: string;
  headers?: HeadersInit;
  timeout?: number;
  maxNetworkRetries?: number;
  fetch?: typeof fetch;
  records?: any;
  isServer?: boolean;
  cache?: QueryResponseCacheType;
};

export function createEnvironment(options: EnvironmentOptions) {
  const cache = options.cache ?? createCache();
  return new Environment({
    network: createNetwork(options.endpoint, cache, options)!,
    store: new Store(new RecordSource(options.records)),
    isServer: options.isServer,
    options: {
      cache,
    },
  });
}
