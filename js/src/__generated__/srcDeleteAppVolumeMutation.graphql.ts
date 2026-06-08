/**
 * @generated SignedSource<<7cc8fc9663b1fc1c08708d532226c129>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteAppVolumeInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type srcDeleteAppVolumeMutation$variables = {
  input: DeleteAppVolumeInput;
};
export type srcDeleteAppVolumeMutation$data = {
  readonly deleteAppVolume: {
    readonly success: boolean;
  };
};
export type srcDeleteAppVolumeMutation = {
  response: srcDeleteAppVolumeMutation$data;
  variables: srcDeleteAppVolumeMutation$variables;
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
  "name": "success",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcDeleteAppVolumeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteAppVolumePayload",
        "kind": "LinkedField",
        "name": "deleteAppVolume",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "srcDeleteAppVolumeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteAppVolumePayload",
        "kind": "LinkedField",
        "name": "deleteAppVolume",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "26411e69cdae76317c2ba3fe70804c81",
    "id": null,
    "metadata": {},
    "name": "srcDeleteAppVolumeMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteAppVolumeMutation(\n  $input: DeleteAppVolumeInput!\n) {\n  deleteAppVolume(input: $input) {\n    success\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d761d165ef7b1344be83a899a6dd463";

export default node;
