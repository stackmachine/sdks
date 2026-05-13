import {
  srcAutobuildMutation,
  srcAutobuildMutation$variables,
} from "__generated__/srcAutobuildMutation.graphql";
import { createEnvironment } from "./environment";
import RelayRuntime, {
  ReaderFragment,
  type Environment,
  type MutationParameters,
} from "relay-runtime";
import { srcAutobuildSubscription } from "__generated__/srcAutobuildSubscription.graphql";
import nodeApp, {
  srcDeployAppData$data,
} from "__generated__/srcDeployAppData.graphql";
import nodeSshAuthorizedKey, {
  srcDeployAppSshAuthorizedKeyData$data,
} from "__generated__/srcDeployAppSshAuthorizedKeyData.graphql";
import nodeSshServer, {
  srcDeployAppSshServerData$data,
} from "__generated__/srcDeployAppSshServerData.graphql";
import nodeSshUser, {
  srcDeployAppSshUserData$data,
} from "__generated__/srcDeployAppSshUserData.graphql";
import nodeAppVersion, {
  srcDeployAppVersionData$data,
} from "__generated__/srcDeployAppVersionData.graphql";
import { srcDeployAppKindWordPress$data } from "__generated__/srcDeployAppKindWordPress.graphql";
import { srcAddSshAuthorizedKeyMutation } from "__generated__/srcAddSshAuthorizedKeyMutation.graphql";
import {
  srcDeleteAppMutation,
  srcDeleteAppMutation$variables,
} from "__generated__/srcDeleteAppMutation.graphql";
import { srcGenerateSshTokenMutation } from "__generated__/srcGenerateSshTokenMutation.graphql";
import {
  srcGetAppByNameQuery,
  srcGetAppByNameQuery$variables,
} from "__generated__/srcGetAppByNameQuery.graphql";
import {
  srcGetAppByIdQuery,
  srcGetAppByIdQuery$variables,
} from "__generated__/srcGetAppByIdQuery.graphql";
import { srcRevealSshUserPasswordMutation } from "__generated__/srcRevealSshUserPasswordMutation.graphql";
import { srcRotateSshUserPasswordMutation } from "__generated__/srcRotateSshUserPasswordMutation.graphql";
import { srcToggleSshServerMutation } from "__generated__/srcToggleSshServerMutation.graphql";
import { srcViewerQuery } from "__generated__/srcViewerQuery.graphql";
import { createZip, handleUploadFileToCloud } from "upload";
import nodeAppAlias, {
  srcAppAlias$data,
} from "__generated__/srcAppAlias.graphql";
import { srcUpsertAppDomainMutation } from "__generated__/srcUpsertAppDomainMutation.graphql";
import { srcGetAppLogsQuery } from "__generated__/srcGetAppLogsQuery.graphql";
import { srcDeleteAppDomainMutation } from "__generated__/srcDeleteAppDomainMutation.graphql";
import { srcGetAppAliasesQuery } from "__generated__/srcGetAppAliasesQuery.graphql";
import { srcVerifyAppDomainMutation } from "__generated__/srcVerifyAppDomainMutation.graphql";
const {
  graphql,
  fetchQuery,
  commitMutation,
  requestSubscription,
  getSelector,
} = RelayRuntime;

const DEFAULT_API_URL = "https://api.stackmachine.com/graphql";

export { createZip };

export type StackMachineRegistryConfig = {
  apiUrl?: string;
  token?: string;
};

export type SshAuthenticationMethod =
  | "PASSWORD"
  | "PUBLIC_KEY"
  | "%future added value";

export type AddSshAuthorizedKeyInput = {
  name?: string | null;
  publicKey: string;
};

export type SshCommandOptions = {
  check?: boolean;
  password?: string;
  pty?: boolean;
  timeoutMs?: number;
};

export type SshCommandResult = {
  code: number | null;
  command: string;
  signal: string | null;
  stderr: string;
  stdout: string;
};

type Ssh2Module = {
  Client: new () => {
    on(event: string, listener: (...args: any[]) => void): any;
    connect(options: Record<string, unknown>): any;
    exec(
      command: string,
      options: Record<string, unknown>,
      callback: (error: unknown, stream: any) => void,
    ): any;
    end(): any;
    destroy(): any;
  };
};

