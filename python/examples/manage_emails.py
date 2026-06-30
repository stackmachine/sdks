import os

from stackmachine import StackMachine

app_id = "da_example"
owner_id = "owner_id_example"

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    app_sent_messages = client.emails.sent.list(app=app_id, limit=10)
    print("Emails sent by app:", app_sent_messages.data)

    app_received_messages = client.emails.received.list(app=app_id, limit=10)
    print("Emails received by app:", app_received_messages.data)

    owner_sent_messages = client.emails.sent.list(owner=owner_id, limit=10)
    print("Emails sent by owner:", owner_sent_messages.data)

    owner_received_messages = client.emails.received.list(
        owner=owner_id,
        limit=10,
    )
    print("Emails received by owner:", owner_received_messages.data)

    sent_message = client.emails.send(
        app=app_id,
        to=["user@example.com"],
        subject="Hello from StackMachine",
        text_body="This email was sent from a StackMachine app.",
        html_body="<p>This email was sent from a StackMachine app.</p>",
        reply_to="support@example.com",
    )
    print("Sent email:", sent_message.id)

    raw_message = client.emails.send(
        app=app_id,
        to=["user@example.com"],
        subject="Raw MIME from StackMachine",
        raw_message=(
            b"From: app@example.com\r\n"
            b"To: user@example.com\r\n"
            b"Subject: Raw MIME from StackMachine\r\n\r\n"
            b"This raw MIME email was sent from a StackMachine app."
        ),
    )
    print("Sent raw email:", raw_message.id)
