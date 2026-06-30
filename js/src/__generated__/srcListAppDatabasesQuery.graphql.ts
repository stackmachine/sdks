/**
 * @generated SignedSource<<ffc8042b22ff2deca22dff965b3b8f17>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcListAppDatabasesQuery$variables = {
  after?: string | null | undefined;
  appId: string;
  before?: string | null | undefined;
  first?: number | null | undefined;
  last?: number | null | undefined;
};
export type srcListAppDatabasesQuery$data = {
  readonly node: {
    readonly databases?: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
          readonly " $fragmentSpreads": FragmentRefs<"srcAppDatabaseData">;
        };
      }>;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
      };
      readonly totalCount: number;
    };
  } | null | undefined;
};
export type srcListAppDatabasesQuery = {
  response: srcListAppDatabasesQuery$data;
  variables: srcListAppDatabasesQuery$variables;
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
  "name": "appId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v5 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "appId"
  }
],
v6 = [
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
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v8 = {
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
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
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
    "name": "srcListAppDatabasesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "AppDatabaseConnection",
                "kind": "LinkedField",
                "name": "databases",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AppDatabaseEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppDatabase",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "srcAppDatabaseData"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  (v9/*: any*/)
                ],
                "storageKey": null
              }
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcListAppDatabasesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
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
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "AppDatabaseConnection",
                "kind": "LinkedField",
                "name": "databases",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AppDatabaseEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppDatabase",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v11/*: any*/),
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
                            "name": "port",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "username",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "password",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "phpmyadminUrl",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "dbExplorerUrl",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "deletedAt",
                            "storageKey": null
                          },
                          (v12/*: any*/),
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
                            "concreteType": "DeployApp",
                            "kind": "LinkedField",
                            "name": "app",
                            "plural": false,
                            "selections": [
                              (v10/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "willPerishAt",
                                "storageKey": null
                              },
                              (v12/*: any*/),
                              (v11/*: any*/),
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
                                  (v10/*: any*/)
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
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  (v9/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "DeployApp",
            "abstractKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "af6c2e0040206b1675cfba6491e612dc",
    "id": null,
    "metadata": {},
    "name": "srcListAppDatabasesQuery",
    "operationKind": "query",
    "text": "query srcListAppDatabasesQuery(\n  $appId: ID!\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n) {\n  node(id: $appId) {\n    __typename\n    ... on DeployApp {\n      databases(first: $first, after: $after, last: $last, before: $before) {\n        edges {\n          cursor\n          node {\n            ...srcAppDatabaseData\n            id\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          startCursor\n        }\n        totalCount\n      }\n    }\n    id\n  }\n}\n\nfragment srcAppDatabaseData on AppDatabase {\n  id\n  name\n  host\n  port\n  username\n  password\n  phpmyadminUrl\n  dbExplorerUrl\n  deletedAt\n  createdAt\n  updatedAt\n  app {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  createdAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "2045e9ba81c3d9784fd4eba31877866c";

export default node;
