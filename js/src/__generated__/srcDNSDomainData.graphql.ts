/**
 * @generated SignedSource<<6fd1f45d7c0ff3b3399b75bd64a6bb62>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DNSDelegationStatus = "MISCONFIGURED" | "PENDING" | "UNKNOWN" | "VERIFIED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcDNSDomainData$data = {
  readonly createdAt: any;
  readonly delegationStatus: DNSDelegationStatus;
  readonly deletedAt: any | null | undefined;
  readonly id: string;
  readonly lastCheckedAt: any | null | undefined;
  readonly name: string;
  readonly nameservers: ReadonlyArray<string>;
  readonly owner: {
    readonly __typename: string;
    readonly displayName?: string | null | undefined;
    readonly globalId: string;
    readonly globalName: string;
    readonly id?: string;
    readonly isPro: boolean;
    readonly name?: string;
    readonly username?: string;
  };
  readonly slug: string;
  readonly updatedAt: any;
  readonly verifiedAt: any | null | undefined;
  readonly zoneFile: string;
  readonly " $fragmentType": "srcDNSDomainData";
};
export type srcDNSDomainData$key = {
  readonly " $data"?: srcDNSDomainData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDNSDomainData">;
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
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDNSDomainData",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "zoneFile",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "delegationStatus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nameservers",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lastCheckedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "verifiedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deletedAt",
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
      "name": "updatedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "owner",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "globalId",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "globalName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isPro",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "displayName",
              "storageKey": null
            }
          ],
          "type": "Namespace",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "username",
              "storageKey": null
            }
          ],
          "type": "User",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DNSDomain",
  "abstractKey": null
};
})();

(node as any).hash = "cd82781b06266caa66e2d66b9c4f227b";

export default node;
