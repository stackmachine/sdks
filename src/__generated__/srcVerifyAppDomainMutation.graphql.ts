/**
 * @generated SignedSource<<88bf52bcdc2e76f9abb5c8cc88393130>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type VerificationKind = "DEEP" | "QUICK" | "%future added value";
export type VerifyAppDomainInput = {
  clientMutationId?: string | null | undefined;
  domainId: string;
  kind?: VerificationKind | null | undefined;
};
export type srcVerifyAppDomainMutation$variables = {
  input: VerifyAppDomainInput;
};
export type srcVerifyAppDomainMutation$data = {
  readonly verifyAppDomain: {
    readonly verified: boolean;
  } | null | undefined;
};
export type srcVerifyAppDomainMutation = {
  response: srcVerifyAppDomainMutation$data;
  variables: srcVerifyAppDomainMutation$variables;
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
    "concreteType": "VerifyAppDomainPayload",
    "kind": "LinkedField",
    "name": "verifyAppDomain",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "verified",
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
    "name": "srcVerifyAppDomainMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcVerifyAppDomainMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ace9bd23238ca7c6273b6c4daecd1fee",
    "id": null,
    "metadata": {},
    "name": "srcVerifyAppDomainMutation",
    "operationKind": "mutation",
    "text": "mutation srcVerifyAppDomainMutation(\n  $input: VerifyAppDomainInput!\n) {\n  verifyAppDomain(input: $input) {\n    verified\n  }\n}\n"
  }
};
})();

(node as any).hash = "8c10389cb4656e8cedacd54c4cee48f9";

export default node;
