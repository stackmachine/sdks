/**
 * @generated SignedSource<<b0f72764e626efa359f5dd91ba27582b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcListReceivedEmailsQuery$variables = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  id: string;
  last?: number | null | undefined;
};
export type srcListReceivedEmailsQuery$data = {
  readonly node: {
    readonly __typename: "DeployApp";
    readonly emails: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
          readonly " $fragmentSpreads": FragmentRefs<"srcEmailMessageData">;
        };
      }>;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
      };
      readonly totalCount: number | null | undefined;
    };
  } | {
    readonly __typename: "Namespace";
    readonly emails: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
          readonly " $fragmentSpreads": FragmentRefs<"srcEmailMessageData">;
        };
      }>;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
      };
      readonly totalCount: number | null | undefined;
    };
  } | {
    readonly __typename: "User";
    readonly emails: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
          readonly " $fragmentSpreads": FragmentRefs<"srcEmailMessageData">;
        };
      }>;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
      };
      readonly totalCount: number | null | undefined;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type srcListReceivedEmailsQuery = {
  response: srcListReceivedEmailsQuery$data;
  variables: srcListReceivedEmailsQuery$variables;
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
  "name": "__typename",
  "storageKey": null
},
v7 = [
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
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v9 = {
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
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v11 = [
  {
    "alias": "emails",
    "args": (v7/*: any*/),
    "concreteType": "EmailMessageConnection",
    "kind": "LinkedField",
    "name": "receivedEmails",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EmailMessageEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EmailMessage",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcEmailMessageData"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v9/*: any*/),
      (v10/*: any*/)
    ],
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v13 = [
  (v12/*: any*/)
],
v14 = [
  {
    "alias": "emails",
    "args": (v7/*: any*/),
    "concreteType": "EmailMessageConnection",
    "kind": "LinkedField",
    "name": "receivedEmails",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EmailMessageEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EmailMessage",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "DeployApp",
                "kind": "LinkedField",
                "name": "app",
                "plural": false,
                "selections": (v13/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "bcc",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cc",
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
                "name": "direction",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "from",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "htmlBody",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "owner",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "globalId",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "globalName",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isPro",
                    "storageKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/),
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
                        "name": "displayName",
                        "storageKey": null
                      }
                    ],
                    "type": "Namespace",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "username",
                        "storageKey": null
                      }
                    ],
                    "type": "User",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": (v13/*: any*/),
                    "type": "Node",
                    "abstractKey": "__isNode"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receivedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "replyTo",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sentAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "subject",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "textBody",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "to",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v9/*: any*/),
      (v10/*: any*/)
    ],
    "storageKey": null
  }
];
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
    "name": "srcListReceivedEmailsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": (v11/*: any*/),
            "type": "DeployApp",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": (v11/*: any*/),
            "type": "Namespace",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": (v11/*: any*/),
            "type": "User",
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
    "name": "srcListReceivedEmailsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": (v14/*: any*/),
            "type": "DeployApp",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": (v14/*: any*/),
            "type": "Namespace",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": (v14/*: any*/),
            "type": "User",
            "abstractKey": null
          },
          (v12/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "519ddd2eb21a67ba995a0a58fc7d5cbb",
    "id": null,
    "metadata": {},
    "name": "srcListReceivedEmailsQuery",
    "operationKind": "query",
    "text": "query srcListReceivedEmailsQuery(\n  $id: ID!\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n) {\n  node(id: $id) {\n    __typename\n    ... on DeployApp {\n      emails: receivedEmails(first: $first, after: $after, last: $last, before: $before) {\n        edges {\n          cursor\n          node {\n            ...srcEmailMessageData\n            id\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          startCursor\n        }\n        totalCount\n      }\n    }\n    ... on Namespace {\n      emails: receivedEmails(first: $first, after: $after, last: $last, before: $before) {\n        edges {\n          cursor\n          node {\n            ...srcEmailMessageData\n            id\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          startCursor\n        }\n        totalCount\n      }\n    }\n    ... on User {\n      emails: receivedEmails(first: $first, after: $after, last: $last, before: $before) {\n        edges {\n          cursor\n          node {\n            ...srcEmailMessageData\n            id\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          startCursor\n        }\n        totalCount\n      }\n    }\n    id\n  }\n}\n\nfragment srcEmailMessageData on EmailMessage {\n  id\n  app {\n    id\n  }\n  bcc\n  cc\n  createdAt\n  direction\n  from\n  htmlBody\n  owner {\n    __typename\n    globalId\n    globalName\n    isPro\n    ... on Namespace {\n      id\n      name\n      displayName\n    }\n    ... on User {\n      id\n      username\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  receivedAt\n  replyTo\n  sentAt\n  status\n  subject\n  textBody\n  to\n}\n"
  }
};
})();

(node as any).hash = "6f964523d4cd1e32b2d349ebb48a7566";

export default node;
