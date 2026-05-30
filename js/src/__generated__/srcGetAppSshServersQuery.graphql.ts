/**
 * @generated SignedSource<<ac44f3acea36fe1d2ee5136596e9dce8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcGetAppSshServersQuery$variables = {
  ids: ReadonlyArray<string>;
};
export type srcGetAppSshServersQuery$data = {
  readonly nodes: ReadonlyArray<{
    readonly __typename: "DeployApp";
    readonly id: string;
    readonly sshServer: {
      readonly enabled: boolean;
      readonly id: string;
    } | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined>;
};
export type srcGetAppSshServersQuery = {
  response: srcGetAppSshServersQuery$data;
  variables: srcGetAppSshServersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ids"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "ids",
    "variableName": "ids"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "AppSshServer",
  "kind": "LinkedField",
  "name": "sshServer",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "enabled",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppSshServersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetAppSshServersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/)
            ],
            "type": "DeployApp",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9355bdb6b68adcc0bc70420ad799bbc4",
    "id": null,
    "metadata": {},
    "name": "srcGetAppSshServersQuery",
    "operationKind": "query",
    "text": "query srcGetAppSshServersQuery(\n  $ids: [ID!]!\n) {\n  nodes(ids: $ids) {\n    __typename\n    ... on DeployApp {\n      id\n      sshServer {\n        id\n        enabled\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "53e1cf3d788c13e1c16ad892924e1331";

export default node;
