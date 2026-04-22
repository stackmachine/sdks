import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
  token: STACKMACHINE_TOKEN || "wap_sm_demo",
});

const app = await client.getApp({
  id: "da_XYZ",
});

const domain = await app.upsertDomain("mydomainspecial5.com");
console.log(domain);

if (domain.redirectsToId) {
  let redirectsTo = await domain.redirectsTo;
  console.log("Redirects to:", redirectsTo);
}
console.log("Waiting for domain to be verified...");
const verified = await domain.verify();
console.log("Domain verified: ", verified);
