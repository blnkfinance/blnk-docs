#!/usr/bin/env node
/**
 * Encode a map workflow JSON the way mmm-canvas does, then shorten it.
 *
 *   node shorten-map-url.mjs <workflow.json>
 *
 * First run: npm install  (in this scripts/ directory)
 *
 * Prints one URL. Prefer the shortUrl from map.blnkfinance.xyz/shorten.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let LZString;
try {
  LZString = require("lz-string");
} catch {
  console.error("lz-string is missing. From this scripts/ directory run: npm install");
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node shorten-map-url.mjs <workflow.json>");
  process.exit(1);
}

const workflow = JSON.parse(readFileSync(inputPath, "utf8"));
const payload = {
  name: workflow.name || "Money movement map",
  nodes: workflow.nodes || [],
  edges: workflow.edges || [],
  ...(Array.isArray(workflow.flows) && workflow.flows.length
    ? { flows: workflow.flows }
    : {}),
};

const token = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
const longUrl = `https://map.blnkfinance.com/s#${token}`;

let url = longUrl;
try {
  const res = await fetch("https://map.blnkfinance.xyz/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: longUrl }),
  });
  if (res.ok) {
    const data = await res.json();
    if (typeof data.shortUrl === "string" && data.shortUrl) {
      url = data.shortUrl;
    }
  }
} catch {
  // Keep the long URL if shorten is unreachable.
}

process.stdout.write(`${url}\n`);
