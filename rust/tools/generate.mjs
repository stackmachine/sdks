// Run after `npm ci` in js: node rust/tools/generate.mjs [--check]
// Operations are copied from the Python SDK and validated against the JS schema.
import { createRequire } from "node:module";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = new URL("../../", import.meta.url);
const require = createRequire(new URL("js/package.json", root));
const { buildSchema, parse, validate, getNamedType, isObjectType, isAbstractType, isNonNullType, isListType, isEnumType, isScalarType } = require("graphql");
const schemaText = readFileSync(new URL("js/schema.graphql", root), "utf8");
const schema = buildSchema(schemaText);
const schemaAst = parse(schemaText);
const types = new Map(schemaAst.definitions.filter((type) => type.name).map((type) => [type.name.value, type]));
const needed = new Set();
const constants = [];
const documents = new Map();
const snake = (name) => name.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const pascal = (name) => name.split("_").map((part) => part[0] + part.slice(1).toLowerCase()).join("");
const fieldName = (name) => ["type", "ref", "match", "self", "enum", "fn", "mod", "async", "loop", "move", "use", "where", "in", "return", "box"].includes(snake(name)) ? `r#${snake(name)}` : snake(name);
const named = (type) => type.kind === "NamedType" ? type.name.value : named(type.type);
function visit(name) {
  const type = types.get(name);
  if (!type || needed.has(name) || !["InputObjectTypeDefinition", "EnumTypeDefinition"].includes(type.kind)) return;
  needed.add(name);
  for (const field of type.fields ?? []) visit(named(field.type));
}
function recursive(from, to, seen = new Set()) {
  if (from === to) return true;
  if (seen.has(from)) return false;
  seen.add(from);
  return (types.get(from)?.fields ?? []).some((field) => recursive(named(field.type), to, seen));
}
function rustType(type, owner, required = false) {
  if (type.kind === "NonNullType") return rustType(type.type, owner, true);
  let result;
  if (type.kind === "ListType") result = `Vec<${rustType(type.type, owner)}>`;
  else {
    const name = type.name.value;
    result = ({ String: "String", ID: "String", URL: "String", UUID: "String", DateTime: "String", CaseInsensitiveString: "String", JSONString: "String", Int: "i32", BigInt: "i64", Float: "f64", Boolean: "bool", GenericScalar: "serde_json::Value", Upload: "serde_json::Value" })[name] ?? name;
    if (types.get(name)?.kind === "InputObjectTypeDefinition" && recursive(name, owner)) result = `Box<${result}>`;
  }
  return required ? result : `Option<${result}>`;
}
function doc(description) {
  return description ? description.value.trim().split("\n").map((line) => `/// ${line}`).join("\n") + "\n" : "";
}
for (const file of readdirSync(new URL("rust/graphql/", root)).sort()) {
  if (!file.endsWith(".graphql")) continue;
  const operation = parse(readFileSync(new URL(`rust/graphql/${file}`, root), "utf8"));
  const errors = validate(schema, operation);
  if (errors.length) throw new Error(`${file}: ${errors.map((error) => error.message).join("; ")}`);
  for (const definition of operation.definitions) {
    for (const variable of definition.variableDefinitions ?? []) visit(named(variable.type));
  }
  constants.push(`pub const ${file.replace(".graphql", "").toUpperCase()}: &str = include_str!("../graphql/${file}");`);
  documents.set(file.replace(".graphql", "").toUpperCase(), operation);
}
// Build deterministic schema-derived response fixtures, including nullable
// scalar values, so tests catch differences between Rust models and the API.
function sample(type, selection, nullableScalars, required = false) {
  const concrete = getNamedType(type);
  if (isNonNullType(type)) return sample(type.ofType, selection, nullableScalars, true);
  if (nullableScalars && !required && (isScalarType(concrete) || isEnumType(concrete))) return null;
  if (isListType(type)) return [sample(type.ofType, selection, nullableScalars)];
  if (isEnumType(type)) return type.getValues()[0].name;
  if (isScalarType(type)) {
    return ({ ID: "fixture-id", String: "fixture", Int: 1, Float: 1.5, Boolean: true, BigInt: "1024", DateTime: "2026-10-03T00:00:00Z", URL: "https://example.com", UUID: "00000000-0000-4000-8000-000000000001", GenericScalar: {}, JSONString: "{}" })[type.name] ?? "fixture";
  }
  if (isAbstractType(type)) {
    const candidate = selection.selections.filter((field) => field.kind === "InlineFragment")
      .map((field) => schema.getType(field.typeCondition.name.value))
      .find((candidate) => isObjectType(candidate) && schema.isSubType(type, candidate));
    type = candidate ?? schema.getPossibleTypes(type)[0];
  }
  const data = {};
  function fields(set) {
    for (const field of set.selections) {
      if (field.kind === "InlineFragment") {
        const condition = schema.getType(field.typeCondition.name.value);
        if (condition === type || (isAbstractType(condition) && schema.isSubType(condition, type))) fields(field.selectionSet);
      } else if (field.kind === "Field") {
        const name = field.name.value;
        data[field.alias?.value ?? name] = name === "__typename" ? type.name : sample(type.getFields()[name].type, field.selectionSet, nullableScalars);
      }
    }
  }
  fields(selection);
  return data;
}
const fixturePaths = {
  VIEWER_QUERY: "/viewer",
  GET_APP_BY_ID_QUERY: "/app",
  GET_DEPLOYMENT_STATUS_QUERY: "/autobuildDeploymentStatus",
  GET_APP_ALIASES_QUERY: "/nodes/0",
  CREATE_APP_VOLUME_MUTATION: "/createAppVolume/volume",
  CREATE_APP_DATABASE_MUTATION: "/createAppDb",
  GET_APP_CACHE_QUERY: "/node",
  GET_CRON_JOBS_BY_IDS_QUERY: "/nodes/0",
  GET_APP_GIT_CONNECTION_QUERY: "/node/githubRepoConnection",
  GET_DNS_DOMAINS_QUERY: "/nodes/0",
  UPSERT_DNS_RECORD_MUTATION: "/upsertDNSRecord/record",
  SEND_APP_EMAIL_MUTATION: "/sendAppEmail/message",
  GET_APP_LOGS_QUERY: "/node/logs/edges/0/node",
  GET_APP_SSH_SERVER_QUERY: "/node/sshServer",
  GET_SSH_USERS_BY_IDS_QUERY: "/nodes/0",
  REVEAL_SSH_USER_PASSWORD_MUTATION: "/revealSshUserPassword",
  GET_SSH_AUTHORIZED_KEYS_QUERY: "/node/authorizedKeys/edges/0/node",
  SEARCH_PACKAGES_QUERY: "/search/edges/0/node",
  USAGE_APP_METRICS_QUERY: "/node/groupedMetrics",
};
const fixtures = {};
for (const [name, pointer] of Object.entries(fixturePaths)) {
  const operation = documents.get(name).definitions[0];
  const type = operation.operation === "mutation" ? schema.getMutationType() : schema.getQueryType();
  for (const nulls of [false, true]) {
    let data = sample(type, operation.selectionSet, nulls);
    for (const key of pointer.split("/").slice(1)) data = data[key];
    fixtures[`${name}${nulls ? "_NULLABLE" : ""}`] = data;
  }
}
const fixturePath = new URL("rust/tests/fixtures/responses.json", root);
const fixtureContent = JSON.stringify(fixtures, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(fixturePath, "utf8") !== fixtureContent) throw new Error("response fixtures are stale; run node rust/tools/generate.mjs");
} else writeFileSync(fixturePath, fixtureContent);
let generated = "// Generated by tools/generate.mjs. Do not edit by hand.\n\nuse serde::{Deserialize, Serialize};\n\n";
for (const name of [...needed].sort()) {
  const type = types.get(name);
  generated += doc(type.description);
  if (type.kind === "EnumTypeDefinition") {
    generated += `#[derive(Clone, Copy, Debug, Default, Deserialize, Serialize, Eq, PartialEq)]\npub enum ${name} {\n`;
    type.values.forEach((value, index) => {
      if (index === 0) generated += "    #[default]\n";
      generated += `    #[serde(rename = "${value.name.value}")]\n    ${pascal(value.name.value)},\n`;
    });
  } else {
    generated += `#[derive(Clone, Debug, Default, Deserialize, Serialize)]\npub struct ${name} {\n`;
    for (const field of type.fields) {
      generated += doc(field.description).split("\n").filter(Boolean).map((line) => `    ${line}\n`).join("");
      generated += `    #[serde(rename = "${field.name.value}"${field.type.kind === "NonNullType" ? "" : ', default, skip_serializing_if = "Option::is_none"'})]\n`;
      generated += `    pub ${fieldName(field.name.value)}: ${rustType(field.type, name)},\n`;
    }
  }
  generated += "}\n\n";
}
const outputs = [
  ["inputs.rs", generated],
  ["operations.rs", "//! GraphQL operations shared with the other StackMachine SDKs.\n// Generated by tools/generate.mjs. Do not edit by hand.\n\n" + constants.join("\n") + "\n"],
];
for (const [file, content] of outputs) {
  // rustfmt both fresh output and committed output for stable comparisons.
  const formatted = spawnSync("rustfmt", ["--edition", "2024", "--emit", "stdout"], { input: content, encoding: "utf8" });
  if (formatted.status !== 0) throw new Error(formatted.stderr);
  const path = new URL(`rust/src/${file}`, root);
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== formatted.stdout) throw new Error(`${file} is stale; run node rust/tools/generate.mjs`);
  } else writeFileSync(path, formatted.stdout);
}
console.log(`Validated ${constants.length} operations and ${needed.size} input types.`);
