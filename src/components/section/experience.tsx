"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { DATA } from "@/data/resume";

type Item = { when: string; title: string; org: string; body?: string };

const range = (a: string, b?: string) => (b && b !== a ? `${a} – ${b}` : a);

const ITEMS: Item[] = [
  ...DATA.work.map((w) => ({ when: range(w.start, w.end), title: w.title, org: `${w.company} · ${w.location}`, body: w.description })),
  ...DATA.education.map((e) => ({ when: range(e.start, e.end), title: e.degree, org: e.school })),
];

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 py-24 md:py-32">
      <SectionHeading eyebrow="Experience & education" title={<>Where I&apos;ve learned <span className="text-muted-foreground">the craft.</span></>} />
      <div ref={ref} className="relative ml-2 md:ml-[180px]">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
        <motion.div style={{ scaleY }} className="absolute left-0 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-orange-500 via-rose-500 to-orange-300" />
        <div className="flex flex-col gap-12">
          {ITEMS.map((it, i) => (
            <Reveal key={it.org + it.when} delay={0.05} className="relative pl-8 md:pl-12">
              <span className="absolute left-0 top-2 size-3 -translate-x-1/2 rounded-full border-2 border-orange-500 bg-background shadow-[0_0_0_5px_rgba(249,115,22,.12)]" />
              <div className="md:absolute md:-left-[180px] md:top-1 md:w-[150px] md:text-right font-mono text-xs text-muted-foreground">{it.when}</div>
              <h3 className="mt-1 text-xl font-semibold tracking-tight md:mt-0 md:text-2xl">{it.title}</h3>
              <div className="mt-1 text-sm text-orange-500/90">{it.org}</div>
              {it.body && <p className="mt-3 max-w-2xl text-muted-foreground">{it.body}</p>}
              {i === DATA.work.length - 1 && <div className="mt-12 h-px w-full max-w-2xl bg-border/60" />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
