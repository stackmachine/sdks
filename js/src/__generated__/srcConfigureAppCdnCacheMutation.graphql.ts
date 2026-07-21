/**
 * @generated SignedSource<<87e81e68a26b3c25d014d6d0ab724185>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AppCdnCacheConfigUpdate = {
  enabled?: boolean | null | undefined;
};
export type srcConfigureAppCdnCacheMutation$variables = {
  app: string;
  config: AppCdnCacheConfigUpdate;
};
export type srcConfigureAppCdnCacheMutation$data = {
  readonly configureAppCdnCache: {
    readonly success: boolean;
  };
};
export type srcConfigureAppCdnCacheMutation = {
  response: srcConfigureAppCdnCacheMutation$data;
  variables: srcConfigureAppCdnCacheMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "app"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "config"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "app",
        "variableName": "app"
      },
      {
        "kind": "Variable",
        "name": "config",
        "variableName": "config"
      }
    ],
    "concreteType": "AppCdnCacheMutationPayload",
    "kind": "LinkedField",
    "name": "configureAppCdnCache",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "srcConfigureAppCdnCacheMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcConfigureAppCdnCacheMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1919c7b9d592fdd8e7a21a39d8b970ed",
    "id": null,
    "metadata": {},
    "name": "srcConfigureAppCdnCacheMutation",
    "operationKind": "mutation",
    "text": "mutation srcConfigureAppCdnCacheMutation(\n  $app: ID!\n  $config: AppCdnCacheConfigUpdate!\n) {\n  configureAppCdnCache(app: $app, config: $config) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "5e7276c595679ffaa61e75adab76db31";

export default node;
