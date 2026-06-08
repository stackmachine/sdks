/**
 * @generated SignedSource<<73e019b5da78addefa90f4b5a534d876>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateAppVolumeInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  maxSizeBytes?: any | null | undefined;
  mountPath: string;
};
export type srcCreateAppVolumeMutation$variables = {
  input: CreateAppVolumeInput;
};
export type srcCreateAppVolumeMutation$data = {
  readonly createAppVolume: {
    readonly success: boolean;
    readonly volume: {
      readonly " $fragmentSpreads": FragmentRefs<"srcAppVolume">;
    };
  };
};
export type srcCreateAppVolumeMutation = {
  response: srcCreateAppVolumeMutation$data;
  variables: srcCreateAppVolumeMutation$variables;
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
    "name": "srcCreateAppVolumeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAppVolumePayload",
        "kind": "LinkedField",
        "name": "createAppVolume",
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
    "name": "srcCreateAppVolumeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAppVolumePayload",
        "kind": "LinkedField",
        "name": "createAppVolume",
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
    "cacheID": "0941c122dbb170dc0eec50c7d2bc6dac",
    "id": null,
    "metadata": {},
    "name": "srcCreateAppVolumeMutation",
    "operationKind": "mutation",
    "text": "mutation srcCreateAppVolumeMutation(\n  $input: CreateAppVolumeInput!\n) {\n  createAppVolume(input: $input) {\n    success\n    volume {\n      ...srcAppVolume\n      id\n    }\n  }\n}\n\nfragment srcAppVolume on AppVolume {\n  id\n  volumeId\n  mountPath\n  maxSizeBytes\n  s3Enabled\n  s3Url\n  explorerUrl\n  isAddedByUi\n}\n"
  }
};
})();

(node as any).hash = "53155195d1de82c76a5171541ee86593";

export default node;
