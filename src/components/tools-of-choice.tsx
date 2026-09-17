import { Ghost } from "lucide-react";

const tools = [
  {
    name: "T3 Code",
    mark: (
      <span className="flex size-7 items-center justify-center rounded-[7px] bg-foreground font-mono text-[9px] font-semibold tracking-[-0.08em] text-background">
        T3
      </span>
    ),
  },
  {
    name: "Helium",
    mark: (
      <span className="relative flex size-7 items-center justify-center rounded-[7px] border border-sky-500/20 bg-sky-500/[0.08] font-mono text-[11px] font-medium text-sky-700 dark:text-sky-300">
        He
        <span className="absolute right-1 top-0.5 text-[5px] opacity-60">2</span>
      </span>
    ),
  },
  {
    name: "Zed",
    mark: (
      <span className="flex size-7 items-center justify-center rounded-[7px] border bg-muted/45 text-foreground/75">
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 4h10L3 12h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    ),
  },
  {
    name: "Ghostty",
    mark: (
      <span className="flex size-7 items-center justify-center rounded-[7px] border border-violet-500/20 bg-violet-500/[0.08] text-violet-700 dark:text-violet-300">
        <Ghost aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
      </span>
    ),
  },
  {
    name: "Convex",
    mark: (
      <span className="flex size-7 items-center justify-center gap-[2px] rounded-[7px] border border-orange-500/20 bg-orange-500/[0.07]">
        <span className="h-2.5 w-[3px] -translate-y-[1px] rotate-[24deg] rounded-full bg-orange-500" />
        <span className="h-3 w-[3px] rounded-full bg-rose-500" />
        <span className="h-2.5 w-[3px] translate-y-[1px] rotate-[24deg] rounded-full bg-amber-400" />
      </span>
    ),
  },
] as const;

export function ToolsOfChoice() {
  return (
    <div className="border-t border-dashed pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="shrink-0">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            Tools of choice
          </h2>
          <p className="mt-1 text-xs text-muted-foreground/60">
            The ones that feel like home.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-3 sm:justify-end">
          {tools.map((tool) => (
            <li
              key={tool.name}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tool.mark}
              <span>{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
