/**
 * @generated SignedSource<<dc7c21f12732821a915a5eb307c99e44>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateCronJobInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  enabled?: boolean | null | undefined;
  execute?: ExecuteCronJobTargetInput | null | undefined;
  fetch?: FetchCronJobTargetInput | null | undefined;
  maxRetries?: number | null | undefined;
  maxScheduleDrift?: string | null | undefined;
  name: string;
  schedule: string;
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
export type srcCreateCronJobMutation$variables = {
  input: CreateCronJobInput;
};
export type srcCreateCronJobMutation$data = {
  readonly createCronJob: {
    readonly cronJob: {
      readonly " $fragmentSpreads": FragmentRefs<"srcCronJobData">;
    };
  } | null | undefined;
};
export type srcCreateCronJobMutation = {
  response: srcCreateCronJobMutation$data;
  variables: srcCreateCronJobMutation$variables;
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
    "name": "srcCreateCronJobMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateCronJobPayload",
        "kind": "LinkedField",
        "name": "createCronJob",
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
    "name": "srcCreateCronJobMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateCronJobPayload",
        "kind": "LinkedField",
        "name": "createCronJob",
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
    "cacheID": "376705104e1f2e772c7147ca133e8ce0",
    "id": null,
    "metadata": {},
    "name": "srcCreateCronJobMutation",
    "operationKind": "mutation",
    "text": "mutation srcCreateCronJobMutation(\n  $input: CreateCronJobInput!\n) {\n  createCronJob(input: $input) {\n    cronJob {\n      ...srcCronJobData\n      id\n    }\n  }\n}\n\nfragment srcCronJobData on CronJob {\n  id\n  name\n  schedule\n  enabled\n  kind\n  source\n  isManaged\n  maxRetries\n  maxScheduleDrift\n  timeout\n  createdAt\n  updatedAt\n  target {\n    __typename\n    ... on ExecuteCronJobTarget {\n      command\n      cliArgs\n      env\n      packageName\n    }\n    ... on FetchCronJobTarget {\n      path\n      method\n      headers\n      body\n      expectBodyIncludes\n      expectBodyRegex\n      expectStatusCodes\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0e35c5ef055ad3db4bcb6ee25035b4b1";

export default node;
