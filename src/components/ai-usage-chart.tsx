"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import usage from "@/data/ai-usage.json";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const PROVIDERS = ["claude", "codex", "opencode"] as const;
type Provider = (typeof PROVIDERS)[number];

const chartConfig = {
  codex: {
    label: "Codex",
    color: "hsl(var(--foreground))",
  },
  claude: {
    label: "Claude Code",
    color: "hsl(15 63% 60%)",
  },
  opencode: {
    label: "OpenCode",
    color: "hsl(204 55% 56%)",
  },
} satisfies ChartConfig;

const shortDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const asDate = (date: string) => new Date(`${date}T00:00:00Z`);

function compactTokens(tokens: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: tokens >= 1_000_000_000 ? 2 : tokens >= 1_000_000 ? 1 : 0,
  }).format(tokens);
}

const chartData = usage.days.map((day) => ({
  ...day,
  label: shortDate.format(asDate(day.date)),
}));

// Largest share first, like T3 Code's usage view.
const legend = [...PROVIDERS].sort(
  (a, b) => usage.providers[b].tokens - usage.providers[a].tokens,
);

function share(provider: Provider) {
  if (!usage.totalTokens) return "0%";
  return `${((usage.providers[provider].tokens / usage.totalTokens) * 100).toFixed(1)}%`;
}

export function AiUsageChart() {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/60 shadow-none">
      <CardHeader className="space-y-4 border-b border-border/60 px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Last 30 days
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {compactTokens(usage.totalTokens)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                tokens · {usage.totalSessions} sessions
              </span>
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          {legend.map((provider) => (
            <li key={provider} className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: chartConfig[provider].color }}
                />
                <span className="truncate">{chartConfig[provider].label}</span>
                <span className="ml-auto font-mono text-xs tabular-nums sm:ml-0">
                  {compactTokens(usage.providers[provider].tokens)}
                </span>
              </div>
              <p className="pl-4 text-xs text-muted-foreground tabular-nums">
                {share(provider)} · {usage.providers[provider].sessions} sessions
              </p>
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardContent className="px-1 pb-3 pt-5 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="h-[240px] w-full aspect-auto"
          role="img"
          aria-label="Area chart of daily tokens processed with Codex, Claude Code and OpenCode over the last 30 days"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
          >
            <defs>
              {PROVIDERS.map((provider) => (
                <linearGradient
                  key={provider}
                  id={`fill-${provider}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={`var(--color-${provider})`} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={`var(--color-${provider})`} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              minTickGap={32}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={compactTokens}
              width={46}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_label, payload) => {
                    const date = payload?.[0]?.payload?.date as string | undefined;
                    return date ? shortDate.format(asDate(date)) : null;
                  }}
                  formatter={(value, name) => (
                    <div className="flex w-full min-w-[9rem] items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full"
                          style={{ background: `var(--color-${name})` }}
                        />
                        {chartConfig[name as Provider]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {compactTokens(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            {/* Smallest series last so it draws on top. */}
            {legend.map((provider) => (
              <Area
                key={provider}
                dataKey={provider}
                type="monotone"
                fill={`url(#fill-${provider})`}
                fillOpacity={1}
                stroke={`var(--color-${provider})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3.5, strokeWidth: 2, fill: "hsl(var(--background))" }}
              />
            ))}
          </AreaChart>
        </ChartContainer>
        <p className="px-3 pt-2 text-[11px] text-muted-foreground sm:px-2">
          All projects · daily · {shortDate.format(asDate(usage.from))}–
          {shortDate.format(asDate(usage.to))} · from T3 Code usage
        </p>
      </CardContent>
    </Card>
  );
}
