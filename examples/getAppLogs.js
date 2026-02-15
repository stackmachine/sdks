import { StackMachine } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
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