let config: {
  environment: Environment;
} | null = null;
let ssh2ModuleLoaderForTests: (() => Promise<Ssh2Module>) | null = null;

const assertConfig = () => {
  if (!config) {
    throw new Error(
      "StackMachine is not initialized. Please call init() first.",
    );
  }
};

const environment = () => {
  assertConfig();
  return config!.environment;
};

const isNodeRuntime = () => {
  const processRef = (
    globalThis as { process?: { versions?: { node?: string } } }
  ).process;
  return !!processRef?.versions?.node;
};

const decodeOutputChunk = (chunk: unknown): string => {
  if (typeof chunk === "string") {
    return chunk;
  }
  if (chunk instanceof Uint8Array) {
    return new TextDecoder().decode(chunk);
  }
  return String(chunk);
};

const loadSsh2 = async (): Promise<Ssh2Module> => {
  if (!isNodeRuntime()) {
    throw new Error("SSH command execution is only available in Node.js.");
  }
  if (ssh2ModuleLoaderForTests) {
    return ssh2ModuleLoaderForTests();
  }
  return import("ssh2");
};

export const __setSsh2ModuleLoaderForTests = (
  loader: (() => Promise<Ssh2Module>) | null,
) => {
  ssh2ModuleLoaderForTests = loader;
};

export class DeployAppSshAuthorizedKey {
  static fragment = graphql`
    fragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {
      id
      createdAt
      name
      publicKey
    }
  `;
  id!: string;
  createdAt!: Date;
  name?: string | null;
  publicKey!: string;

  constructor(data: srcDeployAppSshAuthorizedKeyData$data) {
    this.applyData(data);
  }

  private applyData(data: srcDeployAppSshAuthorizedKeyData$data) {
    this.id = data.id;
    this.createdAt = new Date(data.createdAt);
    this.name = data.name;
    this.publicKey = data.publicKey;
  }
}

export class DeployAppSshUser {
  static fragment = graphql`
    fragment srcDeployAppSshUserData on SshUser {
      id
      username
      sftpRootFolder
      port
      serverHost
      authenticationMethods
      authorizedKeys(first: 50) {
        edges {
          node {
            ...srcDeployAppSshAuthorizedKeyData
          }
        }
      }
    }
  `;
  id!: string;
  username!: string;
  sftpRootFolder!: string;
  port!: number;
  serverHost!: string;
  authenticationMethods!: SshAuthenticationMethod[];
  authorizedKeys!: DeployAppSshAuthorizedKey[];
  private password: string | null = null;

  constructor(data: srcDeployAppSshUserData$data) {
    this.applyData(data);
  }

  private applyData(data: srcDeployAppSshUserData$data) {
    this.id = data.id;
    this.username = data.username;
    this.sftpRootFolder = data.sftpRootFolder;
    this.port = data.port;
    this.serverHost = data.serverHost;
    this.authenticationMethods = (data.authenticationMethods ?? []).filter(
      (method): method is SshAuthenticationMethod =>
        method !== null && method !== undefined,
    );
    this.authorizedKeys = data.authorizedKeys.edges
      .map((edge) => edge?.node)
      .filter((node) => node !== null && node !== undefined)
      .map(
        (node) =>
          new DeployAppSshAuthorizedKey(
            getFragmentData<srcDeployAppSshAuthorizedKeyData$data>(
              environment(),
              nodeSshAuthorizedKey,
              node,
            ),
          ),
      );
  }

  async revealPassword(): Promise<string | null> {
    const response =
      await commitMutationAsync<srcRevealSshUserPasswordMutation>(
        graphql`
          mutation srcRevealSshUserPasswordMutation(
            $input: RevealSshUserPasswordInput!
          ) {
            revealSshUserPassword(input: $input) {
              password
              sshUser {
                ...srcDeployAppSshUserData
              }
            }
          }
        `,
        { input: { sshUserId: this.id } },
        "The SSH user password could not be revealed",
      );

    const sshUserData = getFragmentData<srcDeployAppSshUserData$data>(
      environment(),
      nodeSshUser,
      response.revealSshUserPassword!.sshUser,
    );
    this.applyData(sshUserData);
    this.password = response.revealSshUserPassword?.password ?? null;

    return this.password;
  }

