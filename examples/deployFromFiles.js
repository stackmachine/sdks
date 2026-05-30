import { StackMachine, createZip } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

console.log("Uploading file...");
const appName = "myfilesapp1254";

const zip = await createZip({
  "index.php": "<html><body><h1>Hello World!</h1></body></html>",
});
const uploadUrl = await client.files.upload(zip, {
  chunkSize: 8 * 1024 * 1024,
  onProgress: (progress) => {
    console.log("Uploading files... ", progress * 100, "%");
  },
});

const deployment = await client.deployments.create({
  appName: appName,
  owner: "stackmachine",
  domains: [`${appName}.wasmer.app`],
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
