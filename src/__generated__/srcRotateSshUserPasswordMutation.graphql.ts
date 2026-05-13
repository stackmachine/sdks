/**
 * @generated SignedSource<<8cb02ee2936b8173af78ab670a9e803c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RotateSshUserPasswordInput = {
  clientMutationId?: string | null | undefined;
  sshUserId: string;
};
export type srcRotateSshUserPasswordMutation$variables = {
  input: RotateSshUserPasswordInput;
};
export type srcRotateSshUserPasswordMutation$data = {
  readonly rotateSshUserPassword: {
    readonly password: string;
    readonly sshUser: {
      readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshUserData">;
    };
  } | null | undefined;
};
export type srcRotateSshUserPasswordMutation = {
  response: srcRotateSshUserPasswordMutation$data;
  variables: srcRotateSshUserPasswordMutation$variables;
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
  "name": "password",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcRotateSshUserPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RotateSshUserPasswordPayload",
        "kind": "LinkedField",
        "name": "rotateSshUserPassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "SshUser",
            "kind": "LinkedField",
            "name": "sshUser",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcDeployAppSshUserData"
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
    "name": "srcRotateSshUserPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RotateSshUserPasswordPayload",
        "kind": "LinkedField",
        "name": "rotateSshUserPassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "SshUser",
            "kind": "LinkedField",
            "name": "sshUser",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 50
                  }
                ],
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
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "createdAt",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
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
    ]
  },
  "params": {
    "cacheID": "c7cc33170a94c07f0761cb3c775fd33f",
    "id": null,
    "metadata": {},
    "name": "srcRotateSshUserPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation srcRotateSshUserPasswordMutation(\n  $input: RotateSshUserPasswordInput!\n) {\n  rotateSshUserPassword(input: $input) {\n    password\n    sshUser {\n      ...srcDeployAppSshUserData\n      id\n    }\n  }\n}\n\nfragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {\n  id\n  createdAt\n  name\n  publicKey\n}\n\nfragment srcDeployAppSshUserData on SshUser {\n  id\n  username\n  sftpRootFolder\n  port\n  serverHost\n  authenticationMethods\n  authorizedKeys(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshAuthorizedKeyData\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cfb0ff1fa6c714fd5c2459d5e211c2f0";

export default node;
