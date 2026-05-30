/**
 * @generated SignedSource<<b27384ca1c3d0491a9ad8ac37a14ccaa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
export type EditSshUserInput = {
  authenticationMethods?: ReadonlyArray<SshAuthenticationMethod | null | undefined> | null | undefined;
  clientMutationId?: string | null | undefined;
  id: string;
  sftpRootFolder?: string | null | undefined;
  username?: string | null | undefined;
};
export type srcEditSshUserMutation$variables = {
  input: EditSshUserInput;
};
export type srcEditSshUserMutation$data = {
  readonly editSshUser: {
    readonly sshUser: {
      readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined>;
      readonly id: string;
      readonly port: number;
      readonly serverHost: string;
      readonly sftpRootFolder: string;
      readonly username: string;
    };
  } | null | undefined;
};
export type srcEditSshUserMutation = {
  response: srcEditSshUserMutation$data;
  variables: srcEditSshUserMutation$variables;
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
    "concreteType": "EditSshUserPayload",
    "kind": "LinkedField",
    "name": "editSshUser",
    "plural": false,
    "selections": [
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
    "name": "srcEditSshUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcEditSshUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e645a57ca9d1a1cbf37d8578cba9c111",
    "id": null,
    "metadata": {},
    "name": "srcEditSshUserMutation",
    "operationKind": "mutation",
    "text": "mutation srcEditSshUserMutation(\n  $input: EditSshUserInput!\n) {\n  editSshUser(input: $input) {\n    sshUser {\n      id\n      username\n      port\n      serverHost\n      sftpRootFolder\n      authenticationMethods\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7aaf2a445c64303825818b2181eb4f00";

export default node;
