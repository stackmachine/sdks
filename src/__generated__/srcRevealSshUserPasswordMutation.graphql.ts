/**
 * @generated SignedSource<<ff3a3af1dbe47f529ceea3fe70b9611e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RevealSshUserPasswordInput = {
  clientMutationId?: string | null | undefined;
  sshUserId: string;
};
export type srcRevealSshUserPasswordMutation$variables = {
  input: RevealSshUserPasswordInput;
};
export type srcRevealSshUserPasswordMutation$data = {
  readonly revealSshUserPassword: {
    readonly password: string | null | undefined;
    readonly sshUser: {
      readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshUserData">;
    };
  } | null | undefined;
};
export type srcRevealSshUserPasswordMutation = {
  response: srcRevealSshUserPasswordMutation$data;
  variables: srcRevealSshUserPasswordMutation$variables;
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
    "name": "srcRevealSshUserPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RevealSshUserPasswordPayload",
        "kind": "LinkedField",
        "name": "revealSshUserPassword",
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
    "name": "srcRevealSshUserPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RevealSshUserPasswordPayload",
        "kind": "LinkedField",
        "name": "revealSshUserPassword",
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
    "cacheID": "36a1dc2d197bd5ab81fc985add91d27d",
    "id": null,
    "metadata": {},
    "name": "srcRevealSshUserPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation srcRevealSshUserPasswordMutation(\n  $input: RevealSshUserPasswordInput!\n) {\n  revealSshUserPassword(input: $input) {\n    password\n    sshUser {\n      ...srcDeployAppSshUserData\n      id\n    }\n  }\n}\n\nfragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {\n  id\n  createdAt\n  name\n  publicKey\n}\n\nfragment srcDeployAppSshUserData on SshUser {\n  id\n  username\n  sftpRootFolder\n  port\n  serverHost\n  authenticationMethods\n  authorizedKeys(first: 50) {\n    edges {\n      node {\n        ...srcDeployAppSshAuthorizedKeyData\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b2be2902364978380c3444f80386fd51";

export default node;
