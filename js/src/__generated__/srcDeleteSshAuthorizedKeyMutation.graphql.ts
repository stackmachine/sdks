/**
 * @generated SignedSource<<b3e05eae85a93b9d65eff3a9d217267d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteSshAuthorizedKeyInput = {
  clientMutationId?: string | null | undefined;
  name?: string | null | undefined;
  sshUserId: string;
};
export type srcDeleteSshAuthorizedKeyMutation$variables = {
  input: DeleteSshAuthorizedKeyInput;
};
export type srcDeleteSshAuthorizedKeyMutation$data = {
  readonly deleteSshAuthorizedKey: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteSshAuthorizedKeyMutation = {
  response: srcDeleteSshAuthorizedKeyMutation$data;
  variables: srcDeleteSshAuthorizedKeyMutation$variables;
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
    "concreteType": "DeleteSshAuthorizedKeyPayload",
    "kind": "LinkedField",
    "name": "deleteSshAuthorizedKey",
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
    "name": "srcDeleteSshAuthorizedKeyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteSshAuthorizedKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7d533d808706b450809c7475dfb04632",
    "id": null,
    "metadata": {},
    "name": "srcDeleteSshAuthorizedKeyMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteSshAuthorizedKeyMutation(\n  $input: DeleteSshAuthorizedKeyInput!\n) {\n  deleteSshAuthorizedKey(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "f07979b1a24f5c8bc968f41f5ef93efc";

export default node;
