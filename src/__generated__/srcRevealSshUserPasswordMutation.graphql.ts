/**
 * @generated SignedSource<<b4037752ca4b45ae967864c34da1e641>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
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
      readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined> | null | undefined;
      readonly id: string;
      readonly port: number;
      readonly serverHost: string;
      readonly sftpRootFolder: string;
      readonly username: string;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RevealSshUserPasswordPayload",
    "kind": "LinkedField",
    "name": "revealSshUserPassword",
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
    "name": "srcRevealSshUserPasswordMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcRevealSshUserPasswordMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8ac8f49340acdb273b93c2c9aec01063",
    "id": null,
    "metadata": {},
    "name": "srcRevealSshUserPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation srcRevealSshUserPasswordMutation(\n  $input: RevealSshUserPasswordInput!\n) {\n  revealSshUserPassword(input: $input) {\n    password\n    sshUser {\n      id\n      username\n      port\n      serverHost\n      sftpRootFolder\n      authenticationMethods\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2afcaf479f0ef72db6fb198d940c7480";

export default node;
