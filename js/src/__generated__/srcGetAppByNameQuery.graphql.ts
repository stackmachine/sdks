/**
 * @generated SignedSource<<953a66da41655499e62dd7d9268a1beb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcGetAppByNameQuery$variables = {
  name: string;
  owner?: string | null | undefined;
};
export type srcGetAppByNameQuery$data = {
  readonly app: {
    readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
  } | null | undefined;
};
export type srcGetAppByNameQuery = {
  response: srcGetAppByNameQuery$data;
  variables: srcGetAppByNameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "owner"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  }
],
v2 = {
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
    "name": "srcGetAppByNameQuery",
    "selections": [
      {
        "alias": "app",
        "args": (v1/*: any*/),
        "concreteType": "DeployApp",
        "kind": "LinkedField",
        "name": "getDeployApp",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "srcDeployAppData"
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
    "name": "srcGetAppByNameQuery",
    "selections": [
      {
        "alias": "app",
        "args": (v1/*: any*/),
        "concreteType": "DeployApp",
        "kind": "LinkedField",
        "name": "getDeployApp",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
              (v2/*: any*/)
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
    ]
  },
  "params": {
    "cacheID": "f195602c15a15de4d3a1eed319892bc6",
    "id": null,
    "metadata": {},
    "name": "srcGetAppByNameQuery",
    "operationKind": "query",
    "text": "query srcGetAppByNameQuery(\n  $name: String!\n  $owner: String\n) {\n  app: getDeployApp(name: $name, owner: $owner) {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "c49663697ce7ade26a6e3e91807886b7";

export default node;
