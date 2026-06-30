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

const rawMessage = await client.emails.send({
  app: appId,
  to: ["user@example.com"],
  subject: "Raw MIME from StackMachine",
  rawMessage: new Blob(
    [
      "From: app@example.com\r\n",
      "To: user@example.com\r\n",
      "Subject: Raw MIME from StackMachine\r\n\r\n",
      "This raw MIME email was sent from a StackMachine app.",
    ],
    { type: "message/rfc822" },
  ),
});
console.log("Sent raw email:", rawMessage.id);
