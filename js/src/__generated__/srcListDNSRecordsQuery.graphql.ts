/**
 * @generated SignedSource<<553f7e49cd65c2f5e7b112f71bc334b5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DnsmanagerCertificationAuthorityAuthorizationRecordTagChoices = "IODEF" | "ISSUE" | "ISSUEWILD" | "%future added value";
export type DnsmanagerSshFingerprintRecordAlgorithmChoices = "A_1" | "A_2" | "A_3" | "A_4" | "%future added value";
export type DnsmanagerSshFingerprintRecordTypeChoices = "A_1" | "A_2" | "%future added value";
export type srcListDNSRecordsQuery$variables = {
  domainId: string;
};
export type srcListDNSRecordsQuery$data = {
  readonly node: {
    readonly __typename: "DNSDomain";
    readonly records: ReadonlyArray<{
      readonly __typename: string;
      readonly address?: string;
      readonly algorithm?: DnsmanagerSshFingerprintRecordAlgorithmChoices;
      readonly cName?: string;
      readonly createdAt?: any;
      readonly dName?: string;
      readonly data?: string;
      readonly deletedAt?: any | null | undefined;
      readonly dnsClass?: string | null | undefined;
      readonly domain?: {
        readonly id: string;
        readonly name: string;
        readonly slug: string;
      };
      readonly exchange?: string;
      readonly expire?: any;
      readonly fingerprint?: string;
      readonly flags?: number;
      readonly id?: string;
      readonly minimum?: any;
      readonly mname?: string;
      readonly name?: string;
      readonly nsdname?: string;
      readonly port?: number;
      readonly preference?: number;
      readonly priority?: number;
      readonly protocol?: string;
      readonly ptrdname?: string;
      readonly refresh?: any;
      readonly retry?: any;
      readonly rname?: string;
      readonly serial?: any;
      readonly service?: string;
      readonly tag?: DnsmanagerCertificationAuthorityAuthorizationRecordTagChoices;
      readonly target?: string;
      readonly text?: string;
      readonly ttl?: number;
      readonly type?: DnsmanagerSshFingerprintRecordTypeChoices;
      readonly updatedAt?: any;
      readonly value?: string;
      readonly weight?: number;
    } | null | undefined> | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type srcListDNSRecordsQuery = {
  response: srcListDNSRecordsQuery$data;
  variables: srcListDNSRecordsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "domainId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "domainId"
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
],
v6 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "records",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            (v3/*: any*/)
          ],
          "type": "Node",
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
      "storageKey": null
    }
  ],
  "type": "DNSDomain",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcListDNSRecordsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v6/*: any*/)
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
    "name": "srcListDNSRecordsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v6/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "18a742503a309123849f8da894245c1c",
    "id": null,
    "metadata": {},
    "name": "srcListDNSRecordsQuery",
    "operationKind": "query",
    "text": "query srcListDNSRecordsQuery(\n  $domainId: ID!\n) {\n  node(id: $domainId) {\n    __typename\n    ... on DNSDomain {\n      records {\n        __typename\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n        ... on DNSRecordInterface {\n          __isDNSRecordInterface: __typename\n          createdAt\n          deletedAt\n          dnsClass\n          domain {\n            id\n            name\n            slug\n          }\n          name\n          text\n          ttl\n          updatedAt\n        }\n        ... on AAAARecord {\n          address\n        }\n        ... on ARecord {\n          address\n        }\n        ... on CAARecord {\n          flags\n          tag\n          value\n        }\n        ... on CNAMERecord {\n          cName\n        }\n        ... on DNAMERecord {\n          dName\n        }\n        ... on MXRecord {\n          exchange\n          preference\n        }\n        ... on NSRecord {\n          nsdname\n        }\n        ... on PTRRecord {\n          ptrdname\n        }\n        ... on SOARecord {\n          expire\n          minimum\n          mname\n          refresh\n          retry\n          rname\n          serial\n        }\n        ... on SRVRecord {\n          port\n          priority\n          protocol\n          service\n          target\n          weight\n        }\n        ... on SSHFPRecord {\n          algorithm\n          fingerprint\n          type\n        }\n        ... on TXTRecord {\n          data\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5b88eb171c285aff9292ca92ffa0261d";

export default node;
