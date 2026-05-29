/**
 * @generated SignedSource<<88f13f05c439d0ec60ef63df8020bfc2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
export type srcGetAppSshServerQuery$variables = {
  id: string;
};
export type srcGetAppSshServerQuery$data = {
  readonly node: {
    readonly sshServer?: {
      readonly enabled: boolean;
      readonly id: string;
      readonly users: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly authenticationMethods: ReadonlyArray<SshAuthenticationMethod | null | undefined> | null | undefined;
            readonly id: string;
            readonly port: number;
            readonly serverHost: string;
            readonly sftpRootFolder: string;
            readonly username: string;
          } | null | undefined;
        } | null | undefined>;
      };
    } | null | undefined;
  } | null | undefined;
};
export type srcGetAppSshServerQuery = {
  response: srcGetAppSshServerQuery$data;
  variables: srcGetAppSshServerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "AppSshServer",
      "kind": "LinkedField",
      "name": "sshServer",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "enabled",
          "storageKey": null
        },
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 100
            }
          ],
          "concreteType": "SshUserConnection",
          "kind": "LinkedField",
          "name": "users",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "SshUserEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "SshUser",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v2/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "username",
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
                      "name": "serverHost",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "sftpRootFolder",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "authenticationMethods",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "users(first:100)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DeployApp",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppSshServerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetAppSshServerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v3/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "286f8901d48f62424207efad8f2d88a6",
    "id": null,
    "metadata": {},
    "name": "srcGetAppSshServerQuery",
    "operationKind": "query",
    "text": "query srcGetAppSshServerQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on DeployApp {\n      sshServer {\n        id\n        enabled\n        users(first: 100) {\n          edges {\n            node {\n              id\n              username\n              port\n              serverHost\n              sftpRootFolder\n              authenticationMethods\n            }\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "789563c640425c93514da645931d0af4";

export default node;
