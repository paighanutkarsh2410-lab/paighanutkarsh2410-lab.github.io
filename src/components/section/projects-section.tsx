/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Markdown from "react-markdown";
import { ArrowUpRight } from "lucide-react";
import { DATA } from "@/data/resume";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { Tilt } from "@/components/motion/tilt";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { ProjectView, sharedId } from "@/components/project-view";

type Project = (typeof DATA.projects)[number];

type Open = { open: (i: number) => void; openIndex: number | null };

function Card({ p, featured, flip, index, compact, open, openIndex }: { p: Project; featured?: boolean; flip?: boolean; index: number; compact?: boolean } & Open) {
  const reduce = useReducedMotion();
  // While this project is open, its screenshot and title are in the view; the card keeps their
  // space so nothing around it moves.
  const away = openIndex === index;
  const shared = (part: "img" | "title") => (reduce || away ? undefined : sharedId(p, part));
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
          <button
            type="button"
            onClick={() => open(index)}
            aria-label={`Explore ${p.title}: how it works`}
            className={cn("group/img relative block w-full overflow-hidden text-left", featured ? cn("aspect-[16/10] lg:aspect-auto lg:h-full", flip ? "lg:order-1" : "lg:order-2") : "aspect-[16/9]")}
          >
            <motion.div layoutId={shared("img")} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className={cn("absolute inset-0 overflow-hidden", away && "invisible")}>
            <img
              src={p.image}
              alt={`${p.title} screenshot`}
              className={cn(
                "size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/img:scale-[1.06]",
                featured ? "object-left-top" : "object-top"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </motion.div>
            <span className="absolute bottom-4 left-4 inline-flex translate-y-2 items-center gap-2 rounded-full bg-background/85 px-3.5 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-lg transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover/img:translate-y-0 group-hover/img:opacity-100 group-focus-visible/img:translate-y-0 group-focus-visible/img:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
              Explore how it works <ArrowUpRight className="size-3.5" />
            </span>
          </button>
          <div className={cn("flex flex-1 flex-col p-6 md:p-8", featured && cn("lg:p-10", flip ? "lg:order-2" : "lg:order-1"))}>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-500">
              {String(index + 1).padStart(2, "0")} · {p.dates}
            </div>
            <motion.h3
              layoutId={shared("title")}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={cn("mt-3 w-fit font-semibold tracking-tighter", featured ? "text-4xl md:text-5xl" : "text-3xl", away && "invisible")}
            >
              <button type="button" onClick={() => open(index)} className="text-left transition-colors hover:text-orange-500">
                {p.title}
              </button>
            </motion.h3>
            <div className={cn("prose prose-sm mt-4 max-w-none text-pretty text-muted-foreground dark:prose-invert prose-strong:text-foreground", compact && "line-clamp-5")}>
              <Markdown>{p.description}</Markdown>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {(compact ? p.technologies.slice(0, 5) : p.technologies).map((t) => (
                <span key={t} className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {t}
                </span>
              ))}
              {compact && p.technologies.length > 5 && (
                <span className="rounded-full px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">+{p.technologies.length - 5}</span>
              )}
            </div>
            <div className={cn("mt-auto flex flex-wrap gap-2", compact ? "pt-5" : "pt-7")}>
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

/**
 * Phones: the cards glide past continuously and loop forever (the set is rendered twice and the
 * scroll position wraps by one set width). Touching pauses it so the reader can swipe or read;
 * it resumes on its own shortly after.
 */
function MobileCarousel({ open, openIndex }: Open) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = DATA.projects.length;
  const items = [...DATA.projects, ...DATA.projects];

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 34; // px per second
    let raf = 0, last = 0, pos = el.scrollLeft, onScreen = false, resumeAt = 0, touching = false;

    const setWidth = () => {
      const first = el.children[0] as HTMLElement, twin = el.children[n] as HTMLElement;
      return twin && first ? twin.offsetLeft - first.offsetLeft : 0;
    };
    const updateActive = () => {
      const w = setWidth();
      if (!w) return;
      const card = (el.children[0] as HTMLElement).offsetWidth + 16;
      const x = ((el.scrollLeft % w) + w) % w;
      setActive(Math.round(x / card) % n);
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      if (!onScreen || touching || reduce || t < resumeAt) { pos = el.scrollLeft; return; }
      const w = setWidth();
      pos += (SPEED * dt) / 1000;
      if (w && pos >= w) pos -= w; // seamless wrap onto the identical second set
      el.scrollLeft = pos;
    };

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const down = () => { touching = true; };
    const up = () => { touching = false; resumeAt = performance.now() + 2500; };
    const onScroll = () => {
      // a manual swipe past either end wraps too, so it never runs out
      const w = setWidth();
      if (w && touching === false && el.scrollLeft < 2) { el.scrollLeft += w; pos = el.scrollLeft; }
      updateActive();
    };
    el.addEventListener("touchstart", down, { passive: true });
    el.addEventListener("touchend", up, { passive: true });
    el.addEventListener("touchcancel", up, { passive: true });
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    el.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("touchstart", down);
      el.removeEventListener("touchend", up);
      el.removeEventListener("touchcancel", up);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("scroll", onScroll);
    };
  }, [n]);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
  };

  return (
    <div className="md:hidden">
      <div
        ref={track}
        className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label="Projects"
      >
        {items.map((p, i) => (
          <div
            key={`${p.title}-${i}`}
            className="w-[84vw] max-w-[360px] shrink-0"
            aria-roledescription="slide"
            aria-label={`${(i % n) + 1} of ${n}: ${p.title}`}
            aria-hidden={i >= n ? true : undefined}
          >
            <Card p={p} index={i % n} compact open={open} openIndex={i < n ? openIndex : null} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        {DATA.projects.map((p, i) => (
          <button
            key={p.title}
            type="button"
            aria-label={`Show ${p.title}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-6 bg-orange-500" : "w-1.5 bg-border")}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [first, ...rest] = DATA.projects;
  // The open project. Opening adds a history entry, so Back closes it as well as Esc does.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => {
    setOpenIndex(i);
    history.pushState({ project: i }, "");
  }, []);
  const close = useCallback(() => {
    if ((history.state as { project?: number } | null)?.project != null) history.back();
    else setOpenIndex(null);
  }, []);
  useEffect(() => {
    const onPop = () => setOpenIndex(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return (
    <LayoutGroup>
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 py-16 md:py-32">
      <SectionHeading
        eyebrow="Selected work"
        title={
          <>
            Platforms I&apos;ve built <span className="text-muted-foreground">and kept running.</span>
          </>
        }
        sub="Each one ships through GitOps, is watched by real SLOs, and has been broken on purpose to prove it recovers."
      />
      <Reveal className="md:hidden">
        <MobileCarousel open={open} openIndex={openIndex} />
      </Reveal>
      <div className="hidden gap-5 md:grid md:gap-6">
        <Reveal>
          <Card p={first} featured index={0} open={open} openIndex={openIndex} />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {rest.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="h-full">
              <Card p={p} index={i + 1} open={open} openIndex={openIndex} />
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {openIndex != null && <ProjectView key={openIndex} project={DATA.projects[openIndex]} index={openIndex} onClose={close} />}
      </AnimatePresence>
    </section>
    </LayoutGroup>
  );
}
