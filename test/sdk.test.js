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

const requireEnv = (name) => {
  const value = process.env[name];
  assert.ok(value, `${name} must be set before running tests`);
  return value;
};

test(
  "stackmachine public sdk integration",
  { timeout: 240_000, concurrency: false },
  async (t) => {
    const apiKey = requireEnv("STACKMACHINE_API_KEY");
    const apiUrl = requireEnv("STACKMACHINE_URL");
    const client = await StackMachine.init({ apiKey, apiUrl });
    const viewer = await client.viewer();

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
            const app = await client.apps.retrieve(deployedAppId);
            const alias = app?.domains.find((domain) => domain.id === aliasId);
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

        const build = await client.apps.autobuild({
          appName,
          owner: viewer.username,
          uploadUrl,
        });

        assert.equal(typeof build.buildId, "string");
        assert.notEqual(build.buildId.length, 0);

        const buildProgress = [];
        build.subscribeToProgress((entry) => {
          buildProgress.push(entry);
        });

        const appVersion = await build.finish();
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
        assert.ok(Array.isArray(fetchedById.domains));
        assert.ok(fetchedById.domains.length >= 1);
        assert.ok(fetchedById.activeVersion);
        assert.equal(fetchedById.activeVersion.id, appVersion.id);

        const fetchedByName = await client.apps.retrieveByName(
          appName,
          viewer.username,
        );
        assert.ok(fetchedByName);
        assert.equal(fetchedByName.id, deployedAppId);

        const defaultAlias = fetchedById.domains[0];
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
        assert.ok(Array.isArray(logs));
        if (logs[0]) {
          assert.equal(typeof logs[0].message, "string");
          assert.equal(typeof logs[0].instanceId, "string");
          assert.equal(typeof logs[0].stream, "string");
          assert.equal(typeof logs[0].timestamp, "number");
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

        const refreshedWithAlias = await client.apps.retrieve(deployedAppId);
        assert.ok(
          refreshedWithAlias.domains.some((domain) => domain.id === alias.id),
        );
        assert.deepEqual(alias.redirectsFromIds, []);
        assert.equal(alias.redirectsToId, undefined);

        await client.apps.domains.del(alias.id);
        aliasId = null;

        const refreshedWithoutAlias = await client.apps.retrieve(deployedAppId);
        assert.ok(
          !refreshedWithoutAlias.domains.some(
            (domain) => domain.id === alias.id,
          ),
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
