/**
 * @generated SignedSource<<35af07566868ca542605ec9477122a89>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
      readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshAuthorizedKeyData">;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcAddSshAuthorizedKeyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcDeployAppSshAuthorizedKeyData"
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
    "name": "srcAddSshAuthorizedKeyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "1850ba7529ff27362cbc399eb43e3ee1",
    "id": null,
    "metadata": {},
    "name": "srcAddSshAuthorizedKeyMutation",
    "operationKind": "mutation",
    "text": "mutation srcAddSshAuthorizedKeyMutation(\n  $input: AddSshAuthorizedKeyInput!\n) {\n  addSshAuthorizedKey(input: $input) {\n    authorizedKey {\n      ...srcDeployAppSshAuthorizedKeyData\n      id\n    }\n  }\n}\n\nfragment srcDeployAppSshAuthorizedKeyData on SshAuthorizedKey {\n  id\n  createdAt\n  name\n  publicKey\n}\n"
  }
};
})();

(node as any).hash = "b70e1e196c4d037d2ec34792ce2cce17";

export default node;
