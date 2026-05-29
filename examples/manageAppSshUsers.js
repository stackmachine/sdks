import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

const client = await StackMachine.init({
  apiKey: STACKMACHINE_API_KEY || "wap_sm_demo",
});

const appId = "da_XYZ";
const users = await client.apps.ssh.users.list({ app: appId });

console.log("Users:", users);
if (users.length === 0) {
  throw new Error("No SSH users found for app");
}

const user = users[0];
const updatedUser = await client.apps.ssh.users.update(user.id, {
  authenticationMethods: ["PASSWORD", "PUBLIC_KEY"],
});
console.log("Updated user:", updatedUser);

const revealed = await client.apps.ssh.users.passwords.reveal(user.id);
console.log("Revealed password:", revealed.password);

const rotated = await client.apps.ssh.users.passwords.rotate(user.id);
console.log("Rotated password:", rotated.password);
