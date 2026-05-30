/**
 * @generated SignedSource<<15ee6b3661f3f8b94154e94576ad7e5a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcGetAppSshServerQuery$variables = {
  id: string;
};
export type srcGetAppSshServerQuery$data = {
  readonly node: {
    readonly sshServer?: {
      readonly enabled: boolean;
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type srcGetAppSshServerQuery = {
  response: srcGetAppSshServerQuery$data;
  variables: srcGetAppSshServerQuery$variables;
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
      "args": null,
      "concreteType": "AppSshServer",
      "kind": "LinkedField",
      "name": "sshServer",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "enabled",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppSshServerQuery",
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
    "name": "srcGetAppSshServerQuery",
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
    "cacheID": "063e80612cd7a27b5b073d067d4d190e",
    "id": null,
    "metadata": {},
    "name": "srcGetAppSshServerQuery",
    "operationKind": "query",
    "text": "query srcGetAppSshServerQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on DeployApp {\n      sshServer {\n        id\n        enabled\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "ecfe350e5b245f86ae54729cc15c26fd";

export default node;
