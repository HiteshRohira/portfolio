import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  let currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let fullDate = new Date(date).toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (daysAgo < 1) {
    return "Today";
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Parses "Sept 2025" / "February 2021" into a month index (year * 12 + month). "Present" → `now`. */
function monthIndex(value: string, now: Date) {
  if (/^present$/i.test(value.trim())) return now.getFullYear() * 12 + now.getMonth();
  const match = /^([a-z]+)\.?\s+(\d{4})$/i.exec(value.trim());
  const month = match ? MONTHS.indexOf(match[1].slice(0, 3).toLowerCase()) : -1;
  if (!match || month < 0) return null;
  return Number(match[2]) * 12 + month;
}

/**
 * Length of a role, counting the start and end months inclusively (as LinkedIn does),
 * e.g. ("Feb 2021", "May 2025") → "4 years 4 months".
 */
export function formatTenure(start: string, end: string, now = new Date()) {
  const from = monthIndex(start, now);
  const to = monthIndex(end, now);
  if (from === null || to === null || to < from) return null;
  const total = to - from + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;
  return [years && plural(years, "year"), months && plural(months, "month")].filter(Boolean).join(" ");
}
