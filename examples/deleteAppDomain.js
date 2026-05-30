import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const app = await client.apps.retrieve("da_XYZ");
if (!app) {
  throw new Error("App not found");
}

const domains = await client.apps.domains.list({ app: app.id, limit: 100 });
const domain = domains.data.find((domain) =>
  domain.url.includes("mydomainspecial.com"),
);
if (!domain) {
  throw new Error("Domain not found");
}
await client.apps.domains.del(domain.id);

console.log("Domain deleted!");
