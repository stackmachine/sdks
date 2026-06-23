/**
 * @generated SignedSource<<52fb936ff2e7a44687364ee6a28f9b78>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DNSDelegationStatus = "MISCONFIGURED" | "PENDING" | "UNKNOWN" | "VERIFIED" | "%future added value";
export type srcListDNSDomainsQuery$variables = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  last?: number | null | undefined;
  owner?: string | null | undefined;
};
export type srcListDNSDomainsQuery$data = {
  readonly getAllDomains: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
      readonly node: {
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
      };
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: string | null | undefined;
    };
    readonly totalCount: number | null | undefined;
  };
};
export type srcListDNSDomainsQuery = {
  response: srcListDNSDomainsQuery$data;
  variables: srcListDNSDomainsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "owner"
},
v5 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "ownerId",
    "variableName": "owner"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "zoneFile",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "delegationStatus",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nameservers",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastCheckedAt",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verifiedAt",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedAt",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "globalId",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "globalName",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPro",
  "storageKey": null
},
v22 = {
  "kind": "InlineFragment",
  "selections": [
    (v7/*: any*/),
    (v8/*: any*/),
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
v23 = {
  "kind": "InlineFragment",
  "selections": [
    (v7/*: any*/),
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
},
v24 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasPreviousPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcListDNSDomainsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "DNSDomainConnection",
        "kind": "LinkedField",
        "name": "getAllDomains",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DNSDomainEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "DNSDomain",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "owner",
                    "plural": false,
                    "selections": [
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v23/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v24/*: any*/),
          (v25/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcListDNSDomainsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "DNSDomainConnection",
        "kind": "LinkedField",
        "name": "getAllDomains",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DNSDomainEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "DNSDomain",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "owner",
                    "plural": false,
                    "selections": [
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v23/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v7/*: any*/)
                        ],
                        "type": "Node",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v24/*: any*/),
          (v25/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2ce8d03db9b19daf18513e1c25995eee",
    "id": null,
    "metadata": {},
    "name": "srcListDNSDomainsQuery",
    "operationKind": "query",
    "text": "query srcListDNSDomainsQuery(\n  $owner: ID\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n) {\n  getAllDomains(ownerId: $owner, first: $first, after: $after, last: $last, before: $before) {\n    edges {\n      cursor\n      node {\n        id\n        name\n        slug\n        zoneFile\n        delegationStatus\n        nameservers\n        lastCheckedAt\n        verifiedAt\n        deletedAt\n        createdAt\n        updatedAt\n        owner {\n          __typename\n          globalId\n          globalName\n          isPro\n          ... on Namespace {\n            id\n            name\n            displayName\n          }\n          ... on User {\n            id\n            username\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n      startCursor\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "9d6cf667a662251f9b7762caa7141950";

export default node;
