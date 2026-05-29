import { StackMachine, createZip } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

console.log("Uploading file...");

const zip = await createZip({
  "index.php":
    "<html><body><h1>This app will perish in 2 hours</h1></body></html>",
});
const uploadUrl = await client.files.upload(zip, (progress) => {
  console.log("Uploading files... ", progress * 100, "%");
});

const build = await client.apps.autobuild({
  appName: "perishable-app",
  owner: "stackmachine",
  uploadUrl: uploadUrl,
  perishAt: "PT2H", // 2 hours (ISO 8601 duration)
});

console.log("Deploying app...");
build.subscribeToProgress(({ kind, message, datetime, stream }) => {
  console.log(datetime, stream, kind, message);
});
let startTime = new Date();
console.log("Waiting for the app to be built...");
const appVersion = await build.finish();
console.log("App built!", appVersion);
console.log(appVersion.app.willPerishAt);
console.log("Time taken:", new Date().getTime() - startTime.getTime(), "ms");
