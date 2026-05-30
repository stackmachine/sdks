/**
 * @generated SignedSource<<f63630d11793c31a69597c7cfb22fa0d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
export type srcGetSshUsersByIdsQuery$variables = {
  ids: ReadonlyArray<string>;
};
export type srcGetSshUsersByIdsQuery$data = {
  readonly nodes: ReadonlyArray<{
    readonly __typename: "SshUser";
    readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined>;
    readonly id: string;
    readonly port: number;
    readonly serverHost: string;
    readonly sftpRootFolder: string;
    readonly username: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined>;
};
export type srcGetSshUsersByIdsQuery = {
  response: srcGetSshUsersByIdsQuery$data;
  variables: srcGetSshUsersByIdsQuery$variables;
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
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "port",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serverHost",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sftpRootFolder",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "authenticationMethods",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetSshUsersByIdsQuery",
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "type": "SshUser",
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
    "name": "srcGetSshUsersByIdsQuery",
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "type": "SshUser",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1a292a6a1844c5bc4b3539a801f0a6b2",
    "id": null,
    "metadata": {},
    "name": "srcGetSshUsersByIdsQuery",
    "operationKind": "query",
    "text": "query srcGetSshUsersByIdsQuery(\n  $ids: [ID!]!\n) {\n  nodes(ids: $ids) {\n    __typename\n    ... on SshUser {\n      id\n      username\n      port\n      serverHost\n      sftpRootFolder\n      authenticationMethods\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6a0e2ceac5190668b5f6ae92c397748f";

export default node;
