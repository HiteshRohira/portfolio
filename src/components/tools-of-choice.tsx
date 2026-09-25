const tools = [
  {
    name: "T3 Code",
    icon: "/tools/t3-code.svg",
    iconClassName: "size-7",
    frameClassName: "bg-[#222222]",
  },
  {
    name: "Helium",
    icon: "/tools/helium.svg",
    iconClassName: "size-[21px]",
    frameClassName: "bg-gradient-to-b from-[#162d69] to-[#4668db]",
  },
  {
    name: "Zed",
    icon: "/tools/zed.svg",
    iconClassName: "size-[21px]",
    frameClassName: "bg-[#252525]",
  },
  {
    name: "Ghostty",
    icon: "/tools/ghostty.svg",
    iconClassName: "h-[23px] w-auto",
    frameClassName: "bg-[#19213a]",
  },
  {
    name: "Convex",
    icon: "/tools/convex.svg",
    iconClassName: "size-5",
    frameClassName: "bg-[#241e23]",
  },
] as const;

export function ToolsOfChoice() {
  return (
    <div className="space-y-4">
      <div>
        <h2 id="tools-title" className="text-xl font-bold">
          Tools of choice
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The ones that feel like home.
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-3">
        {tools.map((tool) => (
          <li
            key={tool.name}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[7px] ${tool.frameClassName}`}>
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
  );
}
