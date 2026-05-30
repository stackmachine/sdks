import os

from stackmachine import StackMachine

client = StackMachine(os.environ["STACKMACHINE_API_KEY"])

viewer = client.viewer()
print(viewer.username if viewer else "anonymous")

for app in client.apps.list(limit=10):
    print(app.name, app.url)

client.close()
