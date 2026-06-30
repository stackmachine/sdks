/**
 * @generated SignedSource<<60ab2012e274d54a9ca5c240c98c596e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppData$data = {
  readonly activeVersion: {
    readonly id: string;
  } | null | undefined;
  readonly adminUrl: string;
  readonly createdAt: any;
  readonly favicon: any | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly screenshot: any | null | undefined;
  readonly url: string;
  readonly willPerishAt: any | null | undefined;
  readonly " $fragmentType": "srcDeployAppData";
};
export type srcDeployAppData$key = {
  readonly " $data"?: srcDeployAppData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppData",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "willPerishAt",
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
      "name": "url",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "adminUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DeployAppVersion",
      "kind": "LinkedField",
      "name": "activeVersion",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "favicon",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "screenshot",
      "storageKey": null
    }
  ],
  "type": "DeployApp",
  "abstractKey": null
};
})();

(node as any).hash = "219a56f836e2785573af843e8652d7ed";

export default node;
