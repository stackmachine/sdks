/**
 * @generated SignedSource<<120d44d3ff2323170b3f15bb6a400897>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcGetAppCacheQuery$variables = {
  id: string;
};
export type srcGetAppCacheQuery$data = {
  readonly node: {
    readonly __typename: "DeployApp";
    readonly cdnCacheEnabled: boolean;
    readonly cdnCachePurgedAt: any | null | undefined;
    readonly id: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type srcGetAppCacheQuery = {
  response: srcGetAppCacheQuery$data;
  variables: srcGetAppCacheQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cdnCacheEnabled",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cdnCachePurgedAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppCacheQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "type": "DeployApp",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetAppCacheQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "type": "DeployApp",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f5c07b49b994cbef0b36e09e0cebb065",
    "id": null,
    "metadata": {},
    "name": "srcGetAppCacheQuery",
    "operationKind": "query",
    "text": "query srcGetAppCacheQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on DeployApp {\n      id\n      cdnCacheEnabled\n      cdnCachePurgedAt\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "3e372804dcdfcfeae0b1938f43d7da7e";

export default node;
