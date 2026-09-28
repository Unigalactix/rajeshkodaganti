#!/usr/bin/env node
"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { loadAll } = require("../js/sheet-source.js");

async function main() {
  const args = process.argv.slice(2);
  let output;
  let configPath = path.join(__dirname, "../js/sheets-config.json");
  for (let i = 0; i < args.length; i += 2) {
    const value = args[i + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${args[i]}`);
    if (args[i] === "--output") output = value;
    else if (args[i] === "--config") configPath = value;
    else throw new Error(`Unknown option: ${args[i]}`);
  }
  if (!output) throw new Error("Usage: node scripts/export-sheet-data.js --output <snapshot.json> [--config <config.json>]");
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  const data = await loadAll(config);
  if (!data || !data.basics || !data.basics.name) throw new Error("Sheets returned no profile name");
  await fs.mkdir(path.dirname(path.resolve(output)), { recursive: true });
  await fs.writeFile(output, JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
  console.log(`Exported Google Sheets snapshot to ${output}`);
}

main().catch((error) => {
  console.error(`Google Sheets export failed: ${error.message}`);
  process.exitCode = 1;
});
