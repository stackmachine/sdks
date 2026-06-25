import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_example";

const volumes = await client.apps.volumes
  .list({ app: appId, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Volumes:", volumes);

const volume = await client.apps.volumes.create({
  app: appId,
  mountPath: "/data",
  maxSizeBytes: 1_073_741_824,
});
console.log("Created volume:", volume.id);

const updated = await client.apps.volumes.update(volume.id, {
  mountPath: "/uploads",
  s3Enabled: true,
});
console.log("Updated volume:", updated.id);

// Uncomment to delete the volume created by this example.
// await client.apps.volumes.del(volume.id);
