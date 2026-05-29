import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_XYZ";
const users = await client.apps.ssh.users.list({ app: appId });

if (users.length === 0) {
  throw new Error("No SSH users found for app");
}

const user = users[0];
const keyName = "my-laptop";

const createdKey = await client.apps.ssh.users.authorizedKeys.create({
  user: user.id,
  name: keyName,
  publicKey:
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEXAMPLEKEYDATA1234567890 user@example",
});
console.log("Created key:", createdKey);

const keys = await client.apps.ssh.users.authorizedKeys.list({ user: user.id });
console.log("All keys:", keys);

await client.apps.ssh.users.authorizedKeys.del({
  user: user.id,
  name: keyName,
});
console.log("Key deleted");
