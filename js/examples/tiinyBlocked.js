import { StackMachine, createZip } from "stackmachine";

const client = new StackMachine("wap_XYZ");

async function execWasmerDeploy(deployPath, subdomain) {
  try {
    const zip = await createZip(deployPath);

    const upload = await client.files.upload(zip);

    const deployment = await client.deployments.create({
      appName: subdomain,
      owner: "tiinyhost",
      uploadUrl: upload,
      domains: [`${subdomain}-syrus.wasmer.app`],
    });
    console.log(upload);
    console.log(`Deploy: ${deployPath}`);
    console.debug(`App successfully deployed: ${subdomain}`);
    console.log("Deploying app...");
    let startTime = new Date();
    console.log("Waiting for the app to be built...");
    const app = await deployment.wait({
      onProgress: ({ kind, message, datetime, stream }) => {
        console.log(datetime, stream, kind, message);
      },
    });
    console.log("App built!", app);
    console.log(app.kind);
    console.log(
      "Time taken:",
      new Date().getTime() - startTime.getTime(),
      "ms",
    );
  } catch (error) {
    console.log(`Error deploying app: ${error}`);
    throw new Error("Wasmer deploy error: " + error);
  }
}

execWasmerDeploy(
  { "index.php": "<html><body><h1>Hello World!</h1></body></html>" },
  "test-my-app-syrus9",
);
