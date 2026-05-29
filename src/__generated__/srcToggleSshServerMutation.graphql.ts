/**
 * @generated SignedSource<<4f09668f2ae0f114573e4b8e86890324>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SshAuthenticationMethod = "PASSWORD" | "PUBLIC_KEY" | "%future added value";
export type ToggleSshServerInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  enabled: boolean;
};
export type srcToggleSshServerMutation$variables = {
  input: ToggleSshServerInput;
};
export type srcToggleSshServerMutation$data = {
  readonly toggleSshServer: {
    readonly sshServer: {
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
    };
  } | null | undefined;
};
export type srcToggleSshServerMutation = {
  response: srcToggleSshServerMutation$data;
  variables: srcToggleSshServerMutation$variables;
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
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ToggleSshServerPayload",
    "kind": "LinkedField",
    "name": "toggleSshServer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AppSshServer",
        "kind": "LinkedField",
        "name": "sshServer",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
                      (v1/*: any*/),
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcToggleSshServerMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcToggleSshServerMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a69a63e5d8b0ddcbce598b69aca0047e",
    "id": null,
    "metadata": {},
    "name": "srcToggleSshServerMutation",
    "operationKind": "mutation",
    "text": "mutation srcToggleSshServerMutation(\n  $input: ToggleSshServerInput!\n) {\n  toggleSshServer(input: $input) {\n    sshServer {\n      id\n      enabled\n      users(first: 100) {\n        edges {\n          node {\n            id\n            username\n            port\n            serverHost\n            sftpRootFolder\n            authenticationMethods\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "330433f20e36084d12efb5398a60b7d7";

export default node;
