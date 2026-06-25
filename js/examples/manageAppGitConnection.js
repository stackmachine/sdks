import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY;

if (!STACKMACHINE_API_KEY) {
  throw new Error("Set STACKMACHINE_API_KEY before running this example.");
}

const client = new StackMachine(STACKMACHINE_API_KEY);

const appId = "da_example";
const githubInstallationRepoId = "github_repo_example";
const deployBranch = "main";

const current = await client.apps.git.retrieve(appId);
console.log("Current Git connection:", current);

const connection = await client.apps.git.connect({
  app: appId,
  installationRepoId: githubInstallationRepoId,
  deployBranch,
});
console.log("Connected Git repository:", connection.id);

const updated = await client.apps.git.update(appId, {
  deployBranch,
  deploymentStatusEvents: true,
  pullRequestComments: true,
});
console.log("Updated Git connection:", updated.id);

// Uncomment to disconnect the repository from the app.
// await client.apps.git.del(appId);
