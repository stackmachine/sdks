/**
 * @generated SignedSource<<188bd9bb9921722e9189a7b36af65f86>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";
export type srcGetAppLogsQuery$variables = {
  appId: string;
  first: number;
  since: any;
};
export type srcGetAppLogsQuery$data = {
  readonly node: {
    readonly logs?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly datetime: any;
          readonly instanceId: string;
          readonly message: string;
          readonly stream: LogStream | null | undefined;
          readonly timestamp: number;
        } | null | undefined;
      } | null | undefined>;
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
  "name": "appId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "since"
},
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "appId"
  }
],
v4 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "first"
        },
        {
          "kind": "Variable",
          "name": "startingFromISO",
          "variableName": "since"
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
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppLogsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/)
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcGetAppLogsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
          (v4/*: any*/),
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
    "cacheID": "13fee612dbf966cd30ba2d62395c80e6",
    "id": null,
    "metadata": {},
    "name": "srcGetAppLogsQuery",
    "operationKind": "query",
    "text": "query srcGetAppLogsQuery(\n  $appId: ID!\n  $since: DateTime!\n  $first: Int!\n) {\n  node(id: $appId) {\n    __typename\n    ... on DeployAppVersion {\n      logs(startingFromISO: $since, first: $first) {\n        edges {\n          node {\n            datetime\n            instanceId\n            message\n            stream\n            timestamp\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f4ae67ecb23b04815c5101d1cb84f3d1";

export default node;
