import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_XYZ";
const sshServer = await client.apps.ssh.retrieve(appId);

console.log("SSH enabled:", sshServer.enabled);
const users = await client.apps.ssh.users.list({ app: appId, limit: 10 });
console.log("SSH users:", users.data);
