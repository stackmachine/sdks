/**
 * @generated SignedSource<<d0b624fb0a5dba7e476b387f3cf8d8f9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteSshAuthorizedKeyByIdInput = {
  authorizedKeyId: string;
  clientMutationId?: string | null | undefined;
};
export type srcDeleteSshAuthorizedKeyByIdMutation$variables = {
  input: DeleteSshAuthorizedKeyByIdInput;
};
export type srcDeleteSshAuthorizedKeyByIdMutation$data = {
  readonly deleteSshAuthorizedKeyById: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteSshAuthorizedKeyByIdMutation = {
  response: srcDeleteSshAuthorizedKeyByIdMutation$data;
  variables: srcDeleteSshAuthorizedKeyByIdMutation$variables;
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
    "concreteType": "DeleteSshAuthorizedKeyPayload",
    "kind": "LinkedField",
    "name": "deleteSshAuthorizedKeyById",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "srcDeleteSshAuthorizedKeyByIdMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteSshAuthorizedKeyByIdMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ca982a28493f86e784a6d25ee2ac3a0d",
    "id": null,
    "metadata": {},
    "name": "srcDeleteSshAuthorizedKeyByIdMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteSshAuthorizedKeyByIdMutation(\n  $input: DeleteSshAuthorizedKeyByIdInput!\n) {\n  deleteSshAuthorizedKeyById(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "d4d6c5bc4e8fdffe9a80afd397efd720";

export default node;
