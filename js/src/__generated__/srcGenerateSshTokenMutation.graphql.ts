/**
 * @generated SignedSource<<64406455046ec7a24d9915d9b9e57029>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type GenerateSshTokenInput = {
  appId?: string | null | undefined;
  clientMutationId?: string | null | undefined;
};
export type srcGenerateSshTokenMutation$variables = {
  input: GenerateSshTokenInput;
};
export type srcGenerateSshTokenMutation$data = {
  readonly generateSshToken: {
    readonly token: string;
  } | null | undefined;
};
export type srcGenerateSshTokenMutation = {
  response: srcGenerateSshTokenMutation$data;
  variables: srcGenerateSshTokenMutation$variables;
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
    "concreteType": "GenerateSshTokenPayload",
    "kind": "LinkedField",
    "name": "generateSshToken",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "token",
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
    "name": "srcGenerateSshTokenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGenerateSshTokenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e643023e6ef35377cdecd3608bf299d4",
    "id": null,
    "metadata": {},
    "name": "srcGenerateSshTokenMutation",
    "operationKind": "mutation",
    "text": "mutation srcGenerateSshTokenMutation(\n  $input: GenerateSshTokenInput!\n) {\n  generateSshToken(input: $input) {\n    token\n  }\n}\n"
  }
};
})();

(node as any).hash = "2cf35df16880ccc9c750353f0df96990";

export default node;
