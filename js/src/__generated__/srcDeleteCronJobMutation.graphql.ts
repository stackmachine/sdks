/**
 * @generated SignedSource<<2608439fb7e02a71db21321146ca21e4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteCronJobInput = {
  clientMutationId?: string | null | undefined;
  cronJobId: string;
};
export type srcDeleteCronJobMutation$variables = {
  input: DeleteCronJobInput;
};
export type srcDeleteCronJobMutation$data = {
  readonly deleteCronJob: {
    readonly deletedCronJobId: string;
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteCronJobMutation = {
  response: srcDeleteCronJobMutation$data;
  variables: srcDeleteCronJobMutation$variables;
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
    "concreteType": "DeleteCronJobPayload",
    "kind": "LinkedField",
    "name": "deleteCronJob",
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
        "kind": "ScalarField",
        "name": "deletedCronJobId",
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
    "name": "srcDeleteCronJobMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteCronJobMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "515706c96a2bab12307c0557982df2e6",
    "id": null,
    "metadata": {},
    "name": "srcDeleteCronJobMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteCronJobMutation(\n  $input: DeleteCronJobInput!\n) {\n  deleteCronJob(input: $input) {\n    success\n    deletedCronJobId\n  }\n}\n"
  }
};
})();

(node as any).hash = "d1ae9995797c5cfb86f38af110adb7f2";

export default node;