  async rotatePassword(): Promise<string> {
    const response =
      await commitMutationAsync<srcRotateSshUserPasswordMutation>(
        graphql`
          mutation srcRotateSshUserPasswordMutation(
            $input: RotateSshUserPasswordInput!
          ) {
            rotateSshUserPassword(input: $input) {
              password
              sshUser {
                ...srcDeployAppSshUserData
              }
            }
          }
        `,
        { input: { sshUserId: this.id } },
        "The SSH user password could not be rotated",
      );

    const sshUserData = getFragmentData<srcDeployAppSshUserData$data>(
      environment(),
      nodeSshUser,
      response.rotateSshUserPassword!.sshUser,
    );
    this.applyData(sshUserData);
    this.password = response.rotateSshUserPassword!.password;

    return this.password;
  }

  async addAuthorizedKey(
    input: AddSshAuthorizedKeyInput,
  ): Promise<DeployAppSshAuthorizedKey> {
    const response = await commitMutationAsync<srcAddSshAuthorizedKeyMutation>(
      graphql`
        mutation srcAddSshAuthorizedKeyMutation(
          $input: AddSshAuthorizedKeyInput!
        ) {
          addSshAuthorizedKey(input: $input) {
            authorizedKey {
              ...srcDeployAppSshAuthorizedKeyData
            }
          }
        }
      `,
      {
        input: {
          sshUserId: this.id,
          publicKey: input.publicKey,
          name: input.name,
        },
      },
      "The SSH authorized key could not be added",
    );

    const keyData = getFragmentData<srcDeployAppSshAuthorizedKeyData$data>(
      environment(),
      nodeSshAuthorizedKey,
      response.addSshAuthorizedKey!.authorizedKey,
    );
    const key = new DeployAppSshAuthorizedKey(keyData);
    const existingIndex = this.authorizedKeys.findIndex(
      (candidate) => candidate.id === key.id,
    );

    if (existingIndex >= 0) {
      this.authorizedKeys[existingIndex] = key;
    } else {
      this.authorizedKeys.push(key);
    }

    return key;
  }

  private async resolvePassword(password?: string): Promise<string> {
    if (password) {
      return password;
    }
    if (this.password) {
      return this.password;
    }

    const revealedPassword = await this.revealPassword();
    if (!revealedPassword) {
      throw new Error(
        `The SSH user "${this.username}" does not have a password available.`,
      );
    }

    return revealedPassword;
  }

  async exec(
    command: string,
    options: SshCommandOptions = {},
  ): Promise<SshCommandResult> {
    const ssh2 = await loadSsh2();
    const password = await this.resolvePassword(options.password);

    return await new Promise((resolve, reject) => {
      const client = new ssh2.Client();
      let settled = false;
      let stdout = "";
      let stderr = "";
      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

      const finish = (result: SshCommandResult) => {
        if (settled) {
          return;
        }
        settled = true;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        client.end();

        if (options.check !== false && result.code !== 0) {
          const error = new Error(
            `SSH command failed with exit code ${result.code}: ${command}\n${
              result.stderr || result.stdout
            }`,
          );
          (error as Error & { result?: SshCommandResult }).result = result;
          reject(error);
          return;
        }

        resolve(result);
      };

      const fail = (error: unknown) => {
        if (settled) {
          return;
        }
        settled = true;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        client.end();
        reject(error instanceof Error ? error : new Error(String(error)));
      };

      if (options.timeoutMs && options.timeoutMs > 0) {
        timeoutHandle = setTimeout(() => {
          client.destroy();
          fail(
            new Error(
              `SSH command timed out after ${options.timeoutMs}ms: ${command}`,
            ),
          );
        }, options.timeoutMs);
      }

      client
        .on("ready", () => {
          client.exec(
            command,
            { pty: options.pty ?? false },
            (error: unknown, stream: any) => {
              if (error) {
                fail(error);
                return;
              }

              stream.on("data", (chunk: unknown) => {
                stdout += decodeOutputChunk(chunk);
              });
              stream.stderr.on("data", (chunk: unknown) => {
                stderr += decodeOutputChunk(chunk);
              });
              stream.on(
                "close",
                (code: number | null, signal: string | null) => {
                  finish({
                    code: code ?? null,
                    command,
                    signal: signal ?? null,
                    stderr,
                    stdout,
                  });
                },
              );
            },
          );
        })
        .on("error", (error: unknown) => fail(error))
        .connect({
          host: this.serverHost,
          keepaliveInterval: 5_000,
          password,
          port: this.port,
          readyTimeout: options.timeoutMs ?? 20_000,
          tryKeyboard: false,
          username: this.username,
        });
    });
  }
}

