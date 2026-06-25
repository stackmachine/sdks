/**
 * @generated SignedSource<<6b9cd6afa8f328ac05cbe62d1996ece8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteAppDBInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type srcDeleteAppDatabaseMutation$variables = {
  input: DeleteAppDBInput;
};
export type srcDeleteAppDatabaseMutation$data = {
  readonly deleteAppDb: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteAppDatabaseMutation = {
  response: srcDeleteAppDatabaseMutation$data;
  variables: srcDeleteAppDatabaseMutation$variables;
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
    "concreteType": "DeleteAppDBPayload",
    "kind": "LinkedField",
    "name": "deleteAppDb",
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
    "name": "srcDeleteAppDatabaseMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteAppDatabaseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "27fd76c8fccec308c05d8eefb95262ce",
    "id": null,
    "metadata": {},
    "name": "srcDeleteAppDatabaseMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteAppDatabaseMutation(\n  $input: DeleteAppDBInput!\n) {\n  deleteAppDb(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "997619d736b7862c7670e10a85a9f8c7";

export default node;
