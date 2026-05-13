import { StackMachine } from "stackmachine";

const client = await StackMachine.init({
  token: process.env.STACKMACHINE_TOKEN ?? "wap_sm_demo",
});

const appId = "da_XYZ";

await client.getApp({ id: appId }).then((app) => app.enableSsh());

const sshUser = await waitFor(
  "the SSH user to become available",
  async () => {
    const app = await client.getApp({ id: appId });
    return app?.sshServer?.users?.[0] ?? null;
  },
  { intervalMs: 5_000, timeoutMs: 90_000 },
);

const sshResult = await waitFor(
  "the SSH server to accept commands",
  () =>
    sshUser.exec("pwd && echo ssh-ok", {
      password: process.env.SSH_PASSWORD ?? "SSH_PASSWORD",
      pty: true,
      timeoutMs: 20_000,
    }),
  { intervalMs: 5_000, timeoutMs: 90_000 },
);

console.log("SSH output:", sshResult.stdout);