export class DeployAppSshServer {
  static fragment = graphql`
    fragment srcDeployAppSshServerData on AppSshServer {
      id
      enabled
      users(first: 50) {
        edges {
          node {
            ...srcDeployAppSshUserData
          }
        }
      }
    }
  `;
  id!: string;
  enabled!: boolean;
  users!: DeployAppSshUser[];

  constructor(data: srcDeployAppSshServerData$data) {
    this.applyData(data);
  }

  private applyData(data: srcDeployAppSshServerData$data) {
    this.id = data.id;
    this.enabled = data.enabled;
    this.users = data.users.edges
      .map((edge) => edge?.node)
      .filter((node) => node !== null && node !== undefined)
      .map(
        (node) =>
          new DeployAppSshUser(
            getFragmentData<srcDeployAppSshUserData$data>(
              environment(),
              nodeSshUser,
              node,
            ),
          ),
      );
  }
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

class DeployAppKindWordPress extends DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKindWordPress on Kind {
      ... on WordpressAppKind {
        adminUrl
      }
    }
  `;
  adminUrl?: string;
  constructor(data: srcDeployAppKindWordPress$data) {
    super();
    this.adminUrl = data.adminUrl;
  }
}

enum AppAliasVerificationStates {
  UNVERIFIED = "UNVERIFIED",
  VERIFIED = "VERIFIED",
  APEX_WITHOUT_REDIRECTION = "APEX_WITHOUT_REDIRECTION",
}
enum HTTPRedirectType {
  PERMANENT = "PERMANENT",
  TEMPORARY = "TEMPORARY",
}

class AppAlias {
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
  url: string;
  state: AppAliasVerificationStates;
  redirectionHttpCode: HTTPRedirectType;
  redirectsFromIds: string[];
  redirectsToId: string | undefined;
  async retrieveMany(ids: string[]): Promise<AppAlias[]> {
    let env = environment();
    let query = await fetchQuery<srcGetAppAliasesQuery>(
      env,
      graphql`
        query srcGetAppAliasesQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            ...srcAppAlias
          }
        }
      `,
      {
        ids: ids,
      },
    ).toPromise();
    return (
      query?.nodes?.map(
        (node: any) =>
          new AppAlias(
            getFragmentData<srcAppAlias$data>(env, nodeAppAlias, node),
          ),
      ) || []
    );
  }
  async retrieve(id: string): Promise<AppAlias | undefined> {
    let aliases = await this.retrieveMany([id]);
    return aliases[0];
  }
  get redirectsFrom(): Promise<AppAlias[]> {
    return this.retrieveMany(this.redirectsFromIds);
  }
  get redirectsTo(): Promise<AppAlias | undefined> {
    if (!this.redirectsToId) {
      return Promise.resolve(undefined);
    }
    return this.retrieve(this.redirectsToId);
  }
  expectedDnsRecords: { host: string; recordType: string; value: string }[];
  firstCheckedAt: Date;
  lastCheckedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  constructor(data: srcAppAlias$data) {
    this.id = data.id;
    this.url = data.url;
    this.state =
      AppAliasVerificationStates[
        data.state as "UNVERIFIED" | "VERIFIED" | "APEX_WITHOUT_REDIRECTION"
      ];
    this.redirectionHttpCode =
      HTTPRedirectType[data.redirectionHttpCode as "PERMANENT" | "TEMPORARY"];
    this.redirectsFromIds =
      data.redirectsFrom?.map((redirect) => redirect?.id!) || [];
    this.redirectsToId = data.redirectsTo?.id;
    this.expectedDnsRecords = data.expectedDnsRecords as any;
    this.firstCheckedAt = data.firstCheckedAt;
    this.lastCheckedAt = data.lastCheckedAt;
    this.updatedAt = data.updatedAt;
    this.createdAt = data.createdAt;
  }
  verify(): Promise<boolean> {
    const env = environment();
    return new Promise((resolve, reject) => {
      commitMutation<srcVerifyAppDomainMutation>(env, {
        mutation: graphql`
          mutation srcVerifyAppDomainMutation($input: VerifyAppDomainInput!) {
            verifyAppDomain(input: $input) {
              verified
            }
          }
        `,
        onCompleted: (response, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
          }
          if (response.verifyAppDomain) {
            resolve(response.verifyAppDomain.verified);
          } else {
            reject(
              new Error(
                "Failed to verify domain, mutation was not successful.",
              ),
            );
          }
        },
        onError: (error) => {
          reject(error.message.toString());
        },
        variables: {
          input: {
            domainId: this.id,
          },
        },
      });
    });
  }
  delete(): Promise<void> {
    const env = environment();
    return new Promise((resolve, reject) => {
      commitMutation<srcDeleteAppDomainMutation>(env, {
        mutation: graphql`
          mutation srcDeleteAppDomainMutation($input: DeleteAppDomainInput!) {
            deleteAppDomain(input: $input) {
              success
            }
          }
        `,
        onCompleted: (response, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
          }
          if (response.deleteAppDomain?.success) {
            resolve();
          } else {
            reject(
              new Error(
                "Failed to delete domain, mutation was not successful.",
              ),
            );
          }
        },
        onError: (error) => {
          reject(error.message.toString());
        },
        variables: {
          input: {
            id: this.id,
          },
        },
      });
    });
  }
}

class DeployApp {
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
      sshServer {
        ...srcDeployAppSshServerData
      }
      # managed
      # kind {
      #   __typename
      #   ...srcDeployAppKind
      # }
    }
  `;
  id!: string;
  willPerishAt!: Date | null;
  name!: string;
  url!: string;
  adminUrl!: string;
  domains: AppAlias[];
  favicon!: string;
  screenshot!: string;
  sshServer: DeployAppSshServer | null;
  activeVersion: DeployAppVersion | null;
  // managed: boolean;
  // kind: DeployAppKind | null = null;
  constructor(data: srcDeployAppData$data) {
    this.sshServer = null;
    this.activeVersion = null;
    this.domains = [];
    this.applyData(data);
    // this.managed = data.managed;
    // if (data.kind?.__typename === "WordPressAppKind") {
    //   let kindData = getFragmentData<srcDeployAppKindWordPress$data>(environment(), nodeApp, data.kind);
    //   this.kind = new DeployAppKindWordPress(kindData);
    // }
  }

  private applyData(data: srcDeployAppData$data) {
    this.id = data.id;
    this.willPerishAt = data.willPerishAt ? new Date(data.willPerishAt) : null;
    this.name = data.name;
    this.url = data.url;
    this.adminUrl = data.adminUrl;
    this.domains = data.domains.edges.map(
      (edge) =>
        new AppAlias(
          getFragmentData<srcAppAlias$data>(
            environment(),
            nodeAppAlias,
            edge?.node,
          ),
        ),
    );
    this.favicon = data.favicon;
    this.screenshot = data.screenshot;
    this.activeVersion = data.activeVersion
      ? new DeployAppVersion(data.activeVersion as any, this)
      : null;
    this.sshServer = data.sshServer
      ? new DeployAppSshServer(
          getFragmentData<srcDeployAppSshServerData$data>(
            environment(),
            nodeSshServer,
            data.sshServer,
          ),
        )
      : null;
  }
  async upsertDomain(domain: string): Promise<AppAlias> {
    const env = environment();
    let query: any = await new Promise((resolve, reject) => {
      commitMutation<srcUpsertAppDomainMutation>(env, {
        mutation: graphql`
          mutation srcUpsertAppDomainMutation($input: UpsertAppDomainInput!) {
            upsertAppDomain(input: $input) {
              success
              domains {
                ...srcAppAlias
              }
            }
          }
        `,
        onCompleted: (response, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
          }
          if (!response.upsertAppDomain) {
            reject(new Error("Failed to upsert domain, mutation failed."));
            return;
          }
          if (response.upsertAppDomain?.success) {
            const domains = response.upsertAppDomain.domains;
            if (!domains) {
              reject(
                new Error("Failed to upsert domain, no domains returned."),
              );
              return;
            }
            var addedDomain: AppAlias | null = null;
            for (const returnedDomain of domains) {
              let appAliasData = getFragmentData<srcAppAlias$data>(
                env,
                nodeAppAlias,
                returnedDomain,
              );
              const appAlias = new AppAlias(appAliasData);
              if (
                appAlias.expectedDnsRecords.find(
                  (record) => record.host == domain,
                )
              ) {
                addedDomain = appAlias;
              }
              this.domains.push(appAlias);
            }

            if (!addedDomain) {
              reject(
                new Error(
                  "Failed to upsert domain, domain not found in returned domains.",
                ),
              );
              return;
            }
            this.domains.push(addedDomain);
            resolve(addedDomain);
          } else {
            reject(
              new Error(
                "Failed to upsert domain, mutation was not successful.",
              ),
            );
          }
        },
        onError: (error) => {
          reject(error.message.toString());
        },
        variables: {
          input: {
            appId: this.id,
            name: domain,
            wait: false,
          },
        },
      });
    });
    return query;
  }

  async toggleSsh(enabled: boolean): Promise<DeployAppSshServer> {
    const response = await commitMutationAsync<srcToggleSshServerMutation>(
      graphql`
        mutation srcToggleSshServerMutation($input: ToggleSshServerInput!) {
          toggleSshServer(input: $input) {
            app {
              ...srcDeployAppData
            }
          }
        }
      `,
      { input: { appId: this.id, enabled } },
      `SSH could not be ${enabled ? "enabled" : "disabled"} for this app`,
    );

    const appData = getFragmentData<srcDeployAppData$data>(
      environment(),
      nodeApp,
      response.toggleSshServer!.app,
    );
    this.applyData(appData);

    if (!this.sshServer) {
      throw new Error(
        "The app did not return an SSH server after toggling SSH.",
      );
    }

    return this.sshServer;
  }

  async enableSsh(): Promise<DeployAppSshServer> {
    return this.toggleSsh(true);
  }

  async disableSsh(): Promise<DeployAppSshServer> {
    return this.toggleSsh(false);
  }

  async generateSshToken(): Promise<string> {
    const response = await commitMutationAsync<srcGenerateSshTokenMutation>(
      graphql`
        mutation srcGenerateSshTokenMutation($input: GenerateSshTokenInput!) {
          generateSshToken(input: $input) {
            token
          }
        }
      `,
      { input: { appId: this.id } },
      "An SSH token could not be generated for this app",
    );

    return response.generateSshToken!.token;
  }
}

