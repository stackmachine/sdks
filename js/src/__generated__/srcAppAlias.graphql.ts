/**
 * @generated SignedSource<<3229fb7972a566e71b4fcc0ec0d6ddd5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AppAliasVerificationStates = "APEX_WITHOUT_REDIRECTION" | "UNVERIFIED" | "VERIFIED" | "%future added value";
export type HTTPRedirectType = "PERMANENT_MOVED" | "PERMANENT_REDIRECT" | "TEMPORARY_FOUND" | "TEMPORARY_REDIRECT" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcAppAlias$data = {
  readonly createdAt: any;
  readonly expectedDnsRecords: ReadonlyArray<{
    readonly host: string;
    readonly recordType: string;
    readonly value: string;
  }>;
  readonly firstCheckedAt: any | null | undefined;
  readonly hostname: string;
  readonly id: string;
  readonly lastCheckedAt: any | null | undefined;
  readonly redirectionHttpCode: HTTPRedirectType | null | undefined;
  readonly redirectsFrom: ReadonlyArray<{
    readonly id: string;
  }>;
  readonly redirectsTo: {
    readonly id: string;
  } | null | undefined;
  readonly state: AppAliasVerificationStates;
  readonly updatedAt: any;
  readonly url: string;
  readonly " $fragmentType": "srcAppAlias";
};
export type srcAppAlias$key = {
  readonly " $data"?: srcAppAlias$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcAppAlias">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcAppAlias",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hostname",
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
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "redirectionHttpCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AppAlias",
      "kind": "LinkedField",
      "name": "redirectsFrom",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AppAlias",
      "kind": "LinkedField",
      "name": "redirectsTo",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AppAliasDNSRecord",
      "kind": "LinkedField",
      "name": "expectedDnsRecords",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "host",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "recordType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "firstCheckedAt",
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
      "name": "updatedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    }
  ],
  "type": "AppAlias",
  "abstractKey": null
};
})();

(node as any).hash = "57f85c5c062ebaa360a145ba7400f694";

export default node;
