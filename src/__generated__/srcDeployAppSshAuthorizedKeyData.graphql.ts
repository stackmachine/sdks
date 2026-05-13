/**
 * @generated SignedSource<<c5899c4d636e8f418bce6419b6c0e49e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppSshAuthorizedKeyData$data = {
  readonly createdAt: any;
  readonly id: string;
  readonly name: string | null | undefined;
  readonly publicKey: string;
  readonly " $fragmentType": "srcDeployAppSshAuthorizedKeyData";
};
export type srcDeployAppSshAuthorizedKeyData$key = {
  readonly " $data"?: srcDeployAppSshAuthorizedKeyData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppSshAuthorizedKeyData">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppSshAuthorizedKeyData",
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
      "name": "createdAt",
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
      "name": "publicKey",
      "storageKey": null
    }
  ],
  "type": "SshAuthorizedKey",
  "abstractKey": null
};

(node as any).hash = "291a7deafb285d825bd82e044d369c28";

export default node;
