import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

const client = await StackMachine.init({
    apiKey: STACKMACHINE_API_KEY || "wap_sm_demo"
});

const appId = "da_XYZ";
const sshServer = await client.apps.ssh.retrieve(appId);

if (!sshServer) {
    console.log("SSH server is not configured for app:", appId);
} else {
    console.log("SSH enabled:", sshServer.enabled);
    console.log("SSH users:", sshServer.users);
}
