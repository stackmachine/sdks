/**
 * @generated SignedSource<<e91ae6adf13edebba17fe3978964494a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcAppDatabaseData$data = {
  readonly app: {
    readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
  };
  readonly createdAt: any;
  readonly dbExplorerUrl: string | null | undefined;
  readonly deletedAt: any | null | undefined;
  readonly host: string;
  readonly id: string;
  readonly name: string;
  readonly password: string | null | undefined;
  readonly phpmyadminUrl: string | null | undefined;
  readonly port: string;
  readonly updatedAt: any;
  readonly username: string;
  readonly " $fragmentType": "srcAppDatabaseData";
};
export type srcAppDatabaseData$key = {
  readonly " $data"?: srcAppDatabaseData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcAppDatabaseData">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcAppDatabaseData",
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
      "name": "host",
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
      "name": "username",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "password",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phpmyadminUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dbExplorerUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deletedAt",
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
      "concreteType": "DeployApp",
      "kind": "LinkedField",
      "name": "app",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "srcDeployAppData"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "AppDatabase",
  "abstractKey": null
};

(node as any).hash = "9ffc922d21b46f181e77fde62ecceccd";

export default node;
