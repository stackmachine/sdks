import {
  srcAutobuildMutation,
  srcAutobuildMutation$variables,
} from "__generated__/srcAutobuildMutation.graphql";
import { createEnvironment } from "./environment";
import RelayRuntime, { ReaderFragment, type Environment } from "relay-runtime";
import { srcAutobuildSubscription } from "__generated__/srcAutobuildSubscription.graphql";
import nodeApp, {
  srcDeployAppData$data,
} from "__generated__/srcDeployAppData.graphql";
import nodeAppVersion, {
  srcDeployAppVersionData$data,
} from "__generated__/srcDeployAppVersionData.graphql";
import { srcDeployAppKindWordPress$data } from "__generated__/srcDeployAppKindWordPress.graphql";
import {
  srcDeleteAppMutation,
  srcDeleteAppMutation$variables,
} from "__generated__/srcDeleteAppMutation.graphql";
import { srcGetAppByNameQuery } from "__generated__/srcGetAppByNameQuery.graphql";
import { srcGetAppByIdQuery } from "__generated__/srcGetAppByIdQuery.graphql";
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
  apiKey?: string;
  token?: string;
};

let config: {
  environment: Environment;
} | null = null;

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
  favicon: string;
  screenshot: string;
  activeVersion: DeployAppVersion | null;
  // managed: boolean;
  // kind: DeployAppKind | null = null;
  constructor(data: srcDeployAppData$data) {
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
    // this.managed = data.managed;
    // if (data.kind?.__typename === "WordPressAppKind") {
    //   let kindData = getFragmentData<srcDeployAppKindWordPress$data>(environment(), nodeApp, data.kind);
    //   this.kind = new DeployAppKindWordPress(kindData);
    // }
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
}

enum SshAuthenticationMethod {
  PASSWORD = "PASSWORD",
  PUBLIC_KEY = "PUBLIC_KEY",
}

class SshAuthorizedKey {
  id: string;
  name: string | null;
  publicKey: string;
  createdAt: Date;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name || null;
    this.publicKey = data.publicKey;
    this.createdAt = new Date(data.createdAt);
  }
}

class SshUser {
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
          (method: "PASSWORD" | "PUBLIC_KEY") =>
            SshAuthenticationMethod[method],
        )
      : null;
  }
}

class AppSshServer {
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

function getFragmentData<T>(
  environment: Environment,
  node: ReaderFragment,
  fetchedData: any,
): T {
  let selector = getSelector(node, fetchedData);
  return environment.lookup(selector as any).data as any;
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

class AppsDomainsResource {
  private async retrieveMany(ids: string[]): Promise<AppAlias[]> {
    const env = environment();
    const query = await fetchQuery<srcGetAppAliasesQuery>(
      env,
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

  async retrieve(id: string): Promise<AppAlias | null> {
    const aliases = await this.retrieveMany([id]);
    return aliases[0] || null;
  }

  async create(input: { app: string; hostname: string }): Promise<AppAlias> {
    const env = environment();
    return new Promise((resolve, reject) => {
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
            return;
          }
          if (!response.upsertAppDomain) {
            reject(new Error("Failed to create domain, mutation failed."));
            return;
          }
          if (response.upsertAppDomain.success) {
            const domains = response.upsertAppDomain.domains;
            if (!domains) {
              reject(
                new Error("Failed to create domain, no domains returned."),
              );
              return;
            }
            let addedDomain: AppAlias | null = null;
            for (const returnedDomain of domains) {
              const appAliasData = getFragmentData<srcAppAlias$data>(
                env,
                nodeAppAlias,
                returnedDomain,
              );
              const appAlias = new AppAlias(appAliasData);
              if (
                appAlias.expectedDnsRecords.find(
                  (record) => record.host === input.hostname,
                )
              ) {
                addedDomain = appAlias;
              }
            }
            if (!addedDomain) {
              reject(
                new Error(
                  "Failed to create domain, domain not found in returned domains.",
                ),
              );
              return;
            }
            resolve(addedDomain);
          } else {
            reject(
              new Error(
                "Failed to create domain, mutation was not successful.",
              ),
            );
          }
        },
        onError: (error) => {
          reject(error.message.toString());
        },
        variables: {
          input: {
            appId: input.app,
            name: input.hostname,
            wait: false,
          },
        },
      });
    });
  }

  async verify(id: string): Promise<boolean> {
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
            return;
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
            domainId: id,
          },
        },
      });
    });
  }

  async del(id: string): Promise<void> {
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
            return;
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
            id,
          },
        },
      });
    });
  }
}

