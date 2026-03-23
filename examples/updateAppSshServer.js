import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

const client = await StackMachine.init({
    apiKey: STACKMACHINE_API_KEY || "wap_sm_demo"
});

const appId = "da_XYZ";
const sshServer = await client.apps.ssh.update(appId, {
    enabled: true,
});

console.log("Updated SSH server state:", sshServer.enabled);
