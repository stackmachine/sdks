/**
 * @generated SignedSource<<29d5ba74e5593c3e2ffbdaf3d7c69d18>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
      readonly " $fragmentSpreads": FragmentRefs<"srcAppDatabaseData">;
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
    "name": "srcRotateAppDatabaseCredentialsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "name": "srcRotateAppDatabaseCredentialsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "cacheID": "3b072706a55de5f09f88a4fb905e3795",
    "id": null,
    "metadata": {},
    "name": "srcRotateAppDatabaseCredentialsMutation",
    "operationKind": "mutation",
    "text": "mutation srcRotateAppDatabaseCredentialsMutation(\n  $input: RotateCredentialsForAppDBInput!\n) {\n  rotateCredentialsForAppDb(input: $input) {\n    database {\n      ...srcAppDatabaseData\n      id\n    }\n    password\n  }\n}\n\nfragment srcAppDatabaseData on AppDatabase {\n  id\n  name\n  host\n  port\n  username\n  password\n  phpmyadminUrl\n  dbExplorerUrl\n  deletedAt\n  createdAt\n  updatedAt\n  app {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  createdAt\n  name\n  url\n  adminUrl\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "49109e75e2c47d9d7d716cc1264f6a40";

export default node;