class AppsVersionsLogsResource {
  async list(input: {
    version: string;
    since: Date;
    first?: number;
  }): Promise<Log[]> {
    const env = environment();
    const query = await fetchQuery<srcGetAppLogsQuery>(
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
        appId: input.version,
        since: input.since.toISOString(),
        first: input.first ?? 100,
      },
    ).toPromise();
    return (
      (query?.node?.logs?.edges
        .filter((edge) => edge?.node)
        .map((edge) => edge?.node) as Log[]) || []
    );
  }
}

class AppsVersionsResource {
  logs: AppsVersionsLogsResource;
  constructor() {
    this.logs = new AppsVersionsLogsResource();
  }
}

class AppsSshUsersPasswordsResource {
  async reveal(
    userId: string,
  ): Promise<{ password: string | null; sshUser: SshUser }> {
    const env = environment();
    const response: any = await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
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
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          resolve(payload);
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          input: { sshUserId: userId },
        },
      });
    });
    const payload = response?.revealSshUserPassword;
    if (!payload?.sshUser) {
      throw new Error("Failed to reveal SSH user password.");
    }
    return {
      password: payload.password || null,
      sshUser: new SshUser(payload.sshUser),
    };
  }

  async rotate(
    userId: string,
  ): Promise<{ password: string; sshUser: SshUser }> {
    const env = environment();
    const response: any = await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
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
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          resolve(payload);
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          input: { sshUserId: userId },
        },
      });
    });
    const payload = response?.rotateSshUserPassword;
    if (!payload?.sshUser) {
      throw new Error("Failed to rotate SSH user password.");
    }
    return {
      password: payload.password,
      sshUser: new SshUser(payload.sshUser),
    };
  }
}

class AppsSshUsersAuthorizedKeysResource {
  async list(input: { user: string }): Promise<SshAuthorizedKey[]> {
    const env = environment();
    const query = await fetchQuery<any>(
      env,
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
    ).toPromise();

    return (
      query?.node?.authorizedKeys?.edges
        ?.map((edge: any) => edge?.node)
        .filter((node: any) => !!node)
        .map((node: any) => new SshAuthorizedKey(node)) || []
    );
  }

  async create(input: {
    user: string;
    publicKey: string;
    name?: string;
  }): Promise<SshAuthorizedKey> {
    const env = environment();
    const response: any = await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
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
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          resolve(payload);
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          input: {
            sshUserId: input.user,
            publicKey: input.publicKey,
            name: input.name,
          },
        },
      });
    });
    const keyData = response?.addSshAuthorizedKey?.authorizedKey;
    if (!keyData) {
      throw new Error("Failed to add SSH authorized key.");
    }
    return new SshAuthorizedKey(keyData);
  }

  async del(input: { user: string; name: string }): Promise<void> {
    const env = environment();
    await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
          mutation srcDeleteSshAuthorizedKeyMutation(
            $input: DeleteSshAuthorizedKeyInput!
          ) {
            deleteSshAuthorizedKey(input: $input) {
              success
            }
          }
        `,
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          if (payload?.deleteSshAuthorizedKey?.success) {
            resolve(payload);
            return;
          }
          reject(new Error("Failed to delete SSH authorized key."));
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          // TODO: support key deletion by authorized-key ID when backend exposes it.
          input: { sshUserId: input.user, name: input.name },
        },
      });
    });
  }
}

class AppsSshUsersResource {
  passwords: AppsSshUsersPasswordsResource;
  authorizedKeys: AppsSshUsersAuthorizedKeysResource;
  constructor() {
    this.passwords = new AppsSshUsersPasswordsResource();
    this.authorizedKeys = new AppsSshUsersAuthorizedKeysResource();
  }

  async list(input: { app: string }): Promise<SshUser[]> {
    const env = environment();
    const query = await fetchQuery<any>(
      env,
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
    ).toPromise();

    return (
      query?.node?.sshServer?.users?.edges
        ?.map((edge: any) => edge?.node)
        .filter((node: any) => !!node)
        .map((node: any) => new SshUser(node)) || []
    );
  }

  async retrieve(id: string): Promise<SshUser | null> {
    const env = environment();
    const query = await fetchQuery<any>(
      env,
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
    ).toPromise();
    if (!query?.node || query.node.__typename !== "SshUser") {
      return null;
    }
    return new SshUser(query.node);
  }

  async update(
    id: string,
    input: {
      username?: string;
      sftpRootFolder?: string;
      authenticationMethods?: SshAuthenticationMethod[];
    },
  ): Promise<SshUser> {
    const env = environment();
    const response: any = await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
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
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          resolve(payload);
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          input: {
            id,
            username: input.username,
            sftpRootFolder: input.sftpRootFolder,
            authenticationMethods: input.authenticationMethods,
          },
        },
      });
    });
    const userData = response?.editSshUser?.sshUser;
    if (!userData) {
      throw new Error("Failed to update SSH user.");
    }
    return new SshUser(userData);
  }
}

class AppsSshTokensResource {
  async create(input: { app: string }): Promise<{ token: string }> {
    const env = environment();
    const response: any = await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
          mutation srcGenerateSshTokenMutation($input: GenerateSshTokenInput!) {
            generateSshToken(input: $input) {
              token
            }
          }
        `,
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          resolve(payload);
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          input: {
            appId: input.app,
          },
        },
      });
    });
    const token = response?.generateSshToken?.token;
    if (!token) {
      throw new Error("Failed to generate SSH token.");
    }
    return { token };
  }
}

