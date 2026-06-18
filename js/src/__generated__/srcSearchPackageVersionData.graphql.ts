/**
 * @generated SignedSource<<dbd3f7e36ef475e65ad4ecbd1e2a2b04>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type WebcVersion = "V2" | "V3" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcSearchPackageVersionData$data = {
  readonly createdAt: any;
  readonly id: string;
  readonly package: {
    readonly id: string;
    readonly lastVersion: {
      readonly createdAt: any;
      readonly distribution: {
        readonly downloadUrl: string;
        readonly piritaDownloadUrl: string | null | undefined;
        readonly piritaSha256Hash: string | null | undefined;
        readonly piritaSize: number | null | undefined;
        readonly size: number | null | undefined;
        readonly webcManifest: any | null | undefined;
        readonly webcVersion: WebcVersion | null | undefined;
      };
      readonly id: string;
      readonly version: string;
    } | null | undefined;
    readonly namespace: string;
    readonly packageName: string;
    readonly private: boolean;
  };
  readonly version: string;
  readonly " $fragmentType": "srcSearchPackageVersionData";
};
export type srcSearchPackageVersionData$key = {
  readonly " $data"?: srcSearchPackageVersionData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcSearchPackageVersionData">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "version",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcSearchPackageVersionData",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Package",
      "kind": "LinkedField",
      "name": "package",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "packageName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "namespace",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "private",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PackageVersion",
          "kind": "LinkedField",
          "name": "lastVersion",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "PackageDistribution",
              "kind": "LinkedField",
              "name": "distribution",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "piritaSha256Hash",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "piritaDownloadUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "downloadUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "size",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "piritaSize",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "webcVersion",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "webcManifest",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "PackageVersion",
  "abstractKey": null
};
})();

(node as any).hash = "867997048a1925bf7b78bba50a4c4500";

export default node;
