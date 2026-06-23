import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const zoneFile = `
$ORIGIN example.com.
@ 3600 IN SOA ns1.example.com. admin.example.com. 1 3600 600 1209600 3600
@ 3600 IN NS ns1.example.com.
www 300 IN A 192.0.2.1
`;

const domain = await client.dns.domains.importZoneFile({
  zoneFile,
  deleteMissingRecords: false,
});
console.log("Imported hosted DNS zone:", domain.id);
