/**
 * @generated SignedSource<<e6d9ff33ecd74215a3605eb31e11706a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteDNSRecordInput = {
  clientMutationId?: string | null | undefined;
  recordId: string;
};
export type srcDeleteDNSRecordMutation$variables = {
  input: DeleteDNSRecordInput;
};
export type srcDeleteDNSRecordMutation$data = {
  readonly deleteDNSRecord: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteDNSRecordMutation = {
  response: srcDeleteDNSRecordMutation$data;
  variables: srcDeleteDNSRecordMutation$variables;
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
    "concreteType": "DeleteDNSRecordPayload",
    "kind": "LinkedField",
    "name": "deleteDNSRecord",
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
    "name": "srcDeleteDNSRecordMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteDNSRecordMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "624e750c667446a28cb8161edaf9c228",
    "id": null,
    "metadata": {},
    "name": "srcDeleteDNSRecordMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteDNSRecordMutation(\n  $input: DeleteDNSRecordInput!\n) {\n  deleteDNSRecord(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "d342e6c66c7776fa86c2d721112d449a";

export default node;
