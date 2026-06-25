/**
 * @generated SignedSource<<e43c84a11ae3115cacf622168831d62d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcGithubRepoConnectionData$data = {
  readonly app: {
    readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
  };
  readonly connectedAt: any;
  readonly connectedBy: {
    readonly globalName: string;
    readonly id: string;
    readonly username: string;
  };
  readonly deployBranch: string;
  readonly deploymentStatusEvents: boolean;
  readonly githubRepoInstallation: {
    readonly id: string;
    readonly installation: {
      readonly githubConfigureUrl: string;
      readonly id: string;
      readonly slug: string;
    };
    readonly name: string;
    readonly namespace: string;
    readonly repoUrl: string;
    readonly url: string;
  };
  readonly id: string;
  readonly pullRequestComments: boolean;
  readonly " $fragmentType": "srcGithubRepoConnectionData";
};
export type srcGithubRepoConnectionData$key = {
  readonly " $data"?: srcGithubRepoConnectionData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcGithubRepoConnectionData">;
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
  "name": "srcGithubRepoConnectionData",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "connectedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deployBranch",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deploymentStatusEvents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pullRequestComments",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "connectedBy",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
          "name": "globalName",
          "storageKey": null
        }
      ],
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GithubInstallationRepository",
      "kind": "LinkedField",
      "name": "githubRepoInstallation",
      "plural": false,
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
          "name": "namespace",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "repoUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "GithubAppInstallation",
          "kind": "LinkedField",
          "name": "installation",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slug",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "githubConfigureUrl",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "GithubRepoConnection",
  "abstractKey": null
};
})();

(node as any).hash = "204de5c541c31ff217276575eb2d3b58";

export default node;
