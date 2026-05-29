/**
 * @generated SignedSource<<e8c69752ab985c80ff65232f51df5990>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddSshAuthorizedKeyInput = {
  clientMutationId?: string | null | undefined;
  name?: string | null | undefined;
  publicKey: string;
  sshUserId: string;
};
export type srcAddSshAuthorizedKeyMutation$variables = {
  input: AddSshAuthorizedKeyInput;
};
export type srcAddSshAuthorizedKeyMutation$data = {
  readonly addSshAuthorizedKey: {
    readonly authorizedKey: {
      readonly createdAt: any;
      readonly id: string;
      readonly name: string | null | undefined;
      readonly publicKey: string;
    };
  } | null | undefined;
};
export type srcAddSshAuthorizedKeyMutation = {
  response: srcAddSshAuthorizedKeyMutation$data;
  variables: srcAddSshAuthorizedKeyMutation$variables;
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
    "concreteType": "AddSshAuthorizedKeyPayload",
    "kind": "LinkedField",
    "name": "addSshAuthorizedKey",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SshAuthorizedKey",
        "kind": "LinkedField",
        "name": "authorizedKey",
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "publicKey",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
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
    "name": "srcAddSshAuthorizedKeyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcAddSshAuthorizedKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c484c6941f8e0aa0a8ce349d75d9cceb",
    "id": null,
    "metadata": {},
    "name": "srcAddSshAuthorizedKeyMutation",
    "operationKind": "mutation",
    "text": "mutation srcAddSshAuthorizedKeyMutation(\n  $input: AddSshAuthorizedKeyInput!\n) {\n  addSshAuthorizedKey(input: $input) {\n    authorizedKey {\n      id\n      name\n      publicKey\n      createdAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f50fa1c49d5ea600d51aadd52d037594";

export default node;
