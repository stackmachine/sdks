/**
 * @generated SignedSource<<57961e55885c00d114aedf4b5f7d9672>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcGetSshAuthorizedKeysQuery$variables = {
  id: string;
};
export type srcGetSshAuthorizedKeysQuery$data = {
  readonly node: {
    readonly authorizedKeys?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly createdAt: any;
          readonly id: string;
          readonly name: string | null | undefined;
          readonly publicKey: string;
        } | null | undefined;
      } | null | undefined>;
    };
  } | null | undefined;
};
export type srcGetSshAuthorizedKeysQuery = {
  response: srcGetSshAuthorizedKeysQuery$data;
  variables: srcGetSshAuthorizedKeysQuery$variables;
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
  "name": "id",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "SshAuthorizedKeyConnection",
      "kind": "LinkedField",
      "name": "authorizedKeys",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SshAuthorizedKeyEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "SshAuthorizedKey",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v2/*: any*/),
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
                  "name": "publicKey",
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
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "authorizedKeys(first:100)"
    }
  ],
  "type": "SshUser",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetSshAuthorizedKeysQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/)
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
    "name": "srcGetSshAuthorizedKeysQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v3/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "510f58399e90b1d4f7aae441aff0b05f",
    "id": null,
    "metadata": {},
    "name": "srcGetSshAuthorizedKeysQuery",
    "operationKind": "query",
    "text": "query srcGetSshAuthorizedKeysQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on SshUser {\n      authorizedKeys(first: 100) {\n        edges {\n          node {\n            id\n            name\n            publicKey\n            createdAt\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0af64869153d1e9fe78d90f948cfb916";

export default node;
