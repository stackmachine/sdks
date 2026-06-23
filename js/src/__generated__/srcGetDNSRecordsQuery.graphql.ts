/**
 * @generated SignedSource<<26dcb7ceae1812cc5fa450a2d9004a97>>
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
export type srcGetDNSRecordsQuery$variables = {
  ids: ReadonlyArray<string>;
};
export type srcGetDNSRecordsQuery$data = {
  readonly nodes: ReadonlyArray<{
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
    readonly id: string;
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
v5 = {
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
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "address",
    "storageKey": null
  }
],
v7 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "AAAARecord",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "ARecord",
  "abstractKey": null
},
v9 = {
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
v10 = {
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
v11 = {
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
v12 = {
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
v13 = {
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
v14 = {
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
v15 = {
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
v16 = {
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
v17 = {
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
v18 = {
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
};
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
          (v3/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/)
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
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isNode"
          },
          (v3/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e250de8985dae2b2cd4b25ee12b82402",
    "id": null,
    "metadata": {},
    "name": "srcGetDNSRecordsQuery",
    "operationKind": "query",
    "text": "query srcGetDNSRecordsQuery(\n  $ids: [ID!]!\n) {\n  nodes(ids: $ids) {\n    __typename\n    __isNode: __typename\n    id\n    ... on DNSRecordInterface {\n      __isDNSRecordInterface: __typename\n      createdAt\n      deletedAt\n      dnsClass\n      domain {\n        id\n        name\n        slug\n      }\n      name\n      text\n      ttl\n      updatedAt\n    }\n    ... on AAAARecord {\n      address\n    }\n    ... on ARecord {\n      address\n    }\n    ... on CAARecord {\n      flags\n      tag\n      value\n    }\n    ... on CNAMERecord {\n      cName\n    }\n    ... on DNAMERecord {\n      dName\n    }\n    ... on MXRecord {\n      exchange\n      preference\n    }\n    ... on NSRecord {\n      nsdname\n    }\n    ... on PTRRecord {\n      ptrdname\n    }\n    ... on SOARecord {\n      expire\n      minimum\n      mname\n      refresh\n      retry\n      rname\n      serial\n    }\n    ... on SRVRecord {\n      port\n      priority\n      protocol\n      service\n      target\n      weight\n    }\n    ... on SSHFPRecord {\n      algorithm\n      fingerprint\n      type\n    }\n    ... on TXTRecord {\n      data\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ee04e2ba2f700b40069f808bdc99c0d1";

export default node;
