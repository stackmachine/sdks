import assert from "node:assert/strict";
import test from "node:test";
import {
  BlobReader,
  BlobWriter,
  TextWriter,
  Uint8ArrayWriter,
  ZipReader,
} from "@zip.js/zip.js";
import { StackMachine, createZip } from "../dist/index.js";

const optionalEnv = (name) => process.env[name];

test(
  "stackmachine public sdk integration",
  { timeout: 240_000, concurrency: false },
  async (t) => {
    const apiKey = optionalEnv("STACKMACHINE_API_KEY");
    const apiUrl = optionalEnv("STACKMACHINE_URL");
    if (!apiKey || !apiUrl) {
      t.skip("requires STACKMACHINE_API_KEY and STACKMACHINE_URL");
      return;
    }

    const client = new StackMachine(apiKey, { apiUrl });
    const initClient = await StackMachine.init({ apiKey, apiUrl });
    const initViewer = await initClient.viewer();
    const viewer = await client.viewer();

    assert.ok(initViewer, "StackMachine.init should remain compatible");
    assert.ok(viewer, "viewer() should return the authenticated user");
    assert.equal(typeof viewer.username, "string");
    assert.notEqual(viewer.username.length, 0);

    await t.test(
      "createZip bundles files into a readable archive",
      async () => {
        const zip = await createZip({
          "index.php": "<html><body><h1>Hello StackMachine</h1></body></html>",
          "blob.txt": new Blob(["blob-body"]),
          "bytes.bin": new Uint8Array([1, 2, 3, 4]),
        });

        assert.ok(zip instanceof Blob);
        assert.ok(zip.size > 0);

        const reader = new ZipReader(new BlobReader(zip));
        const entries = await reader.getEntries();
        await reader.close();

        assert.deepEqual(entries.map((entry) => entry.filename).sort(), [
          "blob.txt",
          "bytes.bin",
          "index.php",
        ]);

        const entryMap = new Map(
          entries.map((entry) => [entry.filename, entry]),
        );
        assert.equal(
          await entryMap.get("index.php").getData(new TextWriter()),
          "<html><body><h1>Hello StackMachine</h1></body></html>",
        );
        assert.equal(
          await entryMap.get("blob.txt").getData(new TextWriter()),
          "blob-body",
        );
        assert.deepEqual(
          Array.from(
            await entryMap.get("bytes.bin").getData(new Uint8ArrayWriter()),
          ),
          [1, 2, 3, 4],
        );
      },
    );

    await t.test(
      "viewer, upload, deploy, getApp, logs, domains, and deleteApp work together",
      async (t) => {
        let deployedAppId = null;
        let aliasId = null;
        const appName = `sdk-test-${Date.now().toString(36)}`;

        t.after(async () => {
          if (aliasId && deployedAppId) {
            const aliases = await client.apps.domains
              .list({ app: deployedAppId, limit: 100 })
              .autoPagingToArray({ limit: 100 });
            const alias = aliases.find((domain) => domain.id === aliasId);
            if (alias) {
              await client.apps.domains.del(alias.id);
            }
          }
          if (deployedAppId) {
            await client.apps.del(deployedAppId);
          }
        });

        const zip = await createZip({
          "index.php":
            "<html><body><h1>StackMachine SDK integration test</h1></body></html>",
        });

        const uploadProgress = [];
        const uploadUrl = await client.files.upload(zip, (progress) => {
          uploadProgress.push(progress);
        });

        assert.match(uploadUrl, /^https:\/\/.+/);
        assert.ok(
          uploadProgress.length >= 2,
          "upload progress callback should be invoked more than once",
        );
        assert.ok(uploadProgress.some((value) => value > 0 && value < 1));
        assert.equal(uploadProgress.at(-1), 1);

        const deployment = await client.deployments.create({
          appName,
          owner: viewer.username,
          uploadUrl,
        });

        assert.equal(typeof deployment.buildId, "string");
        assert.notEqual(deployment.buildId.length, 0);

        const buildProgress = [];
        const appVersion = await deployment.wait({
          onProgress: (entry) => {
            buildProgress.push(entry);
          },
        });
        deployedAppId = appVersion.app.id;

        assert.equal(typeof appVersion.id, "string");
        assert.equal(appVersion.app.name, appName);
        assert.equal(typeof appVersion.app.url, "string");
        assert.ok(
          buildProgress.length > 0,
          "build should emit progress events",
        );

        const fetchedById = await client.apps.retrieve(deployedAppId);
        assert.ok(fetchedById);
        assert.equal(fetchedById.id, deployedAppId);
        assert.equal(fetchedById.name, appName);
        assert.ok(fetchedById.activeVersion);
        assert.equal(fetchedById.activeVersion.id, appVersion.id);

        const fetchedByName = await client.apps.retrieveByName(
          appName,
          viewer.username,
        );
        assert.ok(fetchedByName);
        assert.equal(fetchedByName.id, deployedAppId);

        const domainsPage = await client.apps.domains.list({
          app: fetchedById.id,
          limit: 10,
        });
        assert.equal(domainsPage.object, "list");
        assert.equal(typeof domainsPage.has_more, "boolean");
        assert.equal(domainsPage.hasMore, domainsPage.has_more);
        assert.ok(domainsPage.data.length >= 1);

        const defaultAlias = domainsPage.data[0];
        assert.equal(typeof defaultAlias.id, "string");
        assert.equal(typeof defaultAlias.url, "string");
        assert.equal(typeof defaultAlias.state, "string");
        assert.ok(
          defaultAlias.redirectionHttpCode === undefined ||
            typeof defaultAlias.redirectionHttpCode === "string",
        );
        assert.deepEqual(defaultAlias.redirectsFromIds, []);
        assert.equal(defaultAlias.redirectsToId, undefined);

        const logs = await client.apps.versions.logs.list({
          version: fetchedById.activeVersion.id,
          since: new Date(Date.now() - 60 * 60 * 1000),
        });
        assert.equal(logs.object, "list");
        assert.ok(Array.isArray(logs.data));
        if (logs.data[0]) {
          assert.equal(typeof logs.data[0].message, "string");
          assert.equal(typeof logs.data[0].instanceId, "string");
          assert.equal(typeof logs.data[0].stream, "string");
          assert.equal(typeof logs.data[0].timestamp, "number");
        }

        const appListPage = await client.apps.list({ limit: 1 });
        assert.equal(appListPage.object, "list");
        assert.ok(Array.isArray(appListPage.data));
        const autoPagedApps = await client.apps
          .list({ limit: 1 })
          .autoPagingToArray({ limit: 1 });
        assert.ok(autoPagedApps.length <= 1);
        for await (const app of client.apps.list({ limit: 1 })) {
          assert.equal(typeof app.id, "string");
          break;
        }

        const domainName = `sdk-${Date.now().toString(36)}.example.com`;
        const alias = await client.apps.domains.create({
          app: fetchedById.id,
          hostname: domainName,
        });
        aliasId = alias.id;

        assert.equal(typeof alias.id, "string");
        assert.equal(alias.url, `https://${domainName}`);
        assert.ok(Array.isArray(alias.expectedDnsRecords));
        assert.ok(alias.expectedDnsRecords.length > 0);
        assert.equal(alias.expectedDnsRecords[0].host, domainName);

        const refreshedWithAlias = await client.apps.domains
          .list({ app: deployedAppId, limit: 100 })
          .autoPagingToArray({ limit: 100 });
        assert.ok(refreshedWithAlias.some((domain) => domain.id === alias.id));
        assert.deepEqual(alias.redirectsFromIds, []);
        assert.equal(alias.redirectsToId, undefined);

        await client.apps.domains.del(alias.id);
        aliasId = null;

        const refreshedWithoutAlias = await client.apps.domains
          .list({ app: deployedAppId, limit: 100 })
          .autoPagingToArray({ limit: 100 });
        assert.ok(
          !refreshedWithoutAlias.some((domain) => domain.id === alias.id),
        );

        await client.apps.del(deployedAppId);
        deployedAppId = null;

        const deletedApp = await client.apps.retrieve(appVersion.app.id);
        assert.equal(deletedApp, null);
      },
    );

    await t.test("missing apps return null", async () => {
      const missing = await client.apps.retrieveByName(
        `missing-${Date.now().toString(36)}`,
        viewer.username,
      );
      assert.equal(missing, null);
    });
  },
);
