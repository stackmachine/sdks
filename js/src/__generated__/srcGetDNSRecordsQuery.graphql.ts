/**
 * @generated SignedSource<<00dc99f8aee1802aa1338f38a81d051c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcGetDNSRecordsQuery$variables = {
  ids: ReadonlyArray<string>;
};
export type srcGetDNSRecordsQuery$data = {
  readonly nodes: ReadonlyArray<{
    readonly __typename: string;
    readonly " $fragmentSpreads": FragmentRefs<"srcDNSRecordData">;
  } | null | undefined>;
};
export type srcGetDNSRecordsQuery = {
  response: srcGetDNSRecordsQuery$data;
  variables: srcGetDNSRecordsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ids"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "ids",
    "variableName": "ids"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
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
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "address",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetDNSRecordsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcDNSRecordData"
              }
            ],
            "type": "DNSRecord",
            "abstractKey": "__isDNSRecord"
          }
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
    "name": "srcGetDNSRecordsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isNode"
              },
              {
                "kind": "InlineFragment",
                "selections": [
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
                    "name": "deletedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dnsClass",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DNSDomain",
                    "kind": "LinkedField",
                    "name": "domain",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "slug",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "text",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "ttl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updatedAt",
                    "storageKey": null
                  }
                ],
                "type": "DNSRecordInterface",
                "abstractKey": "__isDNSRecordInterface"
              },
              {
                "kind": "InlineFragment",
                "selections": (v5/*: any*/),
                "type": "AAAARecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v5/*: any*/),
                "type": "ARecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "flags",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tag",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "value",
                    "storageKey": null
                  }
                ],
                "type": "CAARecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cName",
                    "storageKey": null
                  }
                ],
                "type": "CNAMERecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dName",
                    "storageKey": null
                  }
                ],
                "type": "DNAMERecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "exchange",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "preference",
                    "storageKey": null
                  }
                ],
                "type": "MXRecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nsdname",
                    "storageKey": null
                  }
                ],
                "type": "NSRecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "ptrdname",
                    "storageKey": null
                  }
                ],
                "type": "PTRRecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "expire",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "minimum",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "mname",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "refresh",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "retry",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "rname",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "serial",
                    "storageKey": null
                  }
                ],
                "type": "SOARecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
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
                    "name": "priority",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "protocol",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "service",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "target",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "weight",
                    "storageKey": null
                  }
                ],
                "type": "SRVRecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "algorithm",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "fingerprint",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  }
                ],
                "type": "SSHFPRecord",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "data",
                    "storageKey": null
                  }
                ],
                "type": "TXTRecord",
                "abstractKey": null
              }
            ],
            "type": "DNSRecord",
            "abstractKey": "__isDNSRecord"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7f0412d1be6068bc284982979714e4f0",
    "id": null,
    "metadata": {},
    "name": "srcGetDNSRecordsQuery",
    "operationKind": "query",
    "text": "query srcGetDNSRecordsQuery(\n  $ids: [ID!]!\n) {\n  nodes(ids: $ids) {\n    __typename\n    ... on DNSRecord {\n      __isDNSRecord: __typename\n      ...srcDNSRecordData\n    }\n    id\n  }\n}\n\nfragment srcDNSRecordData on DNSRecord {\n  __isDNSRecord: __typename\n  __typename\n  ... on Node {\n    __isNode: __typename\n    id\n  }\n  ... on DNSRecordInterface {\n    __isDNSRecordInterface: __typename\n    createdAt\n    deletedAt\n    dnsClass\n    domain {\n      id\n      name\n      slug\n    }\n    name\n    text\n    ttl\n    updatedAt\n  }\n  ... on AAAARecord {\n    address\n  }\n  ... on ARecord {\n    address\n  }\n  ... on CAARecord {\n    flags\n    tag\n    value\n  }\n  ... on CNAMERecord {\n    cName\n  }\n  ... on DNAMERecord {\n    dName\n  }\n  ... on MXRecord {\n    exchange\n    preference\n  }\n  ... on NSRecord {\n    nsdname\n  }\n  ... on PTRRecord {\n    ptrdname\n  }\n  ... on SOARecord {\n    expire\n    minimum\n    mname\n    refresh\n    retry\n    rname\n    serial\n  }\n  ... on SRVRecord {\n    port\n    priority\n    protocol\n    service\n    target\n    weight\n  }\n  ... on SSHFPRecord {\n    algorithm\n    fingerprint\n    type\n  }\n  ... on TXTRecord {\n    data\n  }\n}\n"
  }
};
})();

(node as any).hash = "77e69fbf8ef5142354de8323ef337a59";

export default node;
