import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

const client = await StackMachine.init({
  apiKey: STACKMACHINE_API_KEY || "wap_sm_demo",
});

const app = await client.apps.retrieve("da_XYZ");
if (!app || !app.activeVersion) {
  throw new Error("App or active version not found");
}

const last30Minutes = new Date(Date.now() - 30 * 60 * 1000);

const logs = await client.apps.versions.logs.list({
  version: app.activeVersion.id,
  since: last30Minutes,
});
console.log(logs);
