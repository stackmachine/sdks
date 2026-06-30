/**
 * @generated SignedSource<<e636b9af61ea6810d12def4b0c765a52>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AutoBuildDeployAppLogKind = "BUILD_STATUS" | "COMPLETE" | "DEPLOY_STATUS" | "FAILED" | "FETCHING_PLAN_STATUS" | "LOG" | "PREPARING_TO_DEPLOY_STATUS" | "%future added value";
export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";
export type srcAutobuildSubscription$variables = {
  buildId: any;
};
export type srcAutobuildSubscription$data = {
  readonly autobuildDeployment: {
    readonly appVersion: {
      readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppVersionData">;
    } | null | undefined;
    readonly datetime: any;
    readonly kind: AutoBuildDeployAppLogKind;
    readonly message: string | null | undefined;
    readonly stream: LogStream | null | undefined;
  } | null | undefined;
};
export type srcAutobuildSubscription = {
  response: srcAutobuildSubscription$data;
  variables: srcAutobuildSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "buildId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "buildId",
    "variableName": "buildId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kind",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "datetime",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stream",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcAutobuildSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AutobuildLog",
        "kind": "LinkedField",
        "name": "autobuildDeployment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeployAppVersion",
            "kind": "LinkedField",
            "name": "appVersion",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcDeployAppVersionData"
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcAutobuildSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AutobuildLog",
        "kind": "LinkedField",
        "name": "autobuildDeployment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeployAppVersion",
            "kind": "LinkedField",
            "name": "appVersion",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "DeployApp",
                "kind": "LinkedField",
                "name": "app",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "willPerishAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  },
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
                      (v6/*: any*/)
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
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c99ae1c3905188dfd1645991d41ab6ac",
    "id": null,
    "metadata": {},
    "name": "srcAutobuildSubscription",
    "operationKind": "subscription",
    "text": "subscription srcAutobuildSubscription(\n  $buildId: UUID!\n) {\n  autobuildDeployment(buildId: $buildId) {\n    appVersion {\n      ...srcDeployAppVersionData\n      id\n    }\n    kind\n    datetime\n    stream\n    message\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  createdAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n\nfragment srcDeployAppVersionData on DeployAppVersion {\n  id\n  app {\n    ...srcDeployAppData\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a8fe1e8c1b2e7052cec0ce82b4c81ef8";

export default node;
