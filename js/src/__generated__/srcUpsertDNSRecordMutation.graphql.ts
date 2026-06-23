/**
 * @generated SignedSource<<f51a9519eef844c2e94b43d5d12d7c58>>
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
export type RecordKind = "A" | "AAAA" | "CAA" | "CNAME" | "DNAME" | "MX" | "NS" | "PTR" | "SOA" | "SRV" | "SSHFP" | "TXT" | "%future added value";
export type UpsertDNSRecordInput = {
  caa?: DNSCAAExtraInput | null | undefined;
  clientMutationId?: string | null | undefined;
  domainId: string;
  kind: RecordKind;
  mx?: DNSMXExtraInput | null | undefined;
  name: string;
  recordId?: string | null | undefined;
  soa?: DNSSOAExtraInput | null | undefined;
  srv?: DNSSRVExtraInput | null | undefined;
  sshfp?: DNSSSHFPExtraInput | null | undefined;
  ttl?: number | null | undefined;
  value: string;
};
export type DNSCAAExtraInput = {
  flags: number;
  tag: string;
};
export type DNSMXExtraInput = {
  preference: number;
};
export type DNSSOAExtraInput = {
  expire: number;
  minimum: number;
  mname: string;
  refresh: number;
  retry: number;
  rname: string;
  serial: number;
};
export type DNSSRVExtraInput = {
  port: number;
  priority: number;
  protocol: string;
  service: string;
  weight: number;
};
export type DNSSSHFPExtraInput = {
  algorithm: number;
  type: number;
};
export type srcUpsertDNSRecordMutation$variables = {
  input: UpsertDNSRecordInput;
};
export type srcUpsertDNSRecordMutation$data = {
  readonly upsertDNSRecord: {
    readonly record: {
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
    };
    readonly success: boolean;
  } | null | undefined;
};
export type srcUpsertDNSRecordMutation = {
  response: srcUpsertDNSRecordMutation$data;
  variables: srcUpsertDNSRecordMutation$variables;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "address",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpsertDNSRecordPayload",
    "kind": "LinkedField",
    "name": "upsertDNSRecord",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "record",
        "plural": false,
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
              (v1/*: any*/)
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
                  (v1/*: any*/),
                  (v2/*: any*/),
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
              (v2/*: any*/),
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
            "selections": (v3/*: any*/),
            "type": "AAAARecord",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": (v3/*: any*/),
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUpsertDNSRecordMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcUpsertDNSRecordMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "72bb29cf71631110787011cc22a75981",
    "id": null,
    "metadata": {},
    "name": "srcUpsertDNSRecordMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpsertDNSRecordMutation(\n  $input: UpsertDNSRecordInput!\n) {\n  upsertDNSRecord(input: $input) {\n    success\n    record {\n      __typename\n      ... on Node {\n        __isNode: __typename\n        id\n      }\n      ... on DNSRecordInterface {\n        __isDNSRecordInterface: __typename\n        createdAt\n        deletedAt\n        dnsClass\n        domain {\n          id\n          name\n          slug\n        }\n        name\n        text\n        ttl\n        updatedAt\n      }\n      ... on AAAARecord {\n        address\n      }\n      ... on ARecord {\n        address\n      }\n      ... on CAARecord {\n        flags\n        tag\n        value\n      }\n      ... on CNAMERecord {\n        cName\n      }\n      ... on DNAMERecord {\n        dName\n      }\n      ... on MXRecord {\n        exchange\n        preference\n      }\n      ... on NSRecord {\n        nsdname\n      }\n      ... on PTRRecord {\n        ptrdname\n      }\n      ... on SOARecord {\n        expire\n        minimum\n        mname\n        refresh\n        retry\n        rname\n        serial\n      }\n      ... on SRVRecord {\n        port\n        priority\n        protocol\n        service\n        target\n        weight\n      }\n      ... on SSHFPRecord {\n        algorithm\n        fingerprint\n        type\n      }\n      ... on TXTRecord {\n        data\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f38c0a29243c23c9b4b8559307ba7105";

export default node;
