/**
 * @generated SignedSource<<b5b65f81dd4eb372239fdc27cd849a5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcPurgeAppCdnCacheMutation$variables = {
  app: string;
};
export type srcPurgeAppCdnCacheMutation$data = {
  readonly purgeAppCdnCache: {
    readonly success: boolean;
  };
};
export type srcPurgeAppCdnCacheMutation = {
  response: srcPurgeAppCdnCacheMutation$data;
  variables: srcPurgeAppCdnCacheMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "app"
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
      }
    ],
    "concreteType": "AppCdnCacheMutationPayload",
    "kind": "LinkedField",
    "name": "purgeAppCdnCache",
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
    "name": "srcPurgeAppCdnCacheMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcPurgeAppCdnCacheMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0ee9b5e973f90523b4f6ed2706b39f32",
    "id": null,
    "metadata": {},
    "name": "srcPurgeAppCdnCacheMutation",
    "operationKind": "mutation",
    "text": "mutation srcPurgeAppCdnCacheMutation(\n  $app: ID!\n) {\n  purgeAppCdnCache(app: $app) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "44bc3733f64ebada20d67d8a1adacfc1";

export default node;
