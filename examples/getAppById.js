import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

const client = await StackMachine.init({
    apiKey: STACKMACHINE_API_KEY || "wap_sm_demo"
});

const app = await client.apps.retrieve("da_XYZ");

console.log("App", app);
