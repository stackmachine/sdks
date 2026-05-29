/**
 * @generated SignedSource<<fd4289038271a039792b28a124e371fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
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
      readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined> | null | undefined;
      readonly id: string;
      readonly port: number;
      readonly serverHost: string;
      readonly sftpRootFolder: string;
      readonly username: string;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RotateSshUserPasswordPayload",
    "kind": "LinkedField",
    "name": "rotateSshUserPassword",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "password",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SshUser",
        "kind": "LinkedField",
        "name": "sshUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
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
            "name": "sftpRootFolder",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "authenticationMethods",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcRotateSshUserPasswordMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcRotateSshUserPasswordMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ab09fb81026ba1f2dfa47ed66e490bdf",
    "id": null,
    "metadata": {},
    "name": "srcRotateSshUserPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation srcRotateSshUserPasswordMutation(\n  $input: RotateSshUserPasswordInput!\n) {\n  rotateSshUserPassword(input: $input) {\n    password\n    sshUser {\n      id\n      username\n      port\n      serverHost\n      sftpRootFolder\n      authenticationMethods\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "58bab4f55d6d702cd0bdb82899d7f6dd";

export default node;
