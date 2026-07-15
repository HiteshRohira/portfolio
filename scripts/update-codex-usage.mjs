#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "src/data/codex-usage.json");
const historyDays = process.env.CODEX_USAGE_DAYS ?? "365";

function parseDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const value = parseDate(date);
  const daysSinceMonday = (value.getUTCDay() + 6) % 7;
  value.setUTCDate(value.getUTCDate() - daysSinceMonday);
  return formatDate(value);
}

function addDays(date, days) {
  const value = parseDate(date);
  value.setUTCDate(value.getUTCDate() + days);
  return formatDate(value);
}

function readCodexBarUsage() {
  try {
    return execFileSync(
      process.env.CODEXBAR_BIN ?? "codexbar",
      [
        "cost",
        "--provider",
        "codex",
        "--format",
        "json",
        "--json-only",
        "--refresh",
        "--days",
        historyDays,
      ],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
    );
  } catch (error) {
    const message = error?.stderr?.toString().trim() || error.message;
    throw new Error(
      `Could not read Codex usage. Install CodexBar first (brew install steipete/tap/codexbar).\n${message}`,
    );
  }
}

const raw = readCodexBarUsage();
const payload = JSON.parse(raw);
const codex = payload.find((entry) => entry.provider === "codex");

if (!codex?.daily?.length) {
  throw new Error("CodexBar returned no daily Codex usage.");
}

const totalsByWeek = new Map();

for (const day of codex.daily) {
  const week = startOfWeek(day.date);
  totalsByWeek.set(week, (totalsByWeek.get(week) ?? 0) + (day.totalTokens ?? 0));
}

const firstWeek = [...totalsByWeek.keys()].sort()[0];
const currentWeek = startOfWeek(formatDate(new Date()));
const lastUsageWeek = [...totalsByWeek.keys()].sort().at(-1);
const lastWeek = lastUsageWeek > currentWeek ? lastUsageWeek : currentWeek;
const weeks = [];

for (let week = firstWeek; week <= lastWeek; week = addDays(week, 7)) {
  weeks.push({
    week,
    weekEnd: addDays(week, 6),
    tokens: totalsByWeek.get(week) ?? 0,
    partial: week === currentWeek,
  });
}

const result = {
  updatedAt: codex.updatedAt ?? new Date().toISOString(),
  source: "CodexBar local session scan",
  weeks,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

const total = weeks.reduce((sum, week) => sum + week.tokens, 0);
console.log(`Updated ${weeks.length} weeks (${total.toLocaleString()} tokens) at ${outputPath}`);
