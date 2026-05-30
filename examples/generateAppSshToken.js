import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_XYZ";
const { token } = await client.apps.ssh.tokens.create({
  app: appId,
});

console.log("Generated SSH token:", token);
