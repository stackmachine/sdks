import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const owner = "owner_id_example";
const domainName = "example.com";

const domains = await client.dns.domains
  .list({ owner, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Hosted DNS domains:", domains);

const domain = await client.dns.domains.create({
  name: domainName,
  owner,
  importRecords: true,
});
console.log("Created hosted DNS domain:", domain.id);

const retrieved = await client.dns.domains.retrieveByName(domainName);
console.log("Retrieved hosted DNS domain:", retrieved.id);

// Uncomment to delete the hosted DNS domain created by this example.
// await client.dns.domains.del(domain.id);
