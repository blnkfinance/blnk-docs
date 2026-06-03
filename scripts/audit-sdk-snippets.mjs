#!/usr/bin/env node
/**
 * Flags likely-invalid SDK method calls in Core MDX snippets.
 * Run: node scripts/audit-sdk-snippets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SCAN_DIRS = [
  "ledgers",
  "balances",
  "transactions",
  "identities",
  "metadata",
  "reconciliations",
  "search",
  "guides",
  "home",
  "tutorials",
  "sdks",
  "hooks",
];

const TS_ALLOW = {
  Ledgers: new Set(["create", "get"]),
  LedgerBalances: new Set(["create", "get"]),
  Transactions: new Set(["create", "createBulk", "updateStatus", "refund"]),
  Identity: new Set(["create", "get", "list", "update"]),
  BalanceMonitor: new Set(["create", "get", "list", "update"]),
  Reconciliation: new Set(["upload", "createMatchingRule", "run"]),
  Search: new Set(["search"]),
};

const GO_ALLOW = {
  Ledger: new Set(["Create", "Get", "List", "Filter"]),
  LedgerBalance: new Set(["Create", "Get", "GetByIndicator", "GetHistorical", "Filter"]),
  Transaction: new Set(["Create", "Get", "Update", "Refund", "Filter"]),
  Metadata: new Set(["UpdateMetadata"]),
  Identity: new Set(["Create", "Get", "List", "Update"]),
  BalanceMonitor: new Set(["Create", "Get", "List", "Update"]),
  Reconciliation: new Set(["Upload", "CreateMatchingRule", "Run"]),
  Search: new Set(["SearchDocument"]),
};

const TS_PATTERNS = [
  /\bblnk\.(\w+)\.(\w+)\s*\(/g,
  /\bawait\s+(\w+)\.(\w+)\s*\(/g,
  /\b(\w+)\.(\w+)\s*\(/g,
];

const GO_PATTERN = /\bclient\.(\w+)\.(\w+)\s*\(/g;

const TS_BLOCKLIST = new Set([
  "updateName",
  "updateMetadata",
  "updateIdentity",
  "updateInflight",
  "retrieve",
  "get", // Transactions.get — allow LedgerBalances.get, Ledgers.get via allowlist
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (name.endsWith(".mdx")) files.push(p);
  }
  return files;
}

function extractCodeBlocks(content) {
  const blocks = [];
  const re = /```(\w+)?[^\n]*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(content))) {
    const lang = (m[1] || "").toLowerCase();
    if (lang === "typescript" || lang === "javascript" || lang === "go") {
      blocks.push({ lang, code: m[2], index: m.index });
    }
  }
  return blocks;
}

function auditTs(code, file) {
  const issues = [];
  const re = /(?:blnk\.|await\s+)?(Ledgers|LedgerBalances|Transactions|Identity|BalanceMonitor|Reconciliation|Search)\.(\w+)\s*\(/g;
  let m;
  while ((m = re.exec(code))) {
    const svc = m[1];
    const method = m[2];
    const allowed = TS_ALLOW[svc];
    if (!allowed) continue;
    if (!allowed.has(method)) {
      issues.push({ file, svc, method, lang: "ts" });
    }
  }
  // Destructured service names without blnk prefix
  const re2 = /await\s+(Transactions|Ledgers|LedgerBalances)\.(\w+)\s*\(/g;
  while ((m = re2.exec(code))) {
    const svc = m[1];
    const method = m[2];
    const allowed = TS_ALLOW[svc];
    if (allowed && !allowed.has(method)) {
      issues.push({ file, svc, method, lang: "ts" });
    }
  }
  if (/Transactions\.inflight\./.test(code)) {
    issues.push({ file, svc: "Transactions", method: "inflight.*", lang: "ts" });
  }
  if (/LedgerBalances\.get\s*\(\s*\)/.test(code)) {
    issues.push({ file, svc: "LedgerBalances", method: "get()", lang: "ts" });
  }
  return issues;
}

function auditGo(code, file) {
  const issues = [];
  let m;
  const re = GO_PATTERN;
  while ((m = re.exec(code))) {
    const svc = m[1];
    const method = m[2];
    const allowed = GO_ALLOW[svc];
    if (!allowed) continue;
    if (!allowed.has(method)) {
      issues.push({ file, svc, method, lang: "go" });
    }
  }
  return issues;
}

function main() {
  const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  const all = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, "utf8");
    for (const block of extractCodeBlocks(content)) {
      if (block.lang === "go") all.push(...auditGo(block.code, rel));
      else all.push(...auditTs(block.code, rel));
    }
  }

  const seen = new Set();
  const unique = all.filter((i) => {
    const k = `${i.file}:${i.lang}:${i.svc}.${i.method}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  if (unique.length === 0) {
    console.log("No SDK allowlist violations found.");
    process.exit(0);
  }

  console.log(`Found ${unique.length} potential violation(s):\n`);
  for (const i of unique.sort((a, b) => a.file.localeCompare(b.file))) {
    console.log(`  ${i.file} [${i.lang}] ${i.svc}.${i.method}`);
  }
  process.exit(1);
}

main();
