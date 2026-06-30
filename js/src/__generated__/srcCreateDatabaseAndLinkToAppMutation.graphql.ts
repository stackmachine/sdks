/**
 * @generated SignedSource<<a03c9ed198d28662469a4fa07aec89ac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DatabaseEngine = "MYSQL" | "POSTGRES" | "SQLITE" | "%future added value";
export type CreateAppDatabaseInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  dbEngine: DatabaseEngine;
  name?: string | null | undefined;
};
export type srcCreateDatabaseAndLinkToAppMutation$variables = {
  input: CreateAppDatabaseInput;
};
export type srcCreateDatabaseAndLinkToAppMutation$data = {
  readonly createDatabaseAndLinkToApp: {
    readonly database: {
      readonly " $fragmentSpreads": FragmentRefs<"srcAppDatabaseData">;
    };
    readonly password: string;
  } | null | undefined;
};
export type srcCreateDatabaseAndLinkToAppMutation = {
  response: srcCreateDatabaseAndLinkToAppMutation$data;
  variables: srcCreateDatabaseAndLinkToAppMutation$variables;
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
    "name": "srcCreateDatabaseAndLinkToAppMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAppDBPayload",
        "kind": "LinkedField",
        "name": "createDatabaseAndLinkToApp",
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
    "name": "srcCreateDatabaseAndLinkToAppMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAppDBPayload",
        "kind": "LinkedField",
        "name": "createDatabaseAndLinkToApp",
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
    "cacheID": "551aee17b31931fcde3c217cea079c71",
    "id": null,
    "metadata": {},
    "name": "srcCreateDatabaseAndLinkToAppMutation",
    "operationKind": "mutation",
    "text": "mutation srcCreateDatabaseAndLinkToAppMutation(\n  $input: CreateAppDatabaseInput!\n) {\n  createDatabaseAndLinkToApp(input: $input) {\n    database {\n      ...srcAppDatabaseData\n      id\n    }\n    password\n  }\n}\n\nfragment srcAppDatabaseData on AppDatabase {\n  id\n  name\n  host\n  port\n  username\n  password\n  phpmyadminUrl\n  dbExplorerUrl\n  deletedAt\n  createdAt\n  updatedAt\n  app {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  createdAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "5adee923099f3567003e1c8b82f21a8c";

export default node;
