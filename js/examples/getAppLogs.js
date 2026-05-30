import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const app = await client.apps.retrieve("da_XYZ");
if (!app.activeVersion) {
  throw new Error("App active version not found");
}

const last30Minutes = new Date(Date.now() - 30 * 60 * 1000);

const logs = await client.apps.versions.logs.list({
  version: app.activeVersion.id,
  since: last30Minutes,
  limit: 10,
});
console.log(logs.data);
