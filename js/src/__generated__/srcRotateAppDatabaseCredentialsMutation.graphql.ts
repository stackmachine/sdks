/**
 * @generated SignedSource<<8631c93e617427537b2dbc45896ff9d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RotateCredentialsForAppDBInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type srcRotateAppDatabaseCredentialsMutation$variables = {
  input: RotateCredentialsForAppDBInput;
};
export type srcRotateAppDatabaseCredentialsMutation$data = {
  readonly rotateCredentialsForAppDb: {
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
export type srcRotateAppDatabaseCredentialsMutation = {
  response: srcRotateAppDatabaseCredentialsMutation$data;
  variables: srcRotateAppDatabaseCredentialsMutation$variables;
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
    "concreteType": "RotateCredentialsForAppDBPayload",
    "kind": "LinkedField",
    "name": "rotateCredentialsForAppDb",
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
    "name": "srcRotateAppDatabaseCredentialsMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcRotateAppDatabaseCredentialsMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "1b15235482d7722b6a82ca092753eb60",
    "id": null,
    "metadata": {},
    "name": "srcRotateAppDatabaseCredentialsMutation",
    "operationKind": "mutation",
    "text": "mutation srcRotateAppDatabaseCredentialsMutation(\n  $input: RotateCredentialsForAppDBInput!\n) {\n  rotateCredentialsForAppDb(input: $input) {\n    database {\n      id\n      name\n      host\n      port\n      username\n      password\n      phpmyadminUrl\n      dbExplorerUrl\n      deletedAt\n      createdAt\n      updatedAt\n      app {\n        id\n        willPerishAt\n        name\n        url\n        adminUrl\n        activeVersion {\n          id\n        }\n        favicon\n        screenshot\n      }\n    }\n    password\n  }\n}\n"
  }
};
})();

(node as any).hash = "e533f29778ba73cc5e274992d8c73bca";

export default node;
