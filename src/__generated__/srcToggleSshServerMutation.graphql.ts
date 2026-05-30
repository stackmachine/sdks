/**
 * @generated SignedSource<<27de73fb6914bcc34fcac4fc152fb18b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ToggleSshServerInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  enabled: boolean;
};
export type srcToggleSshServerMutation$variables = {
  input: ToggleSshServerInput;
};
export type srcToggleSshServerMutation$data = {
  readonly toggleSshServer: {
    readonly sshServer: {
      readonly enabled: boolean;
      readonly id: string;
    };
  } | null | undefined;
};
export type srcToggleSshServerMutation = {
  response: srcToggleSshServerMutation$data;
  variables: srcToggleSshServerMutation$variables;
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
    "concreteType": "ToggleSshServerPayload",
    "kind": "LinkedField",
    "name": "toggleSshServer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AppSshServer",
        "kind": "LinkedField",
        "name": "sshServer",
        "plural": false,
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
    "name": "srcToggleSshServerMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcToggleSshServerMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f9331c2a975d5e3a7f6dfcd05b4a66f9",
    "id": null,
    "metadata": {},
    "name": "srcToggleSshServerMutation",
    "operationKind": "mutation",
    "text": "mutation srcToggleSshServerMutation(\n  $input: ToggleSshServerInput!\n) {\n  toggleSshServer(input: $input) {\n    sshServer {\n      id\n      enabled\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "af2ce5ffbc10506f09b790ba123a185b";

export default node;
