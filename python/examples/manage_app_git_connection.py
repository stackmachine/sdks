import os

from stackmachine import StackMachine

app_id = "da_example"
github_installation_repo_id = "github_repo_example"
deploy_branch = "main"

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    current = client.apps.git.retrieve(app_id)
    print("Current Git connection:", current)

    connection = client.apps.git.connect(
        app=app_id,
        installation_repo_id=github_installation_repo_id,
        deploy_branch=deploy_branch,
    )
    print("Connected Git repository:", connection.id)

    updated = client.apps.git.update(
        connection.id,
        deployment_status_events=True,
        pull_request_comments=True,
    )
    print("Updated Git connection:", updated.id)

    # Uncomment to disconnect the repository from the app.
    # client.apps.git.delete(app_id)
