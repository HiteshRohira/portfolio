#!/usr/bin/env node

// Builds src/data/ai-usage.json from the same local sources T3 Code's usage
// view reads, so the numbers match it:
//   - Codex + Claude Code: T3 Code's usage scan cache (~/.t3/userdata/usage-scan-cache-v*.json)
//   - OpenCode: OpenCode's SQLite store (~/.local/share/opencode/opencode*.db)
// Tokens = uncached input + cached input + cache writes + output (+ reasoning for OpenCode),
// deduplicated by record key, bucketed by local calendar day.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "src/data/ai-usage.json");
const days = Number(process.env.AI_USAGE_DAYS ?? 30);
const t3Dir = process.env.T3_USERDATA ?? join(homedir(), ".t3/userdata");
const openCodeDir = process.env.OPENCODE_DATA ?? join(homedir(), ".local/share/opencode");

const PROVIDERS = ["codex", "claude", "opencode"];
const toDay = (ms) => new Date(ms).toLocaleDateString("en-CA"); // YYYY-MM-DD, local time zone

function dayRange(count) {
  const out = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (count - 1));
  for (let i = 0; i < count; i += 1) {
    out.push(toDay(cursor.getTime()));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

const range = dayRange(days);
const firstDay = range[0];
const lastDay = range.at(-1);
const daily = new Map(range.map((day) => [day, { codex: 0, claude: 0, opencode: 0 }]));
const sessions = { codex: new Set(), claude: new Set(), opencode: new Set() };

function add(provider, timestampMs, tokens, sessionId) {
  const day = toDay(timestampMs);
  if (day < firstDay || day > lastDay || tokens <= 0) return;
  daily.get(day)[provider] += tokens;
  if (sessionId) sessions[provider].add(sessionId);
}

// --- Codex + Claude Code from T3 Code's scan cache -------------------------
function latestScanCache() {
  const files = readdirSync(t3Dir)
    .map((name) => ({ name, version: /^usage-scan-cache-v(\d+)\.json$/.exec(name)?.[1] }))
    .filter((file) => file.version !== undefined)
    .sort((a, b) => Number(b.version) - Number(a.version));
  if (!files.length) throw new Error(`No T3 Code usage scan cache found in ${t3Dir}. Open T3 Code's usage view once.`);
  return join(t3Dir, files[0].name);
}

const cachePath = latestScanCache();
const cache = JSON.parse(readFileSync(cachePath, "utf8"));
const seen = new Set();

// Record layout (usageScanCache.ts): [timestampMs, modelIdx, sessionIdx, uncachedInput,
// cachedInput, cacheCreation, output, reasoning, dedupeKey, ...]. Reasoning is already in output.
for (const file of Object.values(cache.files)) {
  if (!PROVIDERS.includes(file.p)) continue;
  for (const record of file.r) {
    const key = record[8];
    if (key !== null) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    const tokens = record[3] + record[4] + record[5] + record[6];
    add(file.p, record[0], tokens, cache.sessions[record[2]]);
  }
}

// --- OpenCode from its SQLite store ----------------------------------------
const tokenSum = [
  "$.tokens.input",
  "$.tokens.cache.read",
  "$.tokens.cache.write",
  "$.tokens.output",
  "$.tokens.reasoning",
]
  .map((path) => `coalesce(json_extract(data, '${path}'), 0)`)
  .join(" + ");

function readOpenCode(dbPath) {
  const tables = execFileSync("sqlite3", ["-readonly", dbPath, "select name from sqlite_master where type='table'"], {
    encoding: "utf8",
  }).split("\n");
  const parts = [];
  if (tables.includes("message")) {
    parts.push(
      `select session_id, time_created as t, ${tokenSum} as tokens from message
       where coalesce(json_extract(data, '$.role'), 'assistant') = 'assistant'`,
    );
  }
  if (tables.includes("session_message")) {
    parts.push(
      `select session_id, time_created as t, ${tokenSum} as tokens from session_message where type = 'assistant'`,
    );
  }
  if (!parts.length) return;
  const since = new Date(`${firstDay}T00:00:00`).getTime() - 86_400_000;
  const sql = `select session_id, t, tokens from (${parts.join(" union all ")}) where t >= ${since}`;
  const rows = execFileSync("sqlite3", ["-readonly", "-json", dbPath, sql], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  for (const row of JSON.parse(rows || "[]")) add("opencode", row.t, row.tokens, row.session_id);
}

if (existsSync(openCodeDir)) {
  for (const name of readdirSync(openCodeDir).filter((n) => /^opencode(?:-[\w-]+)?\.db$/.test(n))) {
    readOpenCode(join(openCodeDir, name));
  }
}

// --- Output ----------------------------------------------------------------
const providers = Object.fromEntries(
  PROVIDERS.map((provider) => [
    provider,
    {
      tokens: range.reduce((sum, day) => sum + daily.get(day)[provider], 0),
      sessions: sessions[provider].size,
    },
  ]),
);

const result = {
  updatedAt: new Date().toISOString(),
  source: "T3 Code usage scan (Codex, Claude Code) + OpenCode local store",
  from: firstDay,
  to: lastDay,
  totalTokens: PROVIDERS.reduce((sum, p) => sum + providers[p].tokens, 0),
  totalSessions: PROVIDERS.reduce((sum, p) => sum + providers[p].sessions, 0),
  providers,
  days: range.map((date) => ({ date, ...daily.get(date) })),
};

writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(
  `Updated ${firstDay} → ${lastDay}: ${(result.totalTokens / 1e9).toFixed(2)}B tokens, ${result.totalSessions} sessions`,
);
for (const p of PROVIDERS) {
  console.log(`  ${p}: ${(providers[p].tokens / 1e6).toFixed(1)}M tokens, ${providers[p].sessions} sessions`);
}
