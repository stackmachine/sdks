import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_example";

const databases = await client.apps.databases
  .list({ app: appId, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Databases:", databases);

const { database, password } = await client.apps.databases.create({
  app: appId,
  dbEngine: "POSTGRES",
  name: "primary",
});
console.log("Created database:", database.id);
console.log("Initial password, returned once:", password);

const rotated = await client.apps.databases.rotateCredentials(database.id);
console.log("Rotated password, returned once:", rotated.password);

// Uncomment to delete the database created by this example.
// await client.apps.databases.del(database.id);
