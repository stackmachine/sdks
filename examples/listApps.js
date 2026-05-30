import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";

const client = new StackMachine(STACKMACHINE_API_KEY);

const page = await client.apps.list({ limit: 10 });
console.log("First page:", page.data);

const firstFiveApps = await client.apps
  .list({ limit: 2 })
  .autoPagingToArray({ limit: 5 });
console.log("First five apps:", firstFiveApps);

for await (const app of client.apps.list({ limit: 25 })) {
  console.log("App:", app.name, app.url);
}
