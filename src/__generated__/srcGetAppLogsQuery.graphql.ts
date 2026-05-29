/**
 * @generated SignedSource<<14ded1af2ce8b66de099f95284afc189>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";
export type srcGetAppLogsQuery$variables = {
  after?: string | null | undefined;
  appId: string;
  before?: string | null | undefined;
  first?: number | null | undefined;
  instanceId?: string | null | undefined;
  last?: number | null | undefined;
  requestId?: string | null | undefined;
  since?: any | null | undefined;
  streams?: ReadonlyArray<LogStream | null | undefined> | null | undefined;
  textSearch?: string | null | undefined;
  until?: any | null | undefined;
};
export type srcGetAppLogsQuery$data = {
  readonly node: {
    readonly logs?: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
          readonly datetime: any;
          readonly instanceId: string;
          readonly message: string;
          readonly stream: LogStream | null | undefined;
          readonly timestamp: number;
        } | null | undefined;
      } | null | undefined>;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
      };
    };
  } | null | undefined;
};
export type srcGetAppLogsQuery = {
  response: srcGetAppLogsQuery$data;
  variables: srcGetAppLogsQuery$variables;
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
  "name": "instanceId"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "requestId"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "since"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "streams"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "textSearch"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "until"
},
v11 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "appId"
  }
],
v12 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
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
          "name": "end",
          "variableName": "until"
        },
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "first"
        },
        {
          "kind": "Variable",
          "name": "instanceId",
          "variableName": "instanceId"
        },
        {
          "kind": "Variable",
          "name": "last",
          "variableName": "last"
        },
        {
          "kind": "Variable",
          "name": "requestId",
          "variableName": "requestId"
        },
        {
          "kind": "Variable",
          "name": "startingFromISO",
          "variableName": "since"
        },
        {
          "kind": "Variable",
          "name": "streams",
          "variableName": "streams"
        },
        {
          "kind": "Variable",
          "name": "textSearch",
          "variableName": "textSearch"
        }
      ],
      "concreteType": "LogConnection",
      "kind": "LinkedField",
      "name": "logs",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "LogEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Log",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "datetime",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "instanceId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "message",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "stream",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "timestamp",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DeployAppVersion",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppLogsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v11/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v12/*: any*/)
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
      (v7/*: any*/),
      (v10/*: any*/),
      (v4/*: any*/),
      (v6/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v5/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcGetAppLogsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v11/*: any*/),
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
          (v12/*: any*/),
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
    "cacheID": "659d708599603f8570223e70e9b2ae9a",
    "id": null,
    "metadata": {},
    "name": "srcGetAppLogsQuery",
    "operationKind": "query",
    "text": "query srcGetAppLogsQuery(\n  $appId: ID!\n  $since: DateTime\n  $until: DateTime\n  $instanceId: String\n  $requestId: String\n  $streams: [LogStream]\n  $textSearch: String\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n) {\n  node(id: $appId) {\n    __typename\n    ... on DeployAppVersion {\n      logs(startingFromISO: $since, end: $until, instanceId: $instanceId, requestId: $requestId, streams: $streams, textSearch: $textSearch, first: $first, after: $after, last: $last, before: $before) {\n        edges {\n          cursor\n          node {\n            datetime\n            instanceId\n            message\n            stream\n            timestamp\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7afcf17c431a7ff6cb224337ceb35218";

export default node;
