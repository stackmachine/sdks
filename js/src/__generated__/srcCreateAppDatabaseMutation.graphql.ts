/**
 * @generated SignedSource<<7f26ba47188a15ff394d3da6dba4ff12>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
    "name": "srcCreateAppDatabaseMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcCreateAppDatabaseMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "6f24209e3a98290ec92302d53d4ac444",
    "id": null,
    "metadata": {},
    "name": "srcCreateAppDatabaseMutation",
    "operationKind": "mutation",
    "text": "mutation srcCreateAppDatabaseMutation(\n  $input: CreateAppDBInput!\n) {\n  createAppDb(input: $input) {\n    database {\n      id\n      name\n      host\n      port\n      username\n      password\n      phpmyadminUrl\n      dbExplorerUrl\n      deletedAt\n      createdAt\n      updatedAt\n      app {\n        id\n        willPerishAt\n        name\n        url\n        adminUrl\n        activeVersion {\n          id\n        }\n        favicon\n        screenshot\n      }\n    }\n    password\n  }\n}\n"
  }
};
})();

(node as any).hash = "775a1f6ec505bd47311ec2ffa30cad2f";

export default node;