enum LogStream {
  RUNTIME = "RUNTIME",
  STDERR = "STDERR",
  STDOUT = "STDOUT",
}

type Log = {
  datetime: Date;
  instanceId: string;
  message: string;
  stream: LogStream;
  timestamp: number;
};

class DeployAppVersion {
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
  constructor(data: srcDeployAppVersionData$data, app?: DeployApp) {
    this.id = data.id;
    if (!app) {
      let appData = getFragmentData<srcDeployAppData$data>(
        environment(),
        nodeApp,
        data.app,
      );
      app = new DeployApp(appData);
    }
    this.app = app;
  }

  async fetchLogs(since: Date, first = 100): Promise<Log[]> {
    const env = environment();
    let query = await fetchQuery<srcGetAppLogsQuery>(
      env,
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
        appId: this.id,
        since: since.toISOString(),
        first,
      },
    ).toPromise();
    return (
      (query?.node?.logs?.edges
        .filter((edge) => edge?.node)
        .map((edge) => edge?.node) as Log[]) || []
    );
  }
}
function getFragmentData<T>(
  environment: Environment,
  node: ReaderFragment,
  fetchedData: any,
): T {
  let selector = getSelector(node, fetchedData);
  return environment.lookup(selector as any).data as any;
}

async function commitMutationAsync<T extends MutationParameters>(
  mutation: any,
  variables: Record<string, unknown>,
  errorPrefix: string,
): Promise<T["response"]> {
  const env = environment();

  return await new Promise((resolve, reject) => {
    commitMutation<T>(env, {
      mutation,
      onCompleted: (
        response: any,
        errors: readonly { message: string }[] | null | undefined,
      ) => {
        if (errors && errors.length > 0) {
          reject(new Error(`${errorPrefix}: ${errors[0].message.toString()}`));
          return;
        }
        resolve(response as T["response"]);
      },
      onError: (error: Error) => {
        reject(new Error(`${errorPrefix}: ${error.message.toString()}`));
      },
      variables,
    });
  });
}

