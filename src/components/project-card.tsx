import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates?: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <Card
      className={
        "group/card flex h-full flex-col overflow-hidden border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg"
      }
    >
      {(image || video) && <Link
        href={href || "#"}
        className={cn("block cursor-pointer overflow-hidden border-b", className)}
      >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
          />
        )}
        {image && (
          <Image
            src={image}
            alt={`${title} poster`}
            width={768}
            height={512}
            sizes="(min-width: 640px) 336px, 100vw"
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.02]"
          />
        )}
      </Link>}
      <CardHeader className="px-3 pt-3">
        <div className="space-y-1">
          <CardTitle className="text-base">
            {href ? (
              <Link href={href} className="inline-flex items-center gap-1">
                {title}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100"
                />
              </Link>
            ) : (
              title
            )}
          </CardTitle>
          {/* <time className="font-sans text-xs">{dates}</time> */}
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            {description}
          </Markdown>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-3">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[10px]"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {links && links.length > 0 && (
        <CardFooter className="justify-end gap-3 px-3 pb-3 pt-3">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-0.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.type}
              <ArrowUpRight
                aria-hidden="true"
                className="size-3 transition-transform group-hover/link:-translate-y-px group-hover/link:translate-x-px"
              />
            </Link>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
