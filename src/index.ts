import { srcAutobuildMutation } from "__generated__/srcAutobuildMutation.graphql";
import { srcAutobuildSubscription } from "__generated__/srcAutobuildSubscription.graphql";
import nodeAppAlias, {
  srcAppAlias$data,
} from "__generated__/srcAppAlias.graphql";
import {
  srcDeleteAppMutation,
  srcDeleteAppMutation$variables,
} from "__generated__/srcDeleteAppMutation.graphql";
import nodeApp, {
  srcDeployAppData$data,
} from "__generated__/srcDeployAppData.graphql";
import { srcDeployAppKindWordPress$data } from "__generated__/srcDeployAppKindWordPress.graphql";
import nodeAppVersion, {
  srcDeployAppVersionData$data,
} from "__generated__/srcDeployAppVersionData.graphql";
import { srcGetAppAliasesQuery } from "__generated__/srcGetAppAliasesQuery.graphql";
import { srcGetAppByIdQuery } from "__generated__/srcGetAppByIdQuery.graphql";
import { srcGetAppByNameQuery } from "__generated__/srcGetAppByNameQuery.graphql";
import { srcGetAppLogsQuery } from "__generated__/srcGetAppLogsQuery.graphql";
import { srcDeleteAppDomainMutation } from "__generated__/srcDeleteAppDomainMutation.graphql";
import { srcUpsertAppDomainMutation } from "__generated__/srcUpsertAppDomainMutation.graphql";
import { srcVerifyAppDomainMutation } from "__generated__/srcVerifyAppDomainMutation.graphql";
import { srcViewerQuery } from "__generated__/srcViewerQuery.graphql";
import RelayRuntime, {
  ReaderFragment,
  type Environment,
  type GraphQLTaggedNode,
} from "relay-runtime";
import {
  createEnvironment,
  DEFAULT_MAX_NETWORK_RETRIES,
  DEFAULT_TIMEOUT_MS,
  type EnvironmentOptions,
  type StackMachineCacheConfig,
  type StackMachineRequestOptions,
} from "./environment";
import {
  StackMachineAPIError,
  StackMachineError,
  StackMachineGraphQLError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineInvalidRequestError,
  StackMachinePermissionError,
  StackMachineRateLimitError,
  StackMachineValidationError,
  stackMachineErrorFromGraphQLErrors,
  stackMachineErrorFromUnknown,
  type StackMachineGraphQLErrorPayload,
} from "./errors";
import { createZip, handleUploadFileToCloud } from "./upload";

const {
  graphql,
  fetchQuery,
  commitMutation,
  requestSubscription,
  getSelector,
} = RelayRuntime;

const DEFAULT_API_URL = "https://api.stackmachine.com/graphql";

export { createZip };
export {
  StackMachineAPIError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineError,
  StackMachineGraphQLError,
  StackMachineInvalidRequestError,
  StackMachinePermissionError,
  StackMachineRateLimitError,
  StackMachineValidationError,
  type StackMachineGraphQLErrorPayload,
  type StackMachineRequestOptions,
};

export type StackMachineConfig = {
  apiUrl?: string;
  headers?: HeadersInit;
  timeout?: number;
  maxNetworkRetries?: number;
  fetch?: typeof fetch;
};

export type StackMachineRegistryConfig = StackMachineConfig & {
  apiKey?: string;
  /** @deprecated Use `apiKey` instead. */
  token?: string;
};

type MutationShape = {
  response: unknown;
  variables: Record<string, unknown>;
};

type SubscriptionHandlers<TSubscription extends { response: unknown }> = {
  onNext?: (data: TSubscription["response"]) => void;
  onCompleted?: () => void;
  onError?: (error: Error) => void;
};

type SdkContext = {
  environment: Environment;
  _query<
    TQuery extends { response: unknown; variables: Record<string, unknown> },
  >(
    query: GraphQLTaggedNode,
    variables: TQuery["variables"],
    options?: StackMachineRequestOptions,
  ): Promise<TQuery["response"]>;
  _mutation<TMutation extends MutationShape>(
    mutation: GraphQLTaggedNode,
    variables: TMutation["variables"],
    options?: StackMachineRequestOptions,
  ): Promise<TMutation["response"]>;
  _requestSubscription<TSubscription extends { response: unknown }>(
    subscription: GraphQLTaggedNode,
    variables: Record<string, unknown>,
    handlers: SubscriptionHandlers<TSubscription>,
    options?: StackMachineRequestOptions,
  ): { dispose: () => void };
  _getFragmentData<T>(node: ReaderFragment, fetchedData: unknown): T;
};

