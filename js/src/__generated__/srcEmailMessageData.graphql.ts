/**
 * @generated SignedSource<<227f5fe27469471ea42e0bb3fea4092b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type EmailMessageDirection = "RECEIVED" | "SENT" | "%future added value";
export type EmailMessageStatus = "DELIVERED" | "FAILED" | "QUEUED" | "RECEIVED" | "SENT" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcEmailMessageData$data = {
  readonly app: {
    readonly id: string;
  } | null | undefined;
  readonly bcc: ReadonlyArray<string>;
  readonly cc: ReadonlyArray<string>;
  readonly createdAt: any;
  readonly direction: EmailMessageDirection;
  readonly from: string;
  readonly htmlBody: string | null | undefined;
  readonly id: string;
  readonly owner: {
    readonly __typename: string;
    readonly displayName?: string | null | undefined;
    readonly globalId: string;
    readonly globalName: string;
    readonly id?: string;
    readonly isPro: boolean;
    readonly name?: string;
    readonly username?: string;
  } | null | undefined;
  readonly receivedAt: any | null | undefined;
  readonly replyTo: string | null | undefined;
  readonly sentAt: any | null | undefined;
  readonly status: EmailMessageStatus;
  readonly subject: string;
  readonly textBody: string | null | undefined;
  readonly to: ReadonlyArray<string>;
  readonly " $fragmentType": "srcEmailMessageData";
};
export type srcEmailMessageData$key = {
  readonly " $data"?: srcEmailMessageData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcEmailMessageData">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcEmailMessageData",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "DeployApp",
      "kind": "LinkedField",
      "name": "app",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
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
            (v0/*: any*/),
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
            (v0/*: any*/),
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
  "type": "EmailMessage",
  "abstractKey": null
};
})();

(node as any).hash = "de3e40fac1bbd0cffc89f668301a22c7";

export default node;
