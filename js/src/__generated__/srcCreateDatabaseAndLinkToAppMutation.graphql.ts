/**
 * @generated SignedSource<<b21954e4dc1b9740b39dc6f206eb4aa6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
      readonly app: {
        readonly activeVersion: {
          readonly id: string;
        } | null | undefined;
        readonly adminUrl: string;
        readonly favicon: any | null | undefined;
        readonly id: string;
        readonly name: string;
        readonly screenshot: any | null | undefined;
        readonly url: string;
        readonly willPerishAt: any | null | undefined;
      };
      readonly createdAt: any;
      readonly dbExplorerUrl: string | null | undefined;
      readonly deletedAt: any | null | undefined;
      readonly host: string;
      readonly id: string;
      readonly name: string;
      readonly password: string | null | undefined;
      readonly phpmyadminUrl: string | null | undefined;
      readonly port: string;
      readonly updatedAt: any;
      readonly username: string;
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "password",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
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
          (v1/*: any*/),
          (v2/*: any*/),
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
          (v3/*: any*/),
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
            "concreteType": "DeployApp",
            "kind": "LinkedField",
            "name": "app",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "willPerishAt",
                "storageKey": null
              },
              (v2/*: any*/),
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
                  (v1/*: any*/)
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
      (v3/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcCreateDatabaseAndLinkToAppMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcCreateDatabaseAndLinkToAppMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "78a8a30fdcd4ba5bfcb20774aff5435f",
    "id": null,
    "metadata": {},
    "name": "srcCreateDatabaseAndLinkToAppMutation",
    "operationKind": "mutation",
    "text": "mutation srcCreateDatabaseAndLinkToAppMutation(\n  $input: CreateAppDatabaseInput!\n) {\n  createDatabaseAndLinkToApp(input: $input) {\n    database {\n      id\n      name\n      host\n      port\n      username\n      password\n      phpmyadminUrl\n      dbExplorerUrl\n      deletedAt\n      createdAt\n      updatedAt\n      app {\n        id\n        willPerishAt\n        name\n        url\n        adminUrl\n        activeVersion {\n          id\n        }\n        favicon\n        screenshot\n      }\n    }\n    password\n  }\n}\n"
  }
};
})();

(node as any).hash = "96f9804b4e8f26a39ab083719388b834";

export default node;
