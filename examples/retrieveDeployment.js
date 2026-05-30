import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";
const buildId = process.argv[2];

if (!buildId) {
  throw new Error("Usage: node examples/retrieveDeployment.js <buildId>");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const deployment = await client.deployments.retrieve(buildId);
if (!deployment) {
  throw new Error("Deployment not found");
}

const appVersion = await deployment.wait({
  onProgress: ({ kind, message, datetime, stream }) => {
    console.log(datetime, stream, kind, message);
  },
});
console.log("App built!", appVersion);