export type DeployAppEnvVarInput = {
  name: string;
  sensitive?: boolean | null;
  value: string;
};
export type DeployAppWordPressExtraData = {
  adminEmail: string;
  adminPassword: string;
  adminUsername: string;
  language?: string | null;
  siteName: string;
  theme?: string | null;
};
export type DeployAppAutobuildExtraData = {
  wordpress?: DeployAppWordPressExtraData | null;
};
export type DeployAppJobDefinitionInput = {
  cliArgs?: ReadonlyArray<string | null | undefined> | null;
  command: string;
  env?: ReadonlyArray<string | null | undefined> | null;
  name?: string | null;
  package?: string | null;
  timeout?: string | null;
};
export type DeployAppAutobuildInput = {
  afterDeployCmd?: string | null;
  allowExistingApp?: boolean | null;
  appId?: string | null;
  appName?: string | null;
  branch?: string | null;
  buildCmd?: string | null;
  clientMutationId?: string | null;
  domains?: ReadonlyArray<string | null | undefined> | null;
  enableDatabase?: boolean | null;
  envVars?: ReadonlyArray<DeployAppEnvVarInput | null | undefined> | null;
  extraData?: DeployAppAutobuildExtraData | null;
  installCmd?: string | null;
  jobs?: ReadonlyArray<DeployAppJobDefinitionInput | null | undefined> | null;
  kind?: string | null;
  managed?: boolean | null;
  owner?: string | null;
  params?: DeployAppAutobuildExtraData | null;
  perishAt?: string | null;
  presetName?: string | null;
  region?: string | null;
  repoUrl?: string | null;
  rootDir?: string | null;
  startCmd?: string | null;
  uploadUrl?: string | null;
  waitForScreenshotGeneration?: boolean | null;
};
export type AppsDomainsCreateInput = {
  app: string;
  hostname: string;
  isDefault?: boolean;
};
export type AppsVersionsLogsListInput = {
  version: string;
  since: Date;
  first?: number;
};
export type AppsSshUsersListInput = { app: string };
export type AppsSshAuthorizedKeysListInput = { user: string };
export type AppsSshAuthorizedKeysCreateInput = {
  user: string;
  publicKey: string;
  name?: string;
};
export type AppsSshAuthorizedKeysDeleteInput = { user: string; name: string };
export type AppsSshUsersUpdateInput = {
  username?: string;
  sftpRootFolder?: string;
  authenticationMethods?: SshAuthenticationMethod[];
};
export type AppsSshServerUpdateInput = { enabled: boolean };

export type AppAliasVerificationState =
  | "APEX_WITHOUT_REDIRECTION"
  | "UNVERIFIED"
  | "VERIFIED"
  | "%future added value";
export type HTTPRedirectType =
  | "PERMANENT_MOVED"
  | "PERMANENT_REDIRECT"
  | "TEMPORARY_FOUND"
  | "TEMPORARY_REDIRECT"
  | "%future added value";

function parseDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }
  return value instanceof Date ? value : new Date(value as string);
}

function requiredPayload<T>(
  value: T | null | undefined,
  message: string,
  operationName?: string,
): T {
  if (!value) {
    throw new StackMachineAPIError({ message, operationName });
  }
  return value;
}

function operationNameFromNode(node: GraphQLTaggedNode): string | undefined {
  return (node as any)?.params?.name ?? (node as any)?.default?.params?.name;
}

function generateClientMutationId(): string {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) {
    return `sm_${cryptoApi.randomUUID()}`;
  }
  return `sm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function resolveClientMutationId(
  inputClientMutationId: unknown,
  options?: StackMachineRequestOptions,
): string {
  const optionClientMutationId = options?.clientMutationId;
  const optionIdempotencyKey = options?.idempotencyKey;
  if (
    optionClientMutationId &&
    optionIdempotencyKey &&
    optionClientMutationId !== optionIdempotencyKey
  ) {
    throw new StackMachineValidationError({
      message:
        "`idempotencyKey` and `clientMutationId` must match when both are provided.",
      code: "idempotency_conflict",
    });
  }

  const optionValue = optionClientMutationId ?? optionIdempotencyKey;
  if (
    optionValue &&
    typeof inputClientMutationId === "string" &&
    inputClientMutationId &&
    inputClientMutationId !== optionValue
  ) {
    throw new StackMachineValidationError({
      message:
        "`input.clientMutationId` must match `idempotencyKey`/`clientMutationId` when both are provided.",
      code: "idempotency_conflict",
    });
  }

  if (optionValue) {
    return optionValue;
  }
  if (typeof inputClientMutationId === "string" && inputClientMutationId) {
    return inputClientMutationId;
  }
  return generateClientMutationId();
}

function withClientMutationId<TVariables extends Record<string, unknown>>(
  variables: TVariables,
  options?: StackMachineRequestOptions,
): TVariables {
  const input = variables.input;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return variables;
  }

  const inputRecord = input as Record<string, unknown>;
  return {
    ...variables,
    input: {
      ...inputRecord,
      clientMutationId: resolveClientMutationId(
        inputRecord.clientMutationId,
        options,
      ),
    },
  };
}

class DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKind on Kind {
      ... on WordpressAppKind {
        __typename
      }
    }
  `;
}

