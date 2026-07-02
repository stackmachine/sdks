/**
 * @generated SignedSource<<6e7c8c571d208ed38629f8eefa63504f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MetricGrouping = "BY_15_MINUTES" | "BY_5_MINUTES" | "BY_DAY" | "BY_HOUR" | "BY_WEEK" | "%future added value";
export type srcUsageViewerMetricsQuery$variables = {
  end: any;
  groupedBy: MetricGrouping;
  start: any;
};
export type srcUsageViewerMetricsQuery$data = {
  readonly viewer: {
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
  } | null | undefined;
};
export type srcUsageViewerMetricsQuery = {
  response: srcUsageViewerMetricsQuery$data;
  variables: srcUsageViewerMetricsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "end"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "groupedBy"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "start"
},
v3 = {
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
v4 = {
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
v5 = {
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
        (v3/*: any*/),
        (v4/*: any*/)
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
        (v3/*: any*/),
        (v4/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
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
    "name": "srcUsageViewerMetricsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v5/*: any*/)
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcUsageViewerMetricsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v5/*: any*/),
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
    "cacheID": "bb45fffd3ad31845ff083bbd2731e772",
    "id": null,
    "metadata": {},
    "name": "srcUsageViewerMetricsQuery",
    "operationKind": "query",
    "text": "query srcUsageViewerMetricsQuery(\n  $start: DateTime!\n  $end: DateTime!\n  $groupedBy: MetricGrouping!\n) {\n  viewer {\n    groupedMetrics(startAt: $start, endAt: $end, groupedBy: $groupedBy) {\n      startAt\n      endAt\n      grouped {\n        groupedAt\n        requests {\n          cachedRequests\n          dataCachedBytes\n          dataServedBytes\n          http2xx\n          http3xx\n          http4xx\n          http5xx\n          httpOther\n          percentageCached\n          requestDurationMillis\n          totalRequests\n          uniqueUsers\n        }\n        workloads {\n          memoryBytes\n          networkEgressBytes\n          networkIngressBytes\n          realCpuTimeMillis\n          wallCpuTimeMillis\n          workloads\n        }\n      }\n      totals {\n        requests {\n          cachedRequests\n          dataCachedBytes\n          dataServedBytes\n          http2xx\n          http3xx\n          http4xx\n          http5xx\n          httpOther\n          percentageCached\n          requestDurationMillis\n          totalRequests\n          uniqueUsers\n        }\n        workloads {\n          memoryBytes\n          networkEgressBytes\n          networkIngressBytes\n          realCpuTimeMillis\n          wallCpuTimeMillis\n          workloads\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f2fc30ac273e4f38fa979bda927face9";

export default node;
