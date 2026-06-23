/**
 * @generated SignedSource<<d5087b246688fe2417a56970ae0165d2>>
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
export type UpsertDomainFromZoneFileInput = {
  clientMutationId?: string | null | undefined;
  deleteMissingRecords?: boolean | null | undefined;
  zoneFile: string;
};
export type srcUpsertDNSDomainFromZoneFileMutation$variables = {
  input: UpsertDomainFromZoneFileInput;
};
export type srcUpsertDNSDomainFromZoneFileMutation$data = {
  readonly upsertDomainFromZoneFile: {
    readonly domain: {
      readonly createdAt: any;
      readonly deletedAt: any | null | undefined;
      readonly id: string;
      readonly name: string;
      readonly owner: {
        readonly __typename: string;
        readonly displayName?: string | null | undefined;
        readonly globalId: string;
        readonly globalName: string;
        readonly id?: string;
        readonly isPro: boolean;
        readonly name?: string;
        readonly username?: string;
      };
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
      readonly slug: string;
      readonly updatedAt: any;
      readonly zoneFile: string;
    };
    readonly success: boolean;
  } | null | undefined;
};
export type srcUpsertDNSDomainFromZoneFileMutation = {
  response: srcUpsertDNSDomainFromZoneFileMutation$data;
  variables: srcUpsertDNSDomainFromZoneFileMutation$variables;
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
  "name": "success",
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
  "name": "slug",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "zoneFile",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "globalId",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "globalName",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isPro",
  "storageKey": null
},
v14 = {
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayName",
      "storageKey": null
    }
  ],
  "type": "Namespace",
  "abstractKey": null
},
v15 = {
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "username",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
},
v16 = {
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
},
v17 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "address",
    "storageKey": null
  }
],
v18 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "records",
  "plural": true,
  "selections": [
    (v10/*: any*/),
    (v16/*: any*/),
    {
      "kind": "InlineFragment",
      "selections": [
        (v8/*: any*/),
        (v7/*: any*/),
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
            (v5/*: any*/)
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
        (v9/*: any*/)
      ],
      "type": "DNSRecordInterface",
      "abstractKey": "__isDNSRecordInterface"
    },
    {
      "kind": "InlineFragment",
      "selections": (v17/*: any*/),
      "type": "AAAARecord",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": (v17/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUpsertDNSDomainFromZoneFileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpsertDomainFromZoneFilePayload",
        "kind": "LinkedField",
        "name": "upsertDomainFromZoneFile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "owner",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/)
                ],
                "storageKey": null
              },
              (v18/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "srcUpsertDNSDomainFromZoneFileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpsertDomainFromZoneFilePayload",
        "kind": "LinkedField",
        "name": "upsertDomainFromZoneFile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "owner",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/)
                ],
                "storageKey": null
              },
              (v18/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "97a0792aace124c703d902d5e246c211",
    "id": null,
    "metadata": {},
    "name": "srcUpsertDNSDomainFromZoneFileMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpsertDNSDomainFromZoneFileMutation(\n  $input: UpsertDomainFromZoneFileInput!\n) {\n  upsertDomainFromZoneFile(input: $input) {\n    success\n    domain {\n      id\n      name\n      slug\n      zoneFile\n      deletedAt\n      createdAt\n      updatedAt\n      owner {\n        __typename\n        globalId\n        globalName\n        isPro\n        ... on Namespace {\n          id\n          name\n          displayName\n        }\n        ... on User {\n          id\n          username\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n      records {\n        __typename\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n        ... on DNSRecordInterface {\n          __isDNSRecordInterface: __typename\n          createdAt\n          deletedAt\n          dnsClass\n          domain {\n            id\n            name\n            slug\n          }\n          name\n          text\n          ttl\n          updatedAt\n        }\n        ... on AAAARecord {\n          address\n        }\n        ... on ARecord {\n          address\n        }\n        ... on CAARecord {\n          flags\n          tag\n          value\n        }\n        ... on CNAMERecord {\n          cName\n        }\n        ... on DNAMERecord {\n          dName\n        }\n        ... on MXRecord {\n          exchange\n          preference\n        }\n        ... on NSRecord {\n          nsdname\n        }\n        ... on PTRRecord {\n          ptrdname\n        }\n        ... on SOARecord {\n          expire\n          minimum\n          mname\n          refresh\n          retry\n          rname\n          serial\n        }\n        ... on SRVRecord {\n          port\n          priority\n          protocol\n          service\n          target\n          weight\n        }\n        ... on SSHFPRecord {\n          algorithm\n          fingerprint\n          type\n        }\n        ... on TXTRecord {\n          data\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b9a6bbe0fb397cf9558b010512da7b87";

export default node;
