/**
 * @generated SignedSource<<ca6389e4fbe896b23986d57026979d5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateVolumeInput = {
  clientMutationId?: string | null | undefined;
  id: string;
  maxSizeBytes?: any | null | undefined;
  mountPath?: string | null | undefined;
  redeployApp?: boolean | null | undefined;
  s3Enabled?: boolean | null | undefined;
};
export type srcUpdateVolumeMutation$variables = {
  input: UpdateVolumeInput;
};
export type srcUpdateVolumeMutation$data = {
  readonly updateVolume: {
    readonly success: boolean;
    readonly volume: {
      readonly " $fragmentSpreads": FragmentRefs<"srcAppVolume">;
    };
  };
};
export type srcUpdateVolumeMutation = {
  response: srcUpdateVolumeMutation$data;
  variables: srcUpdateVolumeMutation$variables;
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
    "name": "srcUpdateVolumeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateVolumePayload",
        "kind": "LinkedField",
        "name": "updateVolume",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AppVolume",
            "kind": "LinkedField",
            "name": "volume",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcAppVolume"
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
    "name": "srcUpdateVolumeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateVolumePayload",
        "kind": "LinkedField",
        "name": "updateVolume",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AppVolume",
            "kind": "LinkedField",
            "name": "volume",
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
                "name": "volumeId",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "mountPath",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "maxSizeBytes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "s3Enabled",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "s3Url",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "explorerUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isAddedByUi",
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
    "cacheID": "42bc439ab7e8ea2c907148ae9503aa72",
    "id": null,
    "metadata": {},
    "name": "srcUpdateVolumeMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpdateVolumeMutation(\n  $input: UpdateVolumeInput!\n) {\n  updateVolume(input: $input) {\n    success\n    volume {\n      ...srcAppVolume\n      id\n    }\n  }\n}\n\nfragment srcAppVolume on AppVolume {\n  id\n  volumeId\n  mountPath\n  maxSizeBytes\n  s3Enabled\n  s3Url\n  explorerUrl\n  isAddedByUi\n}\n"
  }
};
})();

(node as any).hash = "4f0d249fd895fc67a38f81823e650b46";

export default node;
