import os

from stackmachine import StackMachine

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    apps = client.apps.list(limit=25)
    print("First page:", len(apps.data))

    for app in apps:
        print(app.name, app.url)
