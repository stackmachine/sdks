/**
 * @generated SignedSource<<83bd64ecb75cb39d3648e6525e1153b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ToggleSshServerInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  enabled: boolean;
};
export type srcToggleSshServerMutation$variables = {
  input: ToggleSshServerInput;
};
export type srcToggleSshServerMutation$data = {
  readonly toggleSshServer: {
    readonly app: {
      readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
    };
  } | null | undefined;
};
export type srcToggleSshServerMutation = {
  response: srcToggleSshServerMutation$data;
  variables: srcToggleSshServerMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
    "name": "srcToggleSshServerMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ToggleSshServerPayload",
        "kind": "LinkedField",
        "name": "toggleSshServer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeployApp",
            "kind": "LinkedField",
            "name": "app",
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
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcToggleSshServerMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ToggleSshServerPayload",
        "kind": "LinkedField",
        "name": "toggleSshServer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeployApp",
            "kind": "LinkedField",
            "name": "app",
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3557db6237479482d1f7bfa870003181",
    "id": null,
    "metadata": {},
    "name": "srcToggleSshServerMutation",
    "operationKind": "mutation",
    "text": "mutation srcToggleSshServerMutation(\n  $input: ToggleSshServerInput!\n) {\n  toggleSshServer(input: $input) {\n    app {\n      ...srcDeployAppData\n      id\n    }\n  }\n}\n\nfragment srcAppAlias on AppAlias {\n  id\n  hostname\n  url\n  state\n  redirectionHttpCode\n  redirectsFrom {\n    id\n  }\n  redirectsTo {\n    id\n  }\n  expectedDnsRecords {\n    host\n    recordType\n    value\n  }\n  firstCheckedAt\n  lastCheckedAt\n  updatedAt\n  createdAt\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  name\n  url\n  adminUrl\n  domains {\n    edges {\n      node {\n        ...srcAppAlias\n        id\n      }\n    }\n  }\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n  sshServer {\n    ...srcDeployAppSshServerData\n    id\n  }\n}\n\nfragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {\n  id\n  createdAt\n  name\n  publicKey\n}\n\nfragment srcDeployAppSshServerData on AppSshServer {\n  id\n  enabled\n  users(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshUserData\n        id\n      }\n    }\n  }\n}\n\nfragment srcDeployAppSshUserData on SshUser {\n  id\n  username\n  sftpRootFolder\n  port\n  serverHost\n  authenticationMethods\n  authorizedKeys(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshAuthorizedKeyData\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0cad06362ea5941c912366830cd0a0b6";

export default node;
