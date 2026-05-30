import os

from stackmachine import StackMachine, create_zip

client = StackMachine(os.environ["STACKMACHINE_API_KEY"])

zip_file = create_zip(
    {
        "index.php": "<html><body><h1>Hello StackMachine</h1></body></html>",
    }
)

upload_url = client.files.upload(
    zip_file,
    on_progress=lambda progress: print("Uploading", progress.percent * 100, "%"),
)

deployment = client.deployments.create(
    app_name="hello-stackmachine",
    owner="stackmachine",
    upload_url=upload_url,
)

app_version = deployment.wait(
    on_progress=lambda event: print(
        event.datetime, event.stream, event.kind, event.message
    )
)

print(app_version.app.url)
client.close()
