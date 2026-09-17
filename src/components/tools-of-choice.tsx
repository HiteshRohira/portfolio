const tools = [
  {
    name: "T3 Code",
    icon: "/tools/t3-code.svg",
    iconClassName: "size-7",
  },
  {
    name: "Helium",
    icon: "/tools/helium.svg",
    iconClassName: "size-[17px]",
  },
  {
    name: "Zed",
    icon: "/tools/zed.svg",
    iconClassName: "size-[17px]",
  },
  {
    name: "Ghostty",
    icon: "/tools/ghostty.svg",
    iconClassName: "h-[21px] w-auto",
  },
  {
    name: "Convex",
    icon: "/tools/convex.svg",
    iconClassName: "size-[18px]",
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
              <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[7px] border border-black/10 bg-white">
                <img
                  alt=""
                  aria-hidden="true"
                  className={tool.iconClassName}
                  src={tool.icon}
                />
              </span>
              <span>{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
