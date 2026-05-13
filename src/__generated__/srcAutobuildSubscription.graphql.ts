/**
 * @generated SignedSource<<3a7d12c3c6aef38446088ed3bc65ec13>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AutoBuildDeployAppLogKind = "BUILD_STATUS" | "COMPLETE" | "DEPLOY_STATUS" | "FAILED" | "FETCHING_PLAN_STATUS" | "LOG" | "PREPARING_TO_DEPLOY_STATUS" | "%future added value";
export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";
export type srcAutobuildSubscription$variables = {
  buildId: any;
};
export type srcAutobuildSubscription$data = {
  readonly autobuildDeployment: {
    readonly appVersion: {
      readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppVersionData">;
    } | null | undefined;
    readonly datetime: any;
    readonly kind: AutoBuildDeployAppLogKind;
    readonly message: string | null | undefined;
    readonly stream: LogStream | null | undefined;
  } | null | undefined;
};
export type srcAutobuildSubscription = {
  response: srcAutobuildSubscription$data;
  variables: srcAutobuildSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "buildId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "buildId",
    "variableName": "buildId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kind",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "datetime",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stream",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v9 = [
  (v6/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v11 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcAutobuildSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AutobuildLog",
        "kind": "LinkedField",
        "name": "autobuildDeployment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeployAppVersion",
            "kind": "LinkedField",
            "name": "appVersion",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcDeployAppVersionData"
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcAutobuildSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AutobuildLog",
        "kind": "LinkedField",
        "name": "autobuildDeployment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeployAppVersion",
            "kind": "LinkedField",
            "name": "appVersion",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "DeployApp",
                "kind": "LinkedField",
                "name": "app",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "willPerishAt",
                    "storageKey": null
                  },
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "adminUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AppAliasConnection",
                    "kind": "LinkedField",
                    "name": "domains",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppAliasEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AppAlias",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v6/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "hostname",
                                "storageKey": null
                              },
                              (v8/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "state",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "redirectionHttpCode",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AppAlias",
                                "kind": "LinkedField",
                                "name": "redirectsFrom",
                                "plural": true,
                                "selections": (v9/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AppAlias",
                                "kind": "LinkedField",
                                "name": "redirectsTo",
                                "plural": false,
                                "selections": (v9/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AppAliasDNSRecord",
                                "kind": "LinkedField",
                                "name": "expectedDnsRecords",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "host",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "recordType",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "value",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "firstCheckedAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lastCheckedAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "updatedAt",
                                "storageKey": null
                              },
                              (v10/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DeployAppVersion",
                    "kind": "LinkedField",
                    "name": "activeVersion",
                    "plural": false,
                    "selections": (v9/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "favicon",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "screenshot",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AppSshServer",
                    "kind": "LinkedField",
                    "name": "sshServer",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "enabled",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": (v11/*: any*/),
                        "concreteType": "SshUserConnection",
                        "kind": "LinkedField",
                        "name": "users",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SshUserEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SshUser",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v6/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "username",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "sftpRootFolder",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "port",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "serverHost",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "authenticationMethods",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": (v11/*: any*/),
                                    "concreteType": "SshAuthorizedKeyConnection",
                                    "kind": "LinkedField",
                                    "name": "authorizedKeys",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "SshAuthorizedKeyEdge",
                                        "kind": "LinkedField",
                                        "name": "edges",
                                        "plural": true,
                                        "selections": [
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "SshAuthorizedKey",
                                            "kind": "LinkedField",
                                            "name": "node",
                                            "plural": false,
                                            "selections": [
                                              (v6/*: any*/),
                                              (v10/*: any*/),
                                              (v7/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "publicKey",
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "authorizedKeys(first:50)"
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "users(first:50)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ae37ee7c94c64d4e02fab50b70d6d917",
    "id": null,
    "metadata": {},
    "name": "srcAutobuildSubscription",
    "operationKind": "subscription",
    "text": "subscription srcAutobuildSubscription(\n  $buildId: UUID!\n) {\n  autobuildDeployment(buildId: $buildId) {\n    appVersion {\n      ...srcDeployAppVersionData\n      id\n    }\n    kind\n    datetime\n    stream\n    message\n  }\n}\n\nfragment srcAppAlias on AppAlias {\n  id\n  hostname\n  url\n  state\n  redirectionHttpCode\n  redirectsFrom {\n    id\n  }\n  redirectsTo {\n    id\n  }\n  expectedDnsRecords {\n    host\n    recordType\n    value\n  }\n  firstCheckedAt\n  lastCheckedAt\n  updatedAt\n  createdAt\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  name\n  url\n  adminUrl\n  domains {\n    edges {\n      node {\n        ...srcAppAlias\n        id\n      }\n    }\n  }\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n  sshServer {\n    ...srcDeployAppSshServerData\n    id\n  }\n}\n\nfragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {\n  id\n  createdAt\n  name\n  publicKey\n}\n\nfragment srcDeployAppSshServerData on AppSshServer {\n  id\n  enabled\n  users(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshUserData\n        id\n      }\n    }\n  }\n}\n\nfragment srcDeployAppSshUserData on SshUser {\n  id\n  username\n  sftpRootFolder\n  port\n  serverHost\n  authenticationMethods\n  authorizedKeys(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshAuthorizedKeyData\n        id\n      }\n    }\n  }\n}\n\nfragment srcDeployAppVersionData on DeployAppVersion {\n  id\n  app {\n    ...srcDeployAppData\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a8fe1e8c1b2e7052cec0ce82b4c81ef8";

export default node;
