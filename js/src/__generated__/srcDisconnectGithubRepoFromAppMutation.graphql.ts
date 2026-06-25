/**
 * @generated SignedSource<<f796968890a7569c4bab024808de11c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DisconnectGithubRepoFromAppInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
};
export type srcDisconnectGithubRepoFromAppMutation$variables = {
  input: DisconnectGithubRepoFromAppInput;
};
export type srcDisconnectGithubRepoFromAppMutation$data = {
  readonly disconnectGithubRepoFromApp: {
    readonly success: boolean;
  };
};
export type srcDisconnectGithubRepoFromAppMutation = {
  response: srcDisconnectGithubRepoFromAppMutation$data;
  variables: srcDisconnectGithubRepoFromAppMutation$variables;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "DisconnectGithubRepoFromAppPayload",
    "kind": "LinkedField",
    "name": "disconnectGithubRepoFromApp",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "srcDisconnectGithubRepoFromAppMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDisconnectGithubRepoFromAppMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9b454225b277523d6ba94b12bcf197bd",
    "id": null,
    "metadata": {},
    "name": "srcDisconnectGithubRepoFromAppMutation",
    "operationKind": "mutation",
    "text": "mutation srcDisconnectGithubRepoFromAppMutation(\n  $input: DisconnectGithubRepoFromAppInput!\n) {\n  disconnectGithubRepoFromApp(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "c7e219f7a12cb59ad264e55c7aa482d7";

export default node;
