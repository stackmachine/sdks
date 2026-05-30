/**
 * @generated SignedSource<<9b37d453b266e953e58bd0f6d71b287b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
export type srcGetSshUserByIdQuery$variables = {
  id: string;
};
export type srcGetSshUserByIdQuery$data = {
  readonly node: {
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
  } | null | undefined;
};
export type srcGetSshUserByIdQuery = {
  response: srcGetSshUserByIdQuery$data;
  variables: srcGetSshUserByIdQuery$variables;
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
    "name": "srcGetSshUserByIdQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
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
    "name": "srcGetSshUserByIdQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
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
    "cacheID": "0de6be296af87d9192f783050c7833e1",
    "id": null,
    "metadata": {},
    "name": "srcGetSshUserByIdQuery",
    "operationKind": "query",
    "text": "query srcGetSshUserByIdQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on SshUser {\n      id\n      username\n      port\n      serverHost\n      sftpRootFolder\n      authenticationMethods\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "09e623ac1d66ea51daee1459672da0b7";

export default node;
