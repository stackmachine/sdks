/**
 * @generated SignedSource<<fd655409045a98ae43d79e101e0d7df4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcGetAppGitConnectionQuery$variables = {
  id: string;
};
export type srcGetAppGitConnectionQuery$data = {
  readonly node: {
    readonly __typename: "DeployApp";
    readonly githubRepoConnection: {
      readonly app: {
        readonly activeVersion: {
          readonly id: string;
        } | null | undefined;
        readonly adminUrl: string;
        readonly favicon: any | null | undefined;
        readonly id: string;
        readonly name: string;
        readonly screenshot: any | null | undefined;
        readonly url: string;
        readonly willPerishAt: any | null | undefined;
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
    } | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type srcGetAppGitConnectionQuery = {
  response: srcGetAppGitConnectionQuery$data;
  variables: srcGetAppGitConnectionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v6 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GithubRepoConnection",
      "kind": "LinkedField",
      "name": "githubRepoConnection",
      "plural": false,
      "selections": [
        (v3/*: any*/),
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
            (v3/*: any*/),
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
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "willPerishAt",
              "storageKey": null
            },
            (v4/*: any*/),
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "adminUrl",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DeployAppVersion",
              "kind": "LinkedField",
              "name": "activeVersion",
              "plural": false,
              "selections": [
                (v3/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "favicon",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "screenshot",
              "storageKey": null
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
            (v3/*: any*/),
            (v4/*: any*/),
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
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "GithubAppInstallation",
              "kind": "LinkedField",
              "name": "installation",
              "plural": false,
              "selections": [
                (v3/*: any*/),
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
      "storageKey": null
    }
  ],
  "type": "DeployApp",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppGitConnectionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetAppGitConnectionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v6/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3e37759ade10eccf45e8304ca8fa9229",
    "id": null,
    "metadata": {},
    "name": "srcGetAppGitConnectionQuery",
    "operationKind": "query",
    "text": "query srcGetAppGitConnectionQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on DeployApp {\n      githubRepoConnection {\n        id\n        connectedAt\n        deployBranch\n        deploymentStatusEvents\n        pullRequestComments\n        connectedBy {\n          id\n          username\n          globalName\n        }\n        app {\n          id\n          willPerishAt\n          name\n          url\n          adminUrl\n          activeVersion {\n            id\n          }\n          favicon\n          screenshot\n        }\n        githubRepoInstallation {\n          id\n          name\n          namespace\n          repoUrl\n          url\n          installation {\n            id\n            slug\n            githubConfigureUrl\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d07d47be2f508f703b01b058af175d71";

export default node;
