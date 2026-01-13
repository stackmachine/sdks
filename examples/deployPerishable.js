import { StackMachine, createZip } from "stackmachine";

const STACKMACHINE_TOKEN = process.env.STACKMACHINE_TOKEN;

const client = await StackMachine.init({
    token: STACKMACHINE_TOKEN || "wap_sm_demo"
});

console.log("Uploading file...");

const zip = await createZip({
    "index.php": "<html><body><h1>This app will perish in 2 hours</h1></body></html>",
});
const uploadUrl = await client.uploadFile(zip, (progress) => {
    console.log("Uploading files... ", progress * 100, "%");
});

const build = await client.deployApp({
    appName: "perishable-app",
    owner: "stackmachine",
    uploadUrl: uploadUrl,
    perishAt: "PT2H", // 2 hours (ISO 8601 duration)
});

console.log("Deploying app...");
build.subscribeToProgress(({kind, message, datetime, stream}) => {
    console.log(datetime, stream, kind, message);
});
let startTime = new Date();
console.log("Waiting for the app to be built...");
const appVersion = await build.finish();
console.log("App built!", appVersion);
console.log(appVersion.app.willPerishAt);
console.log("Time taken:", new Date().getTime() - startTime.getTime(), "ms");
