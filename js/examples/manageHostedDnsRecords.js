import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const dnsDomainId = "dns_domain_example";

const records = await client.dns.records.list({ domain: dnsDomainId });
console.log("Hosted DNS records:", records);

const record = await client.dns.records.create({
  domain: dnsDomainId,
  kind: "A",
  name: "www",
  value: "192.0.2.1",
  ttl: 300,
});
console.log("Created DNS record:", record.id);

const updated = await client.dns.records.update(record.id, {
  domain: dnsDomainId,
  kind: "A",
  name: "www",
  value: "192.0.2.2",
  ttl: 300,
});
console.log("Updated DNS record:", updated.id);

// Uncomment to delete the DNS record created by this example.
// await client.dns.records.del(record.id);
