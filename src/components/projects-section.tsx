"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA, FEATURED_PROJECTS } from "@/data/resume";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const featured = FEATURED_PROJECTS.map((title) =>
  DATA.projects.find((project) => project.title === title),
).filter((project) => project !== undefined);

const rest = DATA.projects.filter(
  (project) => !(FEATURED_PROJECTS as readonly string[]).includes(project.title),
);

type Project = (typeof DATA.projects)[number];

function Grid({ projects, delay }: { projects: readonly Project[]; delay: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project, id) => (
        <BlurFade key={project.title} delay={delay + id * 0.05}>
          <ProjectCard
            href={project.href}
            title={project.title}
            description={project.description}
            tags={project.technologies}
            links={project.links}
            image={project.image}
          />
        </BlurFade>
      ))}
    </div>
  );
}

export function ProjectsSection({ delay = 0 }: { delay?: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="projects" aria-labelledby="projects-title" className="space-y-4">
      <BlurFade delay={delay}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="projects-title" className="text-xl font-bold">
              Personal Projects
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Apps, tools and games I&apos;ve built.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            All projects
            <ArrowRight
              aria-hidden="true"
              className="size-3 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </BlurFade>

      <Grid projects={featured} delay={delay + 0.04} />

      {expanded && <div id="more-projects"><Grid projects={rest} delay={0} /></div>}

      {!expanded && rest.length > 0 && (
        <BlurFade delay={delay + 0.04 + featured.length * 0.05}>
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-expanded={expanded}
              aria-controls="more-projects"
              className="group inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Load more
              <span className="tabular-nums text-muted-foreground/70">
                +{rest.length}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:translate-y-px"
              />
            </button>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
