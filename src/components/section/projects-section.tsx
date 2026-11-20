/* eslint-disable @next/next/no-img-element */
"use client";

import Markdown from "react-markdown";
import { ArrowUpRight } from "lucide-react";
import { DATA } from "@/data/resume";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { Tilt } from "@/components/motion/tilt";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Project = (typeof DATA.projects)[number];

function Card({ p, featured, flip, index }: { p: Project; featured?: boolean; flip?: boolean; index: number }) {
  return (
    <Tilt className="h-full" max={featured ? 4 : 7}>
      <MagicCard
        className="h-full rounded-3xl"
        gradientSize={featured ? 420 : 280}
        gradientFrom="#f97316"
        gradientTo="#f43f5e"
        gradientColor="rgba(249,115,22,0.09)"
      >
        <div className={cn("relative z-40 flex h-full flex-col", featured && (flip ? "lg:grid lg:grid-cols-[1.25fr_1fr]" : "lg:grid lg:grid-cols-[1fr_1.25fr]"))}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("group/img relative block overflow-hidden", featured ? cn("aspect-[16/10] lg:aspect-auto lg:h-full", flip ? "lg:order-1" : "lg:order-2") : "aspect-[16/9]")}
          >
            <img
              src={p.image}
              alt={`${p.title} screenshot`}
              className={cn(
                "size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/img:scale-[1.06]",
                featured ? "object-left-top" : "object-top"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover/img:opacity-100">
              <ArrowUpRight className="size-4" />
            </span>
          </a>
          <div className={cn("flex flex-1 flex-col p-6 md:p-8", featured && cn("lg:p-10", flip ? "lg:order-2" : "lg:order-1"))}>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-500">
              {String(index + 1).padStart(2, "0")} · {p.dates}
            </div>
            <h3 className={cn("mt-3 font-semibold tracking-tighter", featured ? "text-4xl md:text-5xl" : "text-3xl")}>{p.title}</h3>
            <div className="prose prose-sm mt-4 max-w-none text-pretty text-muted-foreground dark:prose-invert prose-strong:text-foreground">
              <Markdown>{p.description}</Markdown>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.technologies.map((t) => (
                <span key={t} className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-7">
              {p.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors",
                    i === 0
                      ? "bg-foreground text-background hover:bg-orange-500 hover:text-white"
                      : "border border-border hover:border-orange-500/60 hover:text-orange-500"
                  )}
                >
                  {l.icon}
                  {l.type}
                </a>
              ))}
            </div>
          </div>
        </div>
        {featured && <BorderBeam size={260} duration={9} colorFrom="#f97316" colorTo="#f43f5e" borderWidth={1.5} />}
      </MagicCard>
    </Tilt>
  );
}

export default function ProjectsSection() {
  const [first, ...rest] = DATA.projects;
  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="Selected work"
        title={
          <>
            Platforms I&apos;ve built <span className="text-muted-foreground">and kept running.</span>
          </>
        }
        sub="Each one ships through GitOps, is watched by real SLOs, and has been broken on purpose to prove it recovers."
      />
      <div className="grid gap-5 md:gap-6">
        <Reveal>
          <Card p={first} featured index={0} />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {rest.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="h-full">
              <Card p={p} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
