import { StackMachine } from "stackmachine";
import { readFileSync } from "fs";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const zip = new Blob([readFileSync("test.zip")]);
const uploadUrl = await client.files.upload(zip, {
  chunkSize: 8 * 1024 * 1024,
  onProgress: (progress) => {
    console.log("Uploading files... ", progress * 100, "%");
  },
});

const appName = "zip-upload-test6";
const deployment = await client.deployments.create({
  appName: appName,
  owner: "stackmachine",
  uploadUrl: uploadUrl,
});

console.log("Deploying app...");
let startTime = new Date();
console.log("Waiting for the app to be built...");
const app = await deployment.wait({
  onProgress: ({ kind, message, datetime, stream }) => {
    console.log(datetime, stream, kind, message);
  },
});
console.log("App built!", app);
console.log(app.kind);
console.log("Time taken:", new Date().getTime() - startTime.getTime(), "ms");
