import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_example";
const ownerId = "owner_id_example";

const appSentMessages = await client.emails.sent
  .list({ app: appId, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Emails sent by app:", appSentMessages);

const appReceivedMessages = await client.emails.received
  .list({ app: appId, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Emails received by app:", appReceivedMessages);

const ownerSentMessages = await client.emails.sent
  .list({ owner: ownerId, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Emails sent by owner:", ownerSentMessages);

const ownerReceivedMessages = await client.emails.received
  .list({ owner: ownerId, limit: 10 })
  .autoPagingToArray({ limit: 25 });
console.log("Emails received by owner:", ownerReceivedMessages);

const sentMessage = await client.emails.send({
  app: appId,
  to: ["user@example.com"],
  subject: "Hello from StackMachine",
  textBody: "This email was sent from a StackMachine app.",
  htmlBody: "<p>This email was sent from a StackMachine app.</p>",
  replyTo: "support@example.com",
});
console.log("Sent email:", sentMessage.id);
