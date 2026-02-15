import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

const app = await client.apps.retrieve("da_XYZ");
if (!app) {
    throw new Error("App not found");
}

const domain = await client.apps.domains.create({
    app: app.id,
    hostname: "mydomainspecial5.com",
});
console.log(domain);

if (domain.redirectsToId) {
    let redirectsTo = await client.apps.domains.retrieve(domain.redirectsToId);
    console.log("Redirects to:", redirectsTo);
}
console.log("Waiting for domain to be verified...");
const verified = await client.apps.domains.verify(domain.id);
console.log("Domain verified: ", verified);
