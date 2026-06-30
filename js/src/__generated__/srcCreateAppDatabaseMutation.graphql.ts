/**
 * @generated SignedSource<<d9447d1656ba5a0bdd812b2f21bf2505>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateAppDBInput = {
  clientMutationId?: string | null | undefined;
  id: string;
  name?: string | null | undefined;
};
export type srcCreateAppDatabaseMutation$variables = {
  input: CreateAppDBInput;
};
export type srcCreateAppDatabaseMutation$data = {
  readonly createAppDb: {
    readonly database: {
      readonly " $fragmentSpreads": FragmentRefs<"srcAppDatabaseData">;
    };
    readonly password: string;
  } | null | undefined;
};
export type srcCreateAppDatabaseMutation = {
  response: srcCreateAppDatabaseMutation$data;
  variables: srcCreateAppDatabaseMutation$variables;
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
  "name": "password",
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
  "name": "createdAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcCreateAppDatabaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAppDBPayload",
        "kind": "LinkedField",
        "name": "createAppDb",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AppDatabase",
            "kind": "LinkedField",
            "name": "database",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcAppDatabaseData"
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
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
    "name": "srcCreateAppDatabaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAppDBPayload",
        "kind": "LinkedField",
        "name": "createAppDb",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AppDatabase",
            "kind": "LinkedField",
            "name": "database",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "host",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "port",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "username",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "phpmyadminUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "dbExplorerUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "deletedAt",
                "storageKey": null
              },
              (v5/*: any*/),
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
                  (v5/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  },
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
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4cd6b008ba09a23e60a9abb7b771442e",
    "id": null,
    "metadata": {},
    "name": "srcCreateAppDatabaseMutation",
    "operationKind": "mutation",
    "text": "mutation srcCreateAppDatabaseMutation(\n  $input: CreateAppDBInput!\n) {\n  createAppDb(input: $input) {\n    database {\n      ...srcAppDatabaseData\n      id\n    }\n    password\n  }\n}\n\nfragment srcAppDatabaseData on AppDatabase {\n  id\n  name\n  host\n  port\n  username\n  password\n  phpmyadminUrl\n  dbExplorerUrl\n  deletedAt\n  createdAt\n  updatedAt\n  app {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  createdAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "f9854678f38a7c7d5f9e53d0deee3819";

export default node;
