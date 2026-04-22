/**
 * @generated SignedSource<<f9d52a35210ccd7fc0abf2a52a3679e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcViewerQuery$variables = Record<PropertyKey, never>;
export type srcViewerQuery$data = {
  readonly viewer: {
    readonly username: string;
  } | null | undefined;
};
export type srcViewerQuery = {
  response: srcViewerQuery$data;
  variables: srcViewerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcViewerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "srcViewerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    "cacheID": "3c7c4755e1653678c05c701d71b5a4b7",
    "id": null,
    "metadata": {},
    "name": "srcViewerQuery",
    "operationKind": "query",
    "text": "query srcViewerQuery {\n  viewer {\n    username\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a348eb9816186ca8a53be8507dc232ea";

export default node;
