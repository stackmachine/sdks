/**
 * @generated SignedSource<<5a0c26879f5d9aebf36c6451aaa75744>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
export type srcGetAppSshUsersQuery$variables = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  id: string;
  last?: number | null | undefined;
};
export type srcGetAppSshUsersQuery$data = {
  readonly node: {
    readonly sshServer?: {
      readonly users: {
        readonly edges: ReadonlyArray<{
          readonly cursor: string;
          readonly node: {
            readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined> | null | undefined;
            readonly id: string;
            readonly port: number;
            readonly serverHost: string;
            readonly sftpRootFolder: string;
            readonly username: string;
          } | null | undefined;
        } | null | undefined>;
        readonly pageInfo: {
          readonly endCursor: string | null | undefined;
          readonly hasNextPage: boolean;
          readonly hasPreviousPage: boolean;
          readonly startCursor: string | null | undefined;
        };
        readonly totalCount: number | null | undefined;
      };
    } | null | undefined;
  } | null | undefined;
};
export type srcGetAppSshUsersQuery = {
  response: srcGetAppSshUsersQuery$data;
  variables: srcGetAppSshUsersQuery$variables;
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
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v5 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
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
      "name": "first",
      "variableName": "first"
    },
    {
      "kind": "Variable",
      "name": "last",
      "variableName": "last"
    }
  ],
  "concreteType": "SshUserConnection",
  "kind": "LinkedField",
  "name": "users",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "SshUserEdge",
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
          "concreteType": "SshUser",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v6/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "username",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "port",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "serverHost",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "sftpRootFolder",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "authenticationMethods",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppSshUsersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
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
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
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
    "argumentDefinitions": [
      (v3/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcGetAppSshUsersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
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
          {
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
                  (v7/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "DeployApp",
            "abstractKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "174b4b58c86bc187a899e8bad106452c",
    "id": null,
    "metadata": {},
    "name": "srcGetAppSshUsersQuery",
    "operationKind": "query",
    "text": "query srcGetAppSshUsersQuery(\n  $id: ID!\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n) {\n  node(id: $id) {\n    __typename\n    ... on DeployApp {\n      sshServer {\n        users(first: $first, after: $after, last: $last, before: $before) {\n          edges {\n            cursor\n            node {\n              id\n              username\n              port\n              serverHost\n              sftpRootFolder\n              authenticationMethods\n            }\n          }\n          pageInfo {\n            hasNextPage\n            hasPreviousPage\n            endCursor\n            startCursor\n          }\n          totalCount\n        }\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7246c26f3345fad099c22b7ed6478c19";

export default node;