class AppsSshResource {
  tokens: AppsSshTokensResource;
  users: AppsSshUsersResource;
  constructor() {
    this.tokens = new AppsSshTokensResource();
    this.users = new AppsSshUsersResource();
  }

  async retrieve(appId: string): Promise<AppSshServer | null> {
    const env = environment();
    const query = await fetchQuery<any>(
      env,
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
    ).toPromise();
    if (!query?.node?.sshServer) {
      return null;
    }
    return new AppSshServer(query.node.sshServer);
  }

  async update(
    appId: string,
    input: { enabled: boolean },
  ): Promise<AppSshServer> {
    const env = environment();
    const response: any = await new Promise((resolve, reject) => {
      commitMutation<any>(env, {
        mutation: graphql`
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
        onCompleted: (payload, errors) => {
          if (errors && errors.length > 0) {
            reject(errors[0].message.toString());
            return;
          }
          resolve(payload);
        },
        onError: (error) => reject(error.message.toString()),
        variables: {
          input: {
            appId,
            enabled: input.enabled,
          },
        },
      });
    });
    const sshServer = response?.toggleSshServer?.sshServer;
    if (!sshServer) {
      throw new Error("Failed to update SSH server.");
    }
    return new AppSshServer(sshServer);
  }
}

class DeployAppsResource {
  domains: AppsDomainsResource;
  versions: AppsVersionsResource;
  ssh: AppsSshResource;
  constructor() {
    this.domains = new AppsDomainsResource();
    this.versions = new AppsVersionsResource();
    this.ssh = new AppsSshResource();
  }

  async retrieve(id: string): Promise<DeployApp | null> {
    const env = environment();
    const query = await fetchQuery<srcGetAppByIdQuery>(
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
        id,
      },
    ).toPromise();
    if (!query?.app || query.app.__typename !== "DeployApp") {
      return null;
    }
    const appData = getFragmentData<srcDeployAppData$data>(
      env,
      nodeApp,
      query.app,
    );
    return new DeployApp(appData);
  }

  async retrieveByName(
    name: string,
    owner?: string,
  ): Promise<DeployApp | null> {
    const env = environment();
    const query = await fetchQuery<srcGetAppByNameQuery>(
      env,
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
    ).toPromise();
    if (!query?.app) {
      return null;
    }
    const appData = getFragmentData<srcDeployAppData$data>(
      env,
      nodeApp,
      query.app,
    );
    return new DeployApp(appData);
  }

  async del(id: string): Promise<void> {
    const env = environment();
    await new Promise((resolve, reject) => {
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
          input: { id },
        },
      });
    });
  }

  async autobuild(
    input: srcAutobuildMutation$variables["input"],
  ): Promise<AutobuildApp> {
    const env = environment();
    const query: any = await new Promise((resolve, reject) => {
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
    return new AutobuildApp(query.deployViaAutobuild.buildId);
  }
}

class FilesResource {
  async upload(
    file: Blob,
    setUploadFilesProgress?: (progress: number) => void,
  ): Promise<string> {
    const env = environment();
    return handleUploadFileToCloud(env, file, setUploadFilesProgress);
  }
}

export class StackMachine {
  environment: Environment;
  apps: DeployAppsResource;
  files: FilesResource;
  private constructor(environment: Environment) {
    this.environment = environment;
    this.apps = new DeployAppsResource();
    this.files = new FilesResource();
  }
  static async init(settings: StackMachineRegistryConfig) {
    if (!settings.apiKey && settings.token) {
      console.log(
        "[stackmachine] `token` is deprecated. Please use `apiKey` instead.",
      );
    }
    const authToken = settings.apiKey || settings.token;
    const environment = createEnvironment({
      endpoint: settings.apiUrl || DEFAULT_API_URL,
      token: authToken,
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
