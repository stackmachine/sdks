/**
 * @generated SignedSource<<d723d22a0f25c1bb2e6b88856feb763d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcGetAppByNameQuery$variables = {
  name: string;
  owner?: string | null | undefined;
};
export type srcGetAppByNameQuery$data = {
  readonly app: {
    readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
  } | null | undefined;
};
export type srcGetAppByNameQuery = {
  response: srcGetAppByNameQuery$data;
  variables: srcGetAppByNameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "owner"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v5 = [
  (v2/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v7 = [
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
    "name": "srcGetAppByNameQuery",
    "selections": [
      {
        "alias": "app",
        "args": (v1/*: any*/),
        "concreteType": "DeployApp",
        "kind": "LinkedField",
        "name": "getDeployApp",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "srcDeployAppData"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetAppByNameQuery",
    "selections": [
      {
        "alias": "app",
        "args": (v1/*: any*/),
        "concreteType": "DeployApp",
        "kind": "LinkedField",
        "name": "getDeployApp",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "willPerishAt",
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
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
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hostname",
                        "storageKey": null
                      },
                      (v4/*: any*/),
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
                        "selections": (v5/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppAlias",
                        "kind": "LinkedField",
                        "name": "redirectsTo",
                        "plural": false,
                        "selections": (v5/*: any*/),
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
                      (v6/*: any*/)
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
            "selections": (v5/*: any*/),
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
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "enabled",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v7/*: any*/),
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
                          (v2/*: any*/),
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
                            "args": (v7/*: any*/),
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
                                      (v2/*: any*/),
                                      (v6/*: any*/),
                                      (v3/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "a0d1f17553b8e6d43ddbb2f666605ca0",
    "id": null,
    "metadata": {},
    "name": "srcGetAppByNameQuery",
    "operationKind": "query",
    "text": "query srcGetAppByNameQuery(\n  $name: String!\n  $owner: String\n) {\n  app: getDeployApp(name: $name, owner: $owner) {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcAppAlias on AppAlias {\n  id\n  hostname\n  url\n  state\n  redirectionHttpCode\n  redirectsFrom {\n    id\n  }\n  redirectsTo {\n    id\n  }\n  expectedDnsRecords {\n    host\n    recordType\n    value\n  }\n  firstCheckedAt\n  lastCheckedAt\n  updatedAt\n  createdAt\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  name\n  url\n  adminUrl\n  domains {\n    edges {\n      node {\n        ...srcAppAlias\n        id\n      }\n    }\n  }\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n  sshServer {\n    ...srcDeployAppSshServerData\n    id\n  }\n}\n\nfragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {\n  id\n  createdAt\n  name\n  publicKey\n}\n\nfragment srcDeployAppSshServerData on AppSshServer {\n  id\n  enabled\n  users(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshUserData\n        id\n      }\n    }\n  }\n}\n\nfragment srcDeployAppSshUserData on SshUser {\n  id\n  username\n  sftpRootFolder\n  port\n  serverHost\n  authenticationMethods\n  authorizedKeys(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshAuthorizedKeyData\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c49663697ce7ade26a6e3e91807886b7";

export default node;
