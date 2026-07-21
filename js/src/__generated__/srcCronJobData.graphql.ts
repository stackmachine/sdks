/**
 * @generated SignedSource<<46c41a6e478c3d6a1eb6e79cd56488a3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type CronJobKind = "EXECUTE" | "FETCH" | "%future added value";
export type CronJobSource = "API" | "CONFIG" | "PROVISIONED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcCronJobData$data = {
  readonly createdAt: any;
  readonly enabled: boolean;
  readonly id: string;
  readonly isManaged: boolean;
  readonly kind: CronJobKind;
  readonly maxRetries: number | null | undefined;
  readonly maxScheduleDrift: string | null | undefined;
  readonly name: string;
  readonly schedule: string;
  readonly source: CronJobSource;
  readonly target: {
    readonly __typename: "ExecuteCronJobTarget";
    readonly cliArgs: any;
    readonly command: string | null | undefined;
    readonly env: any;
    readonly packageName: string | null | undefined;
  } | {
    readonly __typename: "FetchCronJobTarget";
    readonly body: string | null | undefined;
    readonly expectBodyIncludes: string | null | undefined;
    readonly expectBodyRegex: string | null | undefined;
    readonly expectStatusCodes: any | null | undefined;
    readonly headers: any;
    readonly method: string;
    readonly path: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly timeout: string | null | undefined;
  readonly updatedAt: any;
  readonly " $fragmentType": "srcCronJobData";
};
export type srcCronJobData$key = {
  readonly " $data"?: srcCronJobData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcCronJobData">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcCronJobData",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
      "name": "schedule",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "enabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "kind",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "source",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isManaged",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxRetries",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxScheduleDrift",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "timeout",
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
      "name": "updatedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "target",
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
              "kind": "ScalarField",
              "name": "command",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cliArgs",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "env",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "packageName",
              "storageKey": null
            }
          ],
          "type": "ExecuteCronJobTarget",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "path",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "method",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "headers",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "body",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "expectBodyIncludes",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "expectBodyRegex",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "expectStatusCodes",
              "storageKey": null
            }
          ],
          "type": "FetchCronJobTarget",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CronJob",
  "abstractKey": null
};

(node as any).hash = "0f0687cf9b7fbba882235f3c1c5b24ad";

export default node;
