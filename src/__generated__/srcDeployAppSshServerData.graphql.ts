/**
 * @generated SignedSource<<01285684ba278d110a2833598415d1ad>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppSshServerData$data = {
  readonly enabled: boolean;
  readonly id: string;
  readonly users: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshUserData">;
      } | null | undefined;
    } | null | undefined>;
  };
  readonly " $fragmentType": "srcDeployAppSshServerData";
};
export type srcDeployAppSshServerData$key = {
  readonly " $data"?: srcDeployAppSshServerData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshServerData">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppSshServerData",
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
      "name": "enabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50
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
              "concreteType": "SshUser",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "srcDeployAppSshUserData"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "users(first:50)"
    }
  ],
  "type": "AppSshServer",
  "abstractKey": null
};

(node as any).hash = "5211e3b4fe3f46fa2563006f366970f8";

export default node;
