import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Projects",
  description: "Things I've built: apps, tools, and games.",
};

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsPage() {
  return (
    <main className="flex flex-col space-y-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3" />
          Home
        </Link>
        <h1 className="text-2xl font-bold tracking-tighter">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Things I&apos;ve built: apps, tools, and games.
        </p>
      </BlurFade>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DATA.projects.map((project, id) => (
          <BlurFade
            key={project.title}
            delay={BLUR_FADE_DELAY * 2 + id * 0.05}
          >
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
    </main>
  );
}