export class DeployAppKindWordPress extends DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKindWordPress on Kind {
      ... on WordpressAppKind {
        adminUrl
      }
    }
  `;
  adminUrl?: string;
  constructor(data: any) {
    super();
    const typedData = data as srcDeployAppKindWordPress$data;
    this.adminUrl = typedData.adminUrl;
  }
}

export class AppAlias {
  static fragment = graphql`
    fragment srcAppAlias on AppAlias {
      id
      hostname
      url
      state
      redirectionHttpCode
      redirectsFrom {
        id
      }
      redirectsTo {
        id
      }
      expectedDnsRecords {
        host
        recordType
        value
      }
      firstCheckedAt
      lastCheckedAt
      updatedAt
      createdAt
    }
  `;
  id: string;
  hostname: string;
  url: string;
  state: AppAliasVerificationState;
  redirectionHttpCode: HTTPRedirectType | null | undefined;
  redirectsFromIds: string[];
  redirectsToId: string | undefined;
  expectedDnsRecords: { host: string; recordType: string; value: string }[];
  firstCheckedAt: Date | null;
  lastCheckedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;

  constructor(data: any) {
    const typedData = data as srcAppAlias$data;
    this.id = typedData.id;
    this.hostname = typedData.hostname;
    this.url = typedData.url;
    this.state = typedData.state;
    this.redirectionHttpCode = typedData.redirectionHttpCode;
    this.redirectsFromIds =
      typedData.redirectsFrom
        ?.map((redirect) => redirect?.id!)
        .filter(Boolean) || [];
    this.redirectsToId = typedData.redirectsTo?.id;
    this.expectedDnsRecords =
      typedData.expectedDnsRecords
        ?.filter((record): record is NonNullable<typeof record> => !!record)
        .map((record) => ({
          host: record.host,
          recordType: record.recordType,
          value: record.value,
        })) || [];
    this.firstCheckedAt = parseDate(typedData.firstCheckedAt);
    this.lastCheckedAt = parseDate(typedData.lastCheckedAt);
    this.updatedAt = parseDate(typedData.updatedAt)!;
    this.createdAt = parseDate(typedData.createdAt)!;
  }
}

export class DeployApp {
  static fragment = graphql`
    fragment srcDeployAppData on DeployApp {
      id
      willPerishAt
      name
      url
      adminUrl
      domains {
        edges {
          node {
            ...srcAppAlias
          }
        }
      }
      activeVersion {
        id
      }
      favicon
      screenshot
      # managed
      # kind {
      #   __typename
      #   ...srcDeployAppKind
      # }
    }
  `;
  id: string;
  willPerishAt: Date | null;
  name: string;
  url: string;
  adminUrl: string;
  domains: AppAlias[];
  favicon: string | null;
  screenshot: string | null;
  activeVersion: DeployAppVersion | null;

  constructor(
    data: any,
    private client: SdkContext,
  ) {
    const typedData = data as srcDeployAppData$data;
    this.id = typedData.id;
    this.willPerishAt = parseDate(typedData.willPerishAt);
    this.name = typedData.name;
    this.url = typedData.url;
    this.adminUrl = typedData.adminUrl;
    this.domains = typedData.domains.edges
      .map((edge) => edge?.node)
      .filter((node): node is NonNullable<typeof node> => !!node)
      .map(
        (node) =>
          new AppAlias(
            this.client._getFragmentData<srcAppAlias$data>(nodeAppAlias, node),
          ),
      );
    this.favicon = typedData.favicon ?? null;
    this.screenshot = typedData.screenshot ?? null;
    this.activeVersion = typedData.activeVersion
      ? new DeployAppVersion(typedData.activeVersion as any, this.client, this)
      : null;
  }
}

export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";

export type Log = {
  datetime: Date;
  instanceId: string;
  message: string;
  stream: LogStream | null | undefined;
  timestamp: number;
};

export class DeployAppVersion {
  static fragment = graphql`
    fragment srcDeployAppVersionData on DeployAppVersion {
      id
      app {
        ...srcDeployAppData
      }
    }
  `;
  id: string;
  app: DeployApp;

  constructor(
    data: any,
    private client: SdkContext,
    app?: DeployApp,
  ) {
    const typedData = data as srcDeployAppVersionData$data;
    this.id = typedData.id;
    if (!app) {
      const appData = this.client._getFragmentData<srcDeployAppData$data>(
        nodeApp,
        typedData.app,
      );
      app = new DeployApp(appData, this.client);
    }
    this.app = app;
  }
}

export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY";

export class SshAuthorizedKey {
  id: string;
  name: string | null;
  publicKey: string;
  createdAt: Date;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name || null;
    this.publicKey = data.publicKey;
    this.createdAt = parseDate(data.createdAt)!;
  }
}

export class SshUser {
  id: string;
  username: string;
  port: number;
  serverHost: string;
  sftpRootFolder: string;
  authenticationMethods: SshAuthenticationMethod[] | null;
  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.port = data.port;
    this.serverHost = data.serverHost;
    this.sftpRootFolder = data.sftpRootFolder;
    this.authenticationMethods = data.authenticationMethods
      ? data.authenticationMethods.map(
          (method: SshAuthenticationMethod) => method,
        )
      : null;
  }
}

export class AppSshServer {
  id: string;
  enabled: boolean;
  users: SshUser[];
  constructor(data: any) {
    this.id = data.id;
    this.enabled = data.enabled;
    this.users =
      data.users?.edges
        ?.map((edge: any) => edge?.node)
        .filter((node: any) => !!node)
        .map((node: any) => new SshUser(node)) || [];
  }
}

export type AutoBuildDeployAppLogKind =
  | "BUILD_STATUS"
  | "COMPLETE"
  | "DEPLOY_STATUS"
  | "FAILED"
  | "FETCHING_PLAN_STATUS"
  | "LOG"
  | "PREPARING_TO_DEPLOY_STATUS"
  | "%future added value";

export type AutoBuildProgressData = {
  kind: AutoBuildDeployAppLogKind;
  message: string | undefined | null;
  datetime: Date;
  stream: LogStream | undefined | null;
};

export type Viewer = {
  username: string;
};

export class AutobuildApp {
  buildId: string;
  appVersion: DeployAppVersion | null = null;
  subscription: { dispose: () => void } | null = null;
  pendingLogs: AutoBuildProgressData[] = [];
  onProgress: ((data: AutoBuildProgressData) => void) | null = null;
  completedPromise: Promise<DeployAppVersion> | null = null;

  constructor(
    buildId: string,
    private client: SdkContext,
    options?: StackMachineRequestOptions,
  ) {
    this.buildId = buildId;
    this.completedPromise = new Promise((resolve, reject) => {
      this.subscription =
        this.client._requestSubscription<srcAutobuildSubscription>(
          graphql`
            subscription srcAutobuildSubscription($buildId: UUID!) {
              autobuildDeployment(buildId: $buildId) {
                appVersion {
                  ...srcDeployAppVersionData
                }
                kind
                datetime
                stream
                message
              }
            }
          `,
          {
            buildId: this.buildId,
          },
          {
            onNext: (data) => {
              if (!data?.autobuildDeployment) {
                return;
              }
              const { kind, message, appVersion, datetime, stream } =
                data.autobuildDeployment;

              if (kind === "FAILED") {
                reject(
                  new StackMachineAPIError({
                    message: message || "The app build failed.",
                    operationName: "srcAutobuildSubscription",
                  }),
                );
                return;
              }
              if (kind === "COMPLETE") {
                if (appVersion !== undefined && appVersion !== null) {
                  const appVersionData =
                    this.client._getFragmentData<srcDeployAppVersionData$data>(
                      nodeAppVersion,
                      appVersion,
                    );
                  this.appVersion = new DeployAppVersion(
                    appVersionData,
                    this.client,
                  );
                  resolve(this.appVersion);
                  return;
                }
                reject(
                  new StackMachineAPIError({
                    message:
                      "Error when building the app: build finished without deployed app.",
                    operationName: "srcAutobuildSubscription",
                  }),
                );
                return;
              }

              const progress = {
                kind,
                message,
                datetime: parseDate(datetime)!,
                stream,
              };
              if (this.onProgress) {
                this.onProgress(progress);
              } else {
                this.pendingLogs.push(progress);
              }
            },
            onCompleted: () => {
              this.onProgress = null;
              this.subscription?.dispose();
              this.subscription = null;
              if (!this.appVersion) {
                reject(
                  new StackMachineAPIError({
                    message:
                      "Error when building the app: build finished without deployed app.",
                    operationName: "srcAutobuildSubscription",
                  }),
                );
              } else {
                resolve(this.appVersion);
              }
            },
            onError: (error) => {
              reject(stackMachineErrorFromUnknown(error));
            },
          },
          options,
        );
    });
  }

  subscribeToProgress(callback: (data: AutoBuildProgressData) => void) {
    if (this.pendingLogs.length > 0) {
      for (const data of this.pendingLogs) {
        callback(data);
      }
      this.pendingLogs = [];
    }
    this.onProgress = callback;
  }

  async finish(): Promise<DeployAppVersion> {
    const app = await this.completedPromise;
    this.subscription?.dispose();
    this.subscription = null;
    if (!app) {
      throw new StackMachineAPIError({
        message:
          "Error when building the app: build finished without deployed app.",
        operationName: "srcAutobuildSubscription",
      });
    }
    return app;
  }
}

export class AppsDomainsResource {
  constructor(private client: SdkContext) {}

  private async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<AppAlias[]> {
    const query = await this.client._query<srcGetAppAliasesQuery>(
      graphql`
        query srcGetAppAliasesQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            ...srcAppAlias
          }
        }
      `,
      {
        ids,
      },
      options,
    );
    return (
      query?.nodes?.map(
        (node: any) =>
          new AppAlias(
            this.client._getFragmentData<srcAppAlias$data>(nodeAppAlias, node),
          ),
      ) || []
    );
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<AppAlias | null> {
    const aliases = await this.retrieveMany([id], options);
    return aliases[0] || null;
  }

  async create(
    input: AppsDomainsCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppAlias> {
    const response = await this.client._mutation<srcUpsertAppDomainMutation>(
      graphql`
        mutation srcUpsertAppDomainMutation($input: UpsertAppDomainInput!) {
          upsertAppDomain(input: $input) {
            success
            domains {
              ...srcAppAlias
            }
          }
        }
      `,
      {
        input: {
          appId: input.app,
          name: input.hostname,
          isDefault: input.isDefault,
          wait: false,
        },
      },
      options,
    );

    const payload = requiredPayload(
      response.upsertAppDomain,
      "Failed to create domain, mutation failed.",
      "srcUpsertAppDomainMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to create domain, mutation was not successful.",
        operationName: "srcUpsertAppDomainMutation",
      });
    }

    const domains = requiredPayload(
      payload.domains,
      "Failed to create domain, no domains returned.",
      "srcUpsertAppDomainMutation",
    );
    const addedDomain = domains
      .filter((domain): domain is NonNullable<typeof domain> => !!domain)
      .map(
        (domain) =>
          new AppAlias(
            this.client._getFragmentData<srcAppAlias$data>(
              nodeAppAlias,
              domain,
            ),
          ),
      )
      .find((domain) =>
        domain.expectedDnsRecords.some(
          (record) => record.host === input.hostname,
        ),
      );

    return requiredPayload(
      addedDomain,
      "Failed to create domain, domain not found in returned domains.",
      "srcUpsertAppDomainMutation",
    );
  }

  async verify(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<boolean> {
    const response = await this.client._mutation<srcVerifyAppDomainMutation>(
      graphql`
        mutation srcVerifyAppDomainMutation($input: VerifyAppDomainInput!) {
          verifyAppDomain(input: $input) {
            verified
          }
        }
      `,
      {
        input: {
          domainId: id,
        },
      },
      options,
    );
    return requiredPayload(
      response.verifyAppDomain,
      "Failed to verify domain, mutation was not successful.",
      "srcVerifyAppDomainMutation",
    ).verified;
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<srcDeleteAppDomainMutation>(
      graphql`
        mutation srcDeleteAppDomainMutation($input: DeleteAppDomainInput!) {
          deleteAppDomain(input: $input) {
            success
          }
        }
      `,
      {
        input: {
          id,
        },
      },
      options,
    );
    if (!response.deleteAppDomain?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete domain, mutation was not successful.",
        operationName: "srcDeleteAppDomainMutation",
      });
    }
  }
}

export class AppsVersionsLogsResource {
  constructor(private client: SdkContext) {}

  async list(
    input: AppsVersionsLogsListInput,
    options?: StackMachineRequestOptions,
  ): Promise<Log[]> {
    const query = await this.client._query<srcGetAppLogsQuery>(
      graphql`
        query srcGetAppLogsQuery($appId: ID!, $since: DateTime!, $first: Int!) {
          node(id: $appId) {
            ... on DeployAppVersion {
              logs(startingFromISO: $since, first: $first) {
                edges {
                  node {
                    datetime
                    instanceId
                    message
                    stream
                    timestamp
                  }
                }
              }
            }
          }
        }
      `,
      {
        appId: input.version,
        since: input.since.toISOString(),
        first: input.first ?? 100,
      },
      options,
    );
    return (
      query?.node?.logs?.edges
        .map((edge) => edge?.node)
        .filter((node): node is NonNullable<typeof node> => !!node)
        .map((node) => ({
          datetime: parseDate(node.datetime)!,
          instanceId: node.instanceId,
          message: node.message,
          stream: node.stream,
          timestamp: node.timestamp,
        })) || []
    );
  }
}

export class AppsVersionsResource {
  logs: AppsVersionsLogsResource;
  constructor(client: SdkContext) {
    this.logs = new AppsVersionsLogsResource(client);
  }
}

export class AppsSshUsersPasswordsResource {
  constructor(private client: SdkContext) {}

  async reveal(
    userId: string,
    options?: StackMachineRequestOptions,
  ): Promise<{ password: string | null; sshUser: SshUser }> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcRevealSshUserPasswordMutation(
          $input: RevealSshUserPasswordInput!
        ) {
          revealSshUserPassword(input: $input) {
            password
            sshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      {
        input: { sshUserId: userId },
      },
      options,
    );
    const payload = requiredPayload(
      response.revealSshUserPassword,
      "Failed to reveal SSH user password.",
      "srcRevealSshUserPasswordMutation",
    );
    return {
      password: payload.password || null,
      sshUser: new SshUser(payload.sshUser),
    };
  }

  async rotate(
    userId: string,
    options?: StackMachineRequestOptions,
  ): Promise<{ password: string; sshUser: SshUser }> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcRotateSshUserPasswordMutation(
          $input: RotateSshUserPasswordInput!
        ) {
          rotateSshUserPassword(input: $input) {
            password
            sshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      {
        input: { sshUserId: userId },
      },
      options,
    );
    const payload = requiredPayload(
      response.rotateSshUserPassword,
      "Failed to rotate SSH user password.",
      "srcRotateSshUserPasswordMutation",
    );
    return {
      password: payload.password,
      sshUser: new SshUser(payload.sshUser),
    };
  }
}

export class AppsSshUsersAuthorizedKeysResource {
  constructor(private client: SdkContext) {}

  async list(
    input: AppsSshAuthorizedKeysListInput,
    options?: StackMachineRequestOptions,
  ): Promise<SshAuthorizedKey[]> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetSshAuthorizedKeysQuery($id: ID!) {
          node(id: $id) {
            ... on SshUser {
              authorizedKeys(first: 100) {
                edges {
                  node {
                    id
                    name
                    publicKey
                    createdAt
                  }
                }
              }
            }
          }
        }
      `,
      { id: input.user },
      options,
    );

    return (
      query?.node?.authorizedKeys?.edges
        ?.map((edge: any) => edge?.node)
        .filter((node: any) => !!node)
        .map((node: any) => new SshAuthorizedKey(node)) || []
    );
  }

  async create(
    input: AppsSshAuthorizedKeysCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<SshAuthorizedKey> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcAddSshAuthorizedKeyMutation(
          $input: AddSshAuthorizedKeyInput!
        ) {
          addSshAuthorizedKey(input: $input) {
            authorizedKey {
              id
              name
              publicKey
              createdAt
            }
          }
        }
      `,
      {
        input: {
          sshUserId: input.user,
          publicKey: input.publicKey,
          name: input.name,
        },
      },
      options,
    );
    const keyData = requiredPayload(
      response.addSshAuthorizedKey?.authorizedKey,
      "Failed to add SSH authorized key.",
      "srcAddSshAuthorizedKeyMutation",
    );
    return new SshAuthorizedKey(keyData);
  }

  async del(
    input: AppsSshAuthorizedKeysDeleteInput,
    options?: StackMachineRequestOptions,
  ): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDeleteSshAuthorizedKeyMutation(
          $input: DeleteSshAuthorizedKeyInput!
        ) {
          deleteSshAuthorizedKey(input: $input) {
            success
          }
        }
      `,
      {
        // TODO: support key deletion by authorized-key ID when backend exposes it.
        input: { sshUserId: input.user, name: input.name },
      },
      options,
    );
    if (!response.deleteSshAuthorizedKey?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete SSH authorized key.",
        operationName: "srcDeleteSshAuthorizedKeyMutation",
      });
    }
  }
}

