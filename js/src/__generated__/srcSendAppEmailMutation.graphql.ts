/**
 * @generated SignedSource<<fd263e4bf718c91eddf5bee6e7bd0f66>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SendAppEmailInput = {
  appId: string;
  bcc?: ReadonlyArray<string> | null | undefined;
  cc?: ReadonlyArray<string> | null | undefined;
  clientMutationId?: string | null | undefined;
  fromAddress?: string | null | undefined;
  fromEmailId?: string | null | undefined;
  htmlBody?: string | null | undefined;
  rawMessage?: any | null | undefined;
  replyTo?: string | null | undefined;
  subject: string;
  textBody?: string | null | undefined;
  to: ReadonlyArray<string>;
};
export type srcSendAppEmailMutation$variables = {
  input: SendAppEmailInput;
};
export type srcSendAppEmailMutation$data = {
  readonly sendAppEmail: {
    readonly message: {
      readonly " $fragmentSpreads": FragmentRefs<"srcEmailMessageData">;
    };
    readonly success: boolean;
  };
};
export type srcSendAppEmailMutation = {
  response: srcSendAppEmailMutation$data;
  variables: srcSendAppEmailMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "success",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcSendAppEmailMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SendAppEmailPayload",
        "kind": "LinkedField",
        "name": "sendAppEmail",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EmailMessage",
            "kind": "LinkedField",
            "name": "message",
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
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcSendAppEmailMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SendAppEmailPayload",
        "kind": "LinkedField",
        "name": "sendAppEmail",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "EmailMessage",
            "kind": "LinkedField",
            "name": "message",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "DeployApp",
                "kind": "LinkedField",
                "name": "app",
                "plural": false,
                "selections": (v4/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  },
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
                      (v3/*: any*/),
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
                      (v3/*: any*/),
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
                    "selections": (v4/*: any*/),
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
      }
    ]
  },
  "params": {
    "cacheID": "a25c50a807086cf11ab0f1f778763e7b",
    "id": null,
    "metadata": {},
    "name": "srcSendAppEmailMutation",
    "operationKind": "mutation",
    "text": "mutation srcSendAppEmailMutation(\n  $input: SendAppEmailInput!\n) {\n  sendAppEmail(input: $input) {\n    success\n    message {\n      ...srcEmailMessageData\n      id\n    }\n  }\n}\n\nfragment srcEmailMessageData on EmailMessage {\n  id\n  app {\n    id\n  }\n  bcc\n  cc\n  createdAt\n  direction\n  from\n  htmlBody\n  owner {\n    __typename\n    globalId\n    globalName\n    isPro\n    ... on Namespace {\n      id\n      name\n      displayName\n    }\n    ... on User {\n      id\n      username\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  receivedAt\n  replyTo\n  sentAt\n  status\n  subject\n  textBody\n  to\n}\n"
  }
};
})();

(node as any).hash = "6647eddd68dc86fd12225888fca53267";

export default node;
