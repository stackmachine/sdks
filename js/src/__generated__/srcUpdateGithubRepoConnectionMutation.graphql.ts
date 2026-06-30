/**
 * @generated SignedSource<<18dcb062248eecc52b5e165fa5f03e41>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
      readonly " $fragmentSpreads": FragmentRefs<"srcGithubRepoConnectionData">;
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUpdateGithubRepoConnectionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateGithubRepoAppConnectionPayload",
        "kind": "LinkedField",
        "name": "updateGithubRepoConnection",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GithubRepoConnection",
            "kind": "LinkedField",
            "name": "githubRepoConnection",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcGithubRepoConnectionData"
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
    "name": "srcUpdateGithubRepoConnectionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateGithubRepoAppConnectionPayload",
        "kind": "LinkedField",
        "name": "updateGithubRepoConnection",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fb2ee0cf850bce5125fed1009dff74d4",
    "id": null,
    "metadata": {},
    "name": "srcUpdateGithubRepoConnectionMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpdateGithubRepoConnectionMutation(\n  $input: UpdateGithubRepoAppConnectionInput!\n) {\n  updateGithubRepoConnection(input: $input) {\n    success\n    githubRepoConnection {\n      ...srcGithubRepoConnectionData\n      id\n    }\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  createdAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n\nfragment srcGithubRepoConnectionData on GithubRepoConnection {\n  id\n  connectedAt\n  deployBranch\n  deploymentStatusEvents\n  pullRequestComments\n  connectedBy {\n    id\n    username\n    globalName\n  }\n  app {\n    ...srcDeployAppData\n    id\n  }\n  githubRepoInstallation {\n    id\n    name\n    namespace\n    repoUrl\n    url\n    installation {\n      id\n      slug\n      githubConfigureUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "bd50752f265d8769a2a5588fa5efbee9";

export default node;
