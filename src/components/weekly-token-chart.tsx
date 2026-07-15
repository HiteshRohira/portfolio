"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import usage from "@/data/codex-usage.json";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  tokens: {
    label: "Tokens",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

const shortDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const updatedDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function asDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function compactTokens(tokens: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: tokens >= 1_000_000 ? 1 : 0,
  }).format(tokens);
}

const chartData = usage.weeks.map((item) => ({
  ...item,
  label: shortDate.format(asDate(item.week)),
}));

const currentWeek = chartData.at(-1);

export function WeeklyTokenChart() {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/60 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b border-border/60 px-4 py-4 sm:px-6">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Weekly Codex usage
          </p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {compactTokens(currentWeek?.tokens ?? 0)}
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              tokens
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/40 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-foreground" />
          </span>
          {currentWeek?.partial ? "Current week" : "Latest week"}
        </div>
      </CardHeader>
      <CardContent className="px-1 pb-3 pt-5 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="h-[240px] w-full aspect-auto"
          role="img"
          aria-label="Area chart showing weekly Codex token usage"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tokenFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tokens)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tokens)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              minTickGap={24}
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
                  hideLabel
                  indicator="line"
                  formatter={(value, _name, item) => {
                    const hoveredWeek = item.payload as (typeof chartData)[number];

                    return (
                      <div className="grid min-w-[11rem] gap-1.5">
                        <span className="font-medium text-foreground">
                          {shortDate.format(asDate(hoveredWeek.week))}–
                          {shortDate.format(asDate(hoveredWeek.weekEnd))}
                          {hoveredWeek.partial ? " · partial" : ""}
                        </span>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Tokens</span>
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {Number(value).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Area
              dataKey="tokens"
              type="monotone"
              fill="url(#tokenFill)"
              fillOpacity={1}
              stroke="var(--color-tokens)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
            />
          </AreaChart>
        </ChartContainer>
        <p className="px-3 pt-2 text-[11px] text-muted-foreground sm:px-2">
          All projects · Monday–Sunday · Updated {updatedDate.format(new Date(usage.updatedAt))}
        </p>
      </CardContent>
    </Card>
  );
}
