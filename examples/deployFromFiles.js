import { StackMachine, createZip } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

const client = await StackMachine.init({
  apiKey: STACKMACHINE_API_KEY || "wap_sm_demo",
});

console.log("Uploading file...");
const appName = "myfilesapp1254";

const zip = await createZip({
  "index.php": "<html><body><h1>Hello World!</h1></body></html>",
});
const uploadUrl = await client.files.upload(zip, (progress) => {
  console.log("Uploading files... ", progress * 100, "%");
});

const build = await client.apps.autobuild({
  appName: appName,
  owner: "stackmachine",
  domains: [`${appName}.wasmer.app`],
  uploadUrl: uploadUrl,
});

console.log("Deploying app...");
build.subscribeToProgress(({ kind, message, datetime, stream }) => {
  console.log(datetime, stream, kind, message);
});
let startTime = new Date();
console.log("Waiting for the app to be built...");
const app = await build.finish();
console.log("App built!", app);
console.log(app.kind);
console.log("Time taken:", new Date().getTime() - startTime.getTime(), "ms");