export class AppsSshUsersResource {
  passwords: AppsSshUsersPasswordsResource;
  authorizedKeys: AppsSshUsersAuthorizedKeysResource;

  constructor(private client: SdkContext) {
    this.passwords = new AppsSshUsersPasswordsResource(client);
    this.authorizedKeys = new AppsSshUsersAuthorizedKeysResource(client);
  }

  async list(
    input: AppsSshUsersListInput,
    options?: StackMachineRequestOptions,
  ): Promise<SshUser[]> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetAppSshUsersQuery($id: ID!) {
          node(id: $id) {
            ... on DeployApp {
              sshServer {
                users(first: 100) {
                  edges {
                    node {
                      id
                      username
                      port
                      serverHost
                      sftpRootFolder
                      authenticationMethods
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { id: input.app },
      options,
    );

    return (
      query?.node?.sshServer?.users?.edges
        ?.map((edge: any) => edge?.node)
        .filter((node: any) => !!node)
        .map((node: any) => new SshUser(node)) || []
    );
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<SshUser | null> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetSshUserByIdQuery($id: ID!) {
          node(id: $id) {
            __typename
            ... on SshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      { id },
      options,
    );
    if (!query?.node || query.node.__typename !== "SshUser") {
      return null;
    }
    return new SshUser(query.node);
  }

  async update(
    id: string,
    input: AppsSshUsersUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<SshUser> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcEditSshUserMutation($input: EditSshUserInput!) {
          editSshUser(input: $input) {
            sshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      {
        input: {
          id,
          username: input.username,
          sftpRootFolder: input.sftpRootFolder,
          authenticationMethods: input.authenticationMethods,
        },
      },
      options,
    );
    const userData = requiredPayload(
      response.editSshUser?.sshUser,
      "Failed to update SSH user.",
      "srcEditSshUserMutation",
    );
    return new SshUser(userData);
  }
}

export class AppsSshTokensResource {
  constructor(private client: SdkContext) {}

  async create(
    input: { app: string },
    options?: StackMachineRequestOptions,
  ): Promise<{ token: string }> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcGenerateSshTokenMutation($input: GenerateSshTokenInput!) {
          generateSshToken(input: $input) {
            token
          }
        }
      `,
      {
        input: {
          appId: input.app,
        },
      },
      options,
    );
    const token = response.generateSshToken?.token;
    if (!token) {
      throw new StackMachineAPIError({
        message: "Failed to generate SSH token.",
        operationName: "srcGenerateSshTokenMutation",
      });
    }
    return { token };
  }
}

export class AppsSshResource {
  tokens: AppsSshTokensResource;
  users: AppsSshUsersResource;

  constructor(private client: SdkContext) {
    this.tokens = new AppsSshTokensResource(client);
    this.users = new AppsSshUsersResource(client);
  }

  async retrieve(
    appId: string,
    options?: StackMachineRequestOptions,
  ): Promise<AppSshServer | null> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetAppSshServerQuery($id: ID!) {
          node(id: $id) {
            ... on DeployApp {
              sshServer {
                id
                enabled
                users(first: 100) {
                  edges {
                    node {
                      id
                      username
                      port
                      serverHost
                      sftpRootFolder
                      authenticationMethods
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { id: appId },
      options,
    );
    if (!query?.node?.sshServer) {
      return null;
    }
    return new AppSshServer(query.node.sshServer);
  }

  async update(
    appId: string,
    input: AppsSshServerUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppSshServer> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcToggleSshServerMutation($input: ToggleSshServerInput!) {
          toggleSshServer(input: $input) {
            sshServer {
              id
              enabled
              users(first: 100) {
                edges {
                  node {
                    id
                    username
                    port
                    serverHost
                    sftpRootFolder
                    authenticationMethods
                  }
                }
              }
            }
          }
        }
      `,
      {
        input: {
          appId,
          enabled: input.enabled,
        },
      },
      options,
    );
    const sshServer = requiredPayload(
      response.toggleSshServer?.sshServer,
      "Failed to update SSH server.",
      "srcToggleSshServerMutation",
    );
    return new AppSshServer(sshServer);
  }
}

export class DeployAppsResource {
  domains: AppsDomainsResource;
  versions: AppsVersionsResource;
  ssh: AppsSshResource;

  constructor(private client: SdkContext) {
    this.domains = new AppsDomainsResource(client);
    this.versions = new AppsVersionsResource(client);
    this.ssh = new AppsSshResource(client);
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<DeployApp | null> {
    const query = await this.client._query<srcGetAppByIdQuery>(
      graphql`
        query srcGetAppByIdQuery($id: ID!) {
          app: node(id: $id) {
            __typename
            ...srcDeployAppData
          }
        }
      `,
      {
        id,
      },
      options,
    );
    if (!query?.app || query.app.__typename !== "DeployApp") {
      return null;
    }
    const appData = this.client._getFragmentData<srcDeployAppData$data>(
      nodeApp,
      query.app,
    );
    return new DeployApp(appData, this.client);
  }

  async retrieveByName(
    name: string,
    owner?: string,
    options?: StackMachineRequestOptions,
  ): Promise<DeployApp | null> {
    const query = await this.client._query<srcGetAppByNameQuery>(
      graphql`
        query srcGetAppByNameQuery($name: String!, $owner: String) {
          app: getDeployApp(name: $name, owner: $owner) {
            ...srcDeployAppData
          }
        }
      `,
      {
        name,
        owner,
      },
      options,
    );
    if (!query?.app) {
      return null;
    }
    const appData = this.client._getFragmentData<srcDeployAppData$data>(
      nodeApp,
      query.app,
    );
    return new DeployApp(appData, this.client);
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<srcDeleteAppMutation>(
      graphql`
        mutation srcDeleteAppMutation($input: DeleteAppInput!) {
          deleteApp(input: $input) {
            success
          }
        }
      `,
      {
        input: { id },
      },
      options,
    );
    if (!response.deleteApp?.success) {
      throw new StackMachineAPIError({
        message: "The app could not be deleted.",
        operationName: "srcDeleteAppMutation",
      });
    }
  }

  async autobuild(
    input: DeployAppAutobuildInput,
    options?: StackMachineRequestOptions,
  ): Promise<AutobuildApp> {
    const response = await this.client._mutation<srcAutobuildMutation>(
      graphql`
        mutation srcAutobuildMutation($input: DeployViaAutobuildInput!) {
          deployViaAutobuild(input: $input) {
            success
            buildId
          }
        }
      `,
      {
        input,
      },
      options,
    );
    const payload = requiredPayload(
      response.deployViaAutobuild,
      "The app could not be built.",
      "srcAutobuildMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "The app could not be built.",
        operationName: "srcAutobuildMutation",
      });
    }
    return new AutobuildApp(payload.buildId, this.client, options);
  }
}

export class FilesResource {
  constructor(private client: SdkContext) {}

  async upload(
    file: Blob,
    setUploadFilesProgress?: (progress: number) => void,
    options?: StackMachineRequestOptions,
  ): Promise<string> {
    return handleUploadFileToCloud(
      this.client.environment,
      file,
      setUploadFilesProgress,
      options,
    );
  }
}

export class StackMachine implements SdkContext {
  environment: Environment;
  apps: DeployAppsResource;
  files: FilesResource;
  readonly apiUrl: string;
  readonly timeout: number;
  readonly maxNetworkRetries: number;

  constructor(apiKey: string, config: StackMachineConfig = {}) {
    this.apiUrl = config.apiUrl || DEFAULT_API_URL;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT_MS;
    this.maxNetworkRetries =
      config.maxNetworkRetries ?? DEFAULT_MAX_NETWORK_RETRIES;

    const environmentOptions: EnvironmentOptions = {
      endpoint: this.apiUrl,
      apiKey,
      headers: config.headers,
      timeout: this.timeout,
      maxNetworkRetries: this.maxNetworkRetries,
      fetch: config.fetch,
    };
    this.environment = createEnvironment(environmentOptions);
    this.apps = new DeployAppsResource(this);
    this.files = new FilesResource(this);
  }

  static async init(settings: StackMachineRegistryConfig) {
    if (!settings.apiKey && settings.token) {
      console.warn(
        "[stackmachine] `token` is deprecated. Please use `apiKey` instead.",
      );
    }
    const { apiKey, token, ...config } = settings;
    return new StackMachine(apiKey || token || "", config);
  }

  _cacheConfig(options?: StackMachineRequestOptions): StackMachineCacheConfig {
    return {
      force: options?.force ?? true,
      stackMachine: options,
    };
  }

  async _query<
    TQuery extends { response: unknown; variables: Record<string, unknown> },
  >(
    query: GraphQLTaggedNode,
    variables: TQuery["variables"],
    options?: StackMachineRequestOptions,
  ): Promise<TQuery["response"]> {
    const operationName = operationNameFromNode(query);
    try {
      const result = await fetchQuery<TQuery>(
        this.environment,
        query,
        variables,
        {
          networkCacheConfig: this._cacheConfig(options),
        },
      ).toPromise();
      return result as TQuery["response"];
    } catch (error) {
      throw stackMachineErrorFromUnknown(error, operationName);
    }
  }

  async _mutation<TMutation extends MutationShape>(
    mutation: GraphQLTaggedNode,
    variables: TMutation["variables"],
    options?: StackMachineRequestOptions,
  ): Promise<TMutation["response"]> {
    const operationName = operationNameFromNode(mutation);
    const variablesWithClientMutationId = withClientMutationId(
      variables,
      options,
    );

    return new Promise<TMutation["response"]>((resolve, reject) => {
      try {
        commitMutation<any>(this.environment, {
          mutation,
          variables: variablesWithClientMutationId,
          cacheConfig: this._cacheConfig(options),
          onCompleted: (response, errors) => {
            if (errors && errors.length > 0) {
              reject(
                stackMachineErrorFromGraphQLErrors(
                  errors as StackMachineGraphQLErrorPayload[],
                  operationName,
                ),
              );
              return;
            }
            resolve(response as TMutation["response"]);
          },
          onError: (error) => {
            reject(stackMachineErrorFromUnknown(error, operationName));
          },
        });
      } catch (error) {
        reject(stackMachineErrorFromUnknown(error, operationName));
      }
    });
  }

  _requestSubscription<TSubscription extends { response: unknown }>(
    subscription: GraphQLTaggedNode,
    variables: Record<string, unknown>,
    handlers: SubscriptionHandlers<TSubscription>,
    options?: StackMachineRequestOptions,
  ) {
    return requestSubscription<any>(this.environment, {
      subscription,
      variables,
      cacheConfig: this._cacheConfig(options),
      onNext: handlers.onNext,
      onCompleted: handlers.onCompleted,
      onError: handlers.onError,
    });
  }

  _getFragmentData<T>(node: ReaderFragment, fetchedData: unknown): T {
    const selector = getSelector(node, fetchedData);
    return this.environment.lookup(selector as any).data as T;
  }

  async viewer(options?: StackMachineRequestOptions): Promise<Viewer | null> {
    const query = await this._query<srcViewerQuery>(
      graphql`
        query srcViewerQuery {
          viewer {
            username
          }
        }
      `,
      {},
      options,
    );
    if (!query?.viewer) {
      return null;
    }
    return {
      username: query.viewer.username,
    };
  }
}
