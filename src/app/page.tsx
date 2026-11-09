import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { ToolsOfChoice } from "@/components/tools-of-choice";
import { ListeningTo } from "@/components/listening-to";
import { AiUsageChart } from "@/components/ai-usage-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA, FEATURED_PROJECTS } from "@/data/resume";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

const featuredProjects = DATA.projects.filter((project) =>
  (FEATURED_PROJECTS as readonly string[]).includes(project.title),
);

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 gap-y-3">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <BlurFadeText
                className="max-w-[450px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="ai-usage" aria-labelledby="ai-usage-title">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="ai-usage-title" className="text-xl font-bold">
                Tokens, day by day
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A live-ish footprint of the tokens I burn across Codex, Claude Code and OpenCode.
              </p>
            </div>
          </div>
          <AiUsageChart />
        </BlurFade>
      </section>
      {/*<section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>*/}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                start={work.start}
                end={work.end ?? "Present"}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="projects" aria-labelledby="projects-title">
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 id="projects-title" className="text-xl font-bold">
              Personal Projects
            </h2>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {featuredProjects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 8 + id * 0.05}
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
            <BlurFade delay={BLUR_FADE_DELAY * 8 + featuredProjects.length * 0.05}>
              <Link
                href="/projects"
                className="group flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium">View all projects</span>
                <span className="text-xs text-muted-foreground">
                  {DATA.projects.length} projects
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </Link>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <span className="inline-flex items-center rounded-md border border-border/70 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  {skill}
                </span>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="tools" aria-labelledby="tools-title">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ToolsOfChoice />
        </BlurFade>
      </section>
      <ListeningTo delay={BLUR_FADE_DELAY * 12} />
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Contact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm on{" "}
                <Link
                  href={DATA.contact.social.Twitter.url}
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </Link>
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
