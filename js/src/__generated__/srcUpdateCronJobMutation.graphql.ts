/**
 * @generated SignedSource<<a08ff13246f4891e062be51209e58ebf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateCronJobInput = {
  clientMutationId?: string | null | undefined;
  cronJobId: string;
  enabled?: boolean | null | undefined;
  execute?: ExecuteCronJobTargetInput | null | undefined;
  fetch?: FetchCronJobTargetInput | null | undefined;
  maxRetries?: number | null | undefined;
  maxScheduleDrift?: string | null | undefined;
  name?: string | null | undefined;
  schedule?: string | null | undefined;
  timeout?: string | null | undefined;
};
export type ExecuteCronJobTargetInput = {
  cliArgs?: any | null | undefined;
  command?: string | null | undefined;
  env?: any | null | undefined;
  packageName?: string | null | undefined;
};
export type FetchCronJobTargetInput = {
  body?: string | null | undefined;
  expectBodyIncludes?: string | null | undefined;
  expectBodyRegex?: string | null | undefined;
  expectStatusCodes?: any | null | undefined;
  headers?: any | null | undefined;
  method?: string | null | undefined;
  path: string;
};
export type srcUpdateCronJobMutation$variables = {
  input: UpdateCronJobInput;
};
export type srcUpdateCronJobMutation$data = {
  readonly updateCronJob: {
    readonly cronJob: {
      readonly " $fragmentSpreads": FragmentRefs<"srcCronJobData">;
    };
  } | null | undefined;
};
export type srcUpdateCronJobMutation = {
  response: srcUpdateCronJobMutation$data;
  variables: srcUpdateCronJobMutation$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUpdateCronJobMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateCronJobPayload",
        "kind": "LinkedField",
        "name": "updateCronJob",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "CronJob",
            "kind": "LinkedField",
            "name": "cronJob",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcCronJobData"
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
    "name": "srcUpdateCronJobMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateCronJobPayload",
        "kind": "LinkedField",
        "name": "updateCronJob",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "CronJob",
            "kind": "LinkedField",
            "name": "cronJob",
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
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "schedule",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "enabled",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "kind",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "source",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isManaged",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "maxRetries",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "maxScheduleDrift",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "timeout",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "createdAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "updatedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "target",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "command",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cliArgs",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "env",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "packageName",
                        "storageKey": null
                      }
                    ],
                    "type": "ExecuteCronJobTarget",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "path",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "method",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "headers",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "body",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expectBodyIncludes",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expectBodyRegex",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expectStatusCodes",
                        "storageKey": null
                      }
                    ],
                    "type": "FetchCronJobTarget",
                    "abstractKey": null
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
    "cacheID": "7c2acdf77e486ff6c8affa7d4ca48375",
    "id": null,
    "metadata": {},
    "name": "srcUpdateCronJobMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpdateCronJobMutation(\n  $input: UpdateCronJobInput!\n) {\n  updateCronJob(input: $input) {\n    cronJob {\n      ...srcCronJobData\n      id\n    }\n  }\n}\n\nfragment srcCronJobData on CronJob {\n  id\n  name\n  schedule\n  enabled\n  kind\n  source\n  isManaged\n  maxRetries\n  maxScheduleDrift\n  timeout\n  createdAt\n  updatedAt\n  target {\n    __typename\n    ... on ExecuteCronJobTarget {\n      command\n      cliArgs\n      env\n      packageName\n    }\n    ... on FetchCronJobTarget {\n      path\n      method\n      headers\n      body\n      expectBodyIncludes\n      expectBodyRegex\n      expectStatusCodes\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "569c7b303d24422dbd52f5b60dc2b780";

export default node;
