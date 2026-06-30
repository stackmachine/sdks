/**
 * @generated SignedSource<<b1a9f84b7fe8f73491d49874d86dc31c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MetricGrouping = "BY_15_MINUTES" | "BY_5_MINUTES" | "BY_DAY" | "BY_HOUR" | "BY_WEEK" | "%future added value";
export type srcUsageAppMetricsQuery$variables = {
  appId: string;
  end: any;
  groupedBy: MetricGrouping;
  start: any;
};
export type srcUsageAppMetricsQuery$data = {
  readonly node: {
    readonly __typename: "DeployApp";
    readonly groupedMetrics: {
      readonly endAt: any;
      readonly grouped: ReadonlyArray<{
        readonly groupedAt: any;
        readonly requests: {
          readonly cachedRequests: any;
          readonly dataCachedBytes: any;
          readonly dataServedBytes: any;
          readonly http2xx: any;
          readonly http3xx: any;
          readonly http4xx: any;
          readonly http5xx: any;
          readonly httpOther: any;
          readonly percentageCached: number;
          readonly requestDurationMillis: any;
          readonly totalRequests: any;
          readonly uniqueUsers: number;
        };
        readonly workloads: {
          readonly memoryBytes: any;
          readonly networkEgressBytes: any;
          readonly networkIngressBytes: any;
          readonly realCpuTimeMillis: any;
          readonly wallCpuTimeMillis: any;
          readonly workloads: number;
        };
      }>;
      readonly startAt: any;
      readonly totals: {
        readonly requests: {
          readonly cachedRequests: any;
          readonly dataCachedBytes: any;
          readonly dataServedBytes: any;
          readonly http2xx: any;
          readonly http3xx: any;
          readonly http4xx: any;
          readonly http5xx: any;
          readonly httpOther: any;
          readonly percentageCached: number;
          readonly requestDurationMillis: any;
          readonly totalRequests: any;
          readonly uniqueUsers: number;
        };
        readonly workloads: {
          readonly memoryBytes: any;
          readonly networkEgressBytes: any;
          readonly networkIngressBytes: any;
          readonly realCpuTimeMillis: any;
          readonly wallCpuTimeMillis: any;
          readonly workloads: number;
        };
      };
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type srcUsageAppMetricsQuery = {
  response: srcUsageAppMetricsQuery$data;
  variables: srcUsageAppMetricsQuery$variables;
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
  "name": "end"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "groupedBy"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "start"
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "appId"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "RequestMetrics",
  "kind": "LinkedField",
  "name": "requests",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cachedRequests",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dataCachedBytes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dataServedBytes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "http2xx",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "http3xx",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "http4xx",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "http5xx",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "httpOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "percentageCached",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "requestDurationMillis",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalRequests",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "uniqueUsers",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "WorkloadMetrics",
  "kind": "LinkedField",
  "name": "workloads",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "memoryBytes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "networkEgressBytes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "networkIngressBytes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "realCpuTimeMillis",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wallCpuTimeMillis",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "workloads",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "endAt",
          "variableName": "end"
        },
        {
          "kind": "Variable",
          "name": "groupedBy",
          "variableName": "groupedBy"
        },
        {
          "kind": "Variable",
          "name": "startAt",
          "variableName": "start"
        }
      ],
      "concreteType": "UsageMetrics",
      "kind": "LinkedField",
      "name": "groupedMetrics",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "GroupedUsageMetrics",
          "kind": "LinkedField",
          "name": "grouped",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "groupedAt",
              "storageKey": null
            },
            (v6/*: any*/),
            (v7/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "MetricsTotals",
          "kind": "LinkedField",
          "name": "totals",
          "plural": false,
          "selections": [
            (v6/*: any*/),
            (v7/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DeployApp",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUsageAppMetricsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v8/*: any*/)
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
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcUsageAppMetricsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v8/*: any*/),
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
    "cacheID": "22e6f3806832466382967715bb78de0b",
    "id": null,
    "metadata": {},
    "name": "srcUsageAppMetricsQuery",
    "operationKind": "query",
    "text": "query srcUsageAppMetricsQuery(\n  $appId: ID!\n  $start: DateTime!\n  $end: DateTime!\n  $groupedBy: MetricGrouping!\n) {\n  node(id: $appId) {\n    __typename\n    ... on DeployApp {\n      groupedMetrics(startAt: $start, endAt: $end, groupedBy: $groupedBy) {\n        startAt\n        endAt\n        grouped {\n          groupedAt\n          requests {\n            cachedRequests\n            dataCachedBytes\n            dataServedBytes\n            http2xx\n            http3xx\n            http4xx\n            http5xx\n            httpOther\n            percentageCached\n            requestDurationMillis\n            totalRequests\n            uniqueUsers\n          }\n          workloads {\n            memoryBytes\n            networkEgressBytes\n            networkIngressBytes\n            realCpuTimeMillis\n            wallCpuTimeMillis\n            workloads\n          }\n        }\n        totals {\n          requests {\n            cachedRequests\n            dataCachedBytes\n            dataServedBytes\n            http2xx\n            http3xx\n            http4xx\n            http5xx\n            httpOther\n            percentageCached\n            requestDurationMillis\n            totalRequests\n            uniqueUsers\n          }\n          workloads {\n            memoryBytes\n            networkEgressBytes\n            networkIngressBytes\n            realCpuTimeMillis\n            wallCpuTimeMillis\n            workloads\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f5b7b2cfb80453dd2b95d6b08e9c0385";

export default node;
