import os

from stackmachine import StackMachine

app_id = "da_example"

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    volumes = client.apps.volumes.list(app=app_id, limit=10)
    print("Volumes:", volumes.data)

    volume = client.apps.volumes.create(
        app=app_id,
        mount_path="/data",
        max_size_bytes=1_073_741_824,
    )
    print("Created volume:", volume.id)

    updated = client.apps.volumes.update(
        volume.id,
        mount_path="/uploads",
        s3_enabled=True,
    )
    print("Updated volume:", updated.id)

    # Uncomment to delete the volume created by this example.
    # client.apps.volumes.delete(volume.id)
