import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

const app = await client.apps.retrieve("da_XYZ");
if (!app) {
    throw new Error("App not found");
}

const domain = app.domains.find((domain) => domain.url.includes("mydomainspecial.com"));
if (!domain) {
    throw new Error("Domain not found");
}
await client.apps.domains.del(domain.id);

console.log("Domain deleted!");
