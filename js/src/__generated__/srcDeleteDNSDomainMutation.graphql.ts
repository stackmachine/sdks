/**
 * @generated SignedSource<<e33e485cf33d0c68764d6885835b379a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteDomainInput = {
  clientMutationId?: string | null | undefined;
  domainId: string;
};
export type srcDeleteDNSDomainMutation$variables = {
  input: DeleteDomainInput;
};
export type srcDeleteDNSDomainMutation$data = {
  readonly deleteDomain: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteDNSDomainMutation = {
  response: srcDeleteDNSDomainMutation$data;
  variables: srcDeleteDNSDomainMutation$variables;
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
    "concreteType": "DeleteDomainPayload",
    "kind": "LinkedField",
    "name": "deleteDomain",
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
    "name": "srcDeleteDNSDomainMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteDNSDomainMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fb59886cc0e48dc9c356687223147aec",
    "id": null,
    "metadata": {},
    "name": "srcDeleteDNSDomainMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteDNSDomainMutation(\n  $input: DeleteDomainInput!\n) {\n  deleteDomain(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "01c44ac9483c45491aec18302566748b";

export default node;
