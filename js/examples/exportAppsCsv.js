import { writeFile } from "node:fs/promises";
import { StackMachine } from "stackmachine";

const STACKMACHINE_API_KEY = process.env.STACKMACHINE_API_KEY || "wap_sm_demo";
const OUTPUT_PATH = process.argv[2] || "apps.csv";
const APP_LIMIT = 1000;
const PAGE_LIMIT = 100;

const client = new StackMachine(STACKMACHINE_API_KEY);

function csvValue(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function csvRow(values) {
  return values.map(csvValue).join(",");
}

function formatDate(date) {
  return date instanceof Date ? date.toISOString() : "";
}

const apps = await client.apps
  .list({ limit: PAGE_LIMIT })
  .autoPagingToArray({ limit: APP_LIMIT });

const csv = [
  csvRow(["app id", "app name", "main url", "created at"]),
  ...apps.map((app) =>
    csvRow([app.id, app.name, app.url, formatDate(app.createdAt)]),
  ),
].join("\n");

await writeFile(OUTPUT_PATH, `${csv}\n`, "utf8");

console.log(`Wrote ${apps.length} apps to ${OUTPUT_PATH}`);
