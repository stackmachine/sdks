/**
 * @generated SignedSource<<25a4ef3f9ac270385fd20d2f8cce2463>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DnsmanagerCertificationAuthorityAuthorizationRecordTagChoices = "IODEF" | "ISSUE" | "ISSUEWILD" | "%future added value";
export type DnsmanagerSshFingerprintRecordAlgorithmChoices = "A_1" | "A_2" | "A_3" | "A_4" | "%future added value";
export type DnsmanagerSshFingerprintRecordTypeChoices = "A_1" | "A_2" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcDNSRecordData$data = {
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
  readonly " $fragmentType": "srcDNSRecordData";
};
export type srcDNSRecordData$key = {
  readonly " $data"?: srcDNSRecordData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDNSRecordData">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "address",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDNSRecordData",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/)
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
            (v0/*: any*/),
            (v1/*: any*/),
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
        (v1/*: any*/),
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
      "selections": (v2/*: any*/),
      "type": "AAAARecord",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": (v2/*: any*/),
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
};
})();

(node as any).hash = "babf0abe5e314b4d60cedd65262f6260";

export default node;