export type AutoBuildProgressData = {
  kind: string;
  message: string | undefined | null;
  datetime: string;
  stream: string | undefined | null;
};

export type Viewer = {
  username: string;
};

class AutobuildApp {
  buildId: string;
  appVersion: DeployAppVersion | null = null;
  subscription: any;
  pendingLogs: AutoBuildProgressData[] = [];
  onProgress: ((data: AutoBuildProgressData) => void) | null = null;
  completedPromise: Promise<DeployAppVersion> | null = null;
  constructor(buildId: string) {
    this.buildId = buildId;
    this.completedPromise = new Promise((resolve, reject) => {
      const env = environment();
      this.subscription = requestSubscription<srcAutobuildSubscription>(env, {
        subscription: graphql`
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
        variables: {
          buildId: this.buildId,
        },
        onNext: (data) => {
          // console.log(data);
          if (!data?.autobuildDeployment) {
            return;
          }
          const { kind, message, appVersion, datetime, stream } =
            data?.autobuildDeployment!;

          if (kind === "FAILED") {
            reject(message);
            return;
          } else if (kind === "COMPLETE") {
            if (appVersion !== undefined) {
              let appVersionData =
                getFragmentData<srcDeployAppVersionData$data>(
                  env,
                  nodeAppVersion,
                  appVersion,
                );
              this.appVersion = new DeployAppVersion(appVersionData);
              resolve(this.appVersion);
              return;
            } else {
              reject(
                new Error(
                  "Error when building the app: build finished without deployed app",
                ),
              );
              return;
            }
          }
          if (this.onProgress) {
            this.onProgress({ kind, message, datetime, stream });
          } else {
            this.pendingLogs.push({ kind, message, datetime, stream });
          }
        },
        onCompleted: () => {
          this.onProgress = null;
          this.subscription.dispose();
          if (!this.appVersion) {
            reject(
              new Error(
                "Error when building the app: build finished without deployed app",
              ),
            );
          } else {
            resolve(this.appVersion);
            return;
          }
        },
        onError: (error) => {
          console.error(error);
          reject(error);
        },
      });
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
    let app = await this.completedPromise;
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
    if (!app) {
      throw new Error(
        "Error when building the app: build finished without deployed app",
      );
    }
    return app;
  }
}

export class StackMachine {
  environment: Environment;

  private constructor(environment: Environment) {
    this.environment = environment;
  }

  static async init(settings: StackMachineRegistryConfig) {
    const environment = createEnvironment({
      endpoint: settings.apiUrl || DEFAULT_API_URL,
      token: settings.token,
    });
    config = {
      environment,
    };
    return new StackMachine(environment);
  }

  async viewer(): Promise<Viewer | null> {
    const env = environment();
    const query = await fetchQuery<srcViewerQuery>(
      env,
      graphql`
        query srcViewerQuery {
          viewer {
            username
          }
        }
      `,
      {},
    ).toPromise();
    if (!query?.viewer) {
      return null;
    }
    return {
      username: query.viewer.username,
    };
  }

  async getApp(
    input: srcGetAppByNameQuery$variables | srcGetAppByIdQuery$variables,
  ): Promise<DeployApp | null> {
    const env = environment();
    if ("id" in input) {
      // We fetch by id
      let query = await fetchQuery<srcGetAppByIdQuery>(
        env,
        graphql`
          query srcGetAppByIdQuery($id: ID!) {
            app: node(id: $id) {
              __typename
              ...srcDeployAppData
            }
          }
        `,
        {
          id: input.id!,
        },
      ).toPromise();
      if (!query?.app || query.app.__typename !== "DeployApp") {
        return null;
      }
      let appData = getFragmentData<srcDeployAppData$data>(
        environment(),
        nodeApp,
        query.app,
      );
      return new DeployApp(appData);
    } else {
      // We fetch by name
      let query = await fetchQuery<srcGetAppByNameQuery>(
        env,
        graphql`
          query srcGetAppByNameQuery($name: String!, $owner: String) {
            app: getDeployApp(name: $name, owner: $owner) {
              ...srcDeployAppData
            }
          }
        `,
        {
          name: input.name,
          owner: input.owner,
        },
      ).toPromise();
      if (!query?.app) {
        return null;
      }
      let appData = getFragmentData<srcDeployAppData$data>(
        environment(),
        nodeApp,
        query.app,
      );
      return new DeployApp(appData);
    }
  }

  async deleteApp(
    input: srcDeleteAppMutation$variables["input"],
  ): Promise<void> {
    const env = environment();
    let success: any = await new Promise((resolve, reject) => {
      commitMutation<srcDeleteAppMutation>(env, {
        mutation: graphql`
          mutation srcDeleteAppMutation($input: DeleteAppInput!) {
            deleteApp(input: $input) {
              success
            }
          }
        `,
        onCompleted: (response, errors) => {
          if (errors && errors.length > 0) {
            reject(
              `The app could not be deleted: ${errors[0].message.toString()}`,
            );
            return;
          }
          resolve(response.deleteApp?.success);
        },
        onError: (error) => {
          reject(`The app could not be deleted: ${error.message.toString()}`);
        },
        variables: {
          input,
        },
      });
    });
    return success;
  }

  async uploadFile(
    file: Blob,
    setUploadFilesProgress?: (progress: number) => void,
  ): Promise<string> {
    const env = environment();
    const url = await handleUploadFileToCloud(
      env,
      file,
      setUploadFilesProgress,
    );
    return url;
  }

  async deployApp(
    input: srcAutobuildMutation$variables["input"],
  ): Promise<AutobuildApp> {
    const env = environment();
    let query: any = await new Promise((resolve, reject) => {
      commitMutation<srcAutobuildMutation>(env, {
        mutation: graphql`
          mutation srcAutobuildMutation($input: DeployViaAutobuildInput!) {
            deployViaAutobuild(input: $input) {
              success
              buildId
            }
          }
        `,
        onCompleted: (response, errors) => {
          if (errors && errors.length > 0) {
            reject(
              `The app could not be built: ${errors[0].message.toString()}`,
            );
            return;
          }
          resolve(response);
        },
        onError: (error) => {
          reject(`The app could not be built: ${error.message.toString()}`);
        },
        variables: {
          input,
        },
      });
    });
    // console.log(query.deployViaAutobuild.buildId);
    const app = new AutobuildApp(query.deployViaAutobuild.buildId);
    return app;
  }
}

// export const init = async (settings: StackMachineRegistryConfig) => {
//   const environment = createEnvironment({endpoint: settings.registryUrl || "https://registry.wasmer.wtf/graphql", token: settings.token});
//   config = {
//     environment
//   };
// }
// const fetchFn: FetchFunction = function (request, variables) {
//   return new Observable.create(source => {
//     fetch('/my-graphql-api', {
//       method: 'POST',
//       body: JSON.stringify({
//         text: request.text,
//         variables,
//       }),
//     })
//       .then(response => response.json())
//       .then(data => source.next(data));
//   });
// };

// const network = Network.create(fetchFn);
// const store = new Store(new RecordSource());
// const environment = new Environment({
//   network,
//   store,
// });
