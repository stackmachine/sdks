/**
 * @generated SignedSource<<682e2ef7637b6177dcf683893d1c75ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateGithubRepoAppConnectionInput = {
  appId?: string | null | undefined;
  clientMutationId?: string | null | undefined;
  connectionId?: string | null | undefined;
  deployBranch?: string | null | undefined;
  deploymentStatusEvents?: boolean | null | undefined;
  pullRequestComments?: boolean | null | undefined;
};
export type srcUpdateGithubRepoConnectionMutation$variables = {
  input: UpdateGithubRepoAppConnectionInput;
};
export type srcUpdateGithubRepoConnectionMutation$data = {
  readonly updateGithubRepoConnection: {
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
    };
    readonly success: boolean;
  };
};
export type srcUpdateGithubRepoConnectionMutation = {
  response: srcUpdateGithubRepoConnectionMutation$data;
  variables: srcUpdateGithubRepoConnectionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateGithubRepoAppConnectionPayload",
    "kind": "LinkedField",
    "name": "updateGithubRepoConnection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "GithubRepoConnection",
        "kind": "LinkedField",
        "name": "githubRepoConnection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
              (v1/*: any*/),
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
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "willPerishAt",
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/),
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
                  (v1/*: any*/)
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
              (v1/*: any*/),
              (v2/*: any*/),
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
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GithubAppInstallation",
                "kind": "LinkedField",
                "name": "installation",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUpdateGithubRepoConnectionMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcUpdateGithubRepoConnectionMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "5dd828ecc00cfce218a630c61572989a",
    "id": null,
    "metadata": {},
    "name": "srcUpdateGithubRepoConnectionMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpdateGithubRepoConnectionMutation(\n  $input: UpdateGithubRepoAppConnectionInput!\n) {\n  updateGithubRepoConnection(input: $input) {\n    success\n    githubRepoConnection {\n      id\n      connectedAt\n      deployBranch\n      deploymentStatusEvents\n      pullRequestComments\n      connectedBy {\n        id\n        username\n        globalName\n      }\n      app {\n        id\n        willPerishAt\n        name\n        url\n        adminUrl\n        activeVersion {\n          id\n        }\n        favicon\n        screenshot\n      }\n      githubRepoInstallation {\n        id\n        name\n        namespace\n        repoUrl\n        url\n        installation {\n          id\n          slug\n          githubConfigureUrl\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1f3c6a0f5b60cfabd8956fc378f74734";

export default node;
