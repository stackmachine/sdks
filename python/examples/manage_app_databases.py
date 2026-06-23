import os

from stackmachine import StackMachine

app_id = "da_example"

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    databases = client.apps.databases.list(app=app_id, limit=10)
    print("Databases:", databases.data)

    result = client.apps.databases.create(
        app=app_id,
        name="primary",
    )
    print("Created database:", result.database.id)
    print("Initial password, returned once:", result.password)

    rotated = client.apps.databases.rotate_credentials(result.database.id)
    print("Rotated password, returned once:", rotated.password)

    # Uncomment to delete the database created by this example.
    # client.apps.databases.delete(result.database.id)
