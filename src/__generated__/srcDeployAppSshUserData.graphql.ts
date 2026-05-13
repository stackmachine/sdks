/**
 * @generated SignedSource<<498643fb988254b5837fb57b8da34731>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppSshUserData$data = {
  readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined> | null | undefined;
  readonly authorizedKeys: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshAuthorizedKeyData">;
      } | null | undefined;
    } | null | undefined>;
  };
  readonly id: string;
  readonly port: number;
  readonly serverHost: string;
  readonly sftpRootFolder: string;
  readonly username: string;
  readonly " $fragmentType": "srcDeployAppSshUserData";
};
export type srcDeployAppSshUserData$key = {
  readonly " $data"?: srcDeployAppSshUserData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshUserData">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppSshUserData",
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
      "name": "username",
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
      "name": "authenticationMethods",
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
      "concreteType": "SshAuthorizedKeyConnection",
      "kind": "LinkedField",
      "name": "authorizedKeys",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SshAuthorizedKeyEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "SshAuthorizedKey",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "srcDeployAppSshAuthorizedKeyData"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "authorizedKeys(first:50)"
    }
  ],
  "type": "SshUser",
  "abstractKey": null
};

(node as any).hash = "b6ff52ef65f11d3901b081568f3c8a42";

export default node;
