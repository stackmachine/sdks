/**
 * @generated SignedSource<<e8ae0a458a3349ccf1a7a01875f17a0e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcAppVolume$data = {
  readonly explorerUrl: any | null | undefined;
  readonly id: string;
  readonly isAddedByUi: boolean;
  readonly maxSizeBytes: any;
  readonly mountPath: string;
  readonly s3Enabled: boolean;
  readonly s3Url: any | null | undefined;
  readonly volumeId: string;
  readonly " $fragmentType": "srcAppVolume";
};
export type srcAppVolume$key = {
  readonly " $data"?: srcAppVolume$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcAppVolume">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcAppVolume",
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
  "type": "AppVolume",
  "abstractKey": null
};

(node as any).hash = "f845ba2e8b6fceb54765e83086a85fa2";

export default node;
