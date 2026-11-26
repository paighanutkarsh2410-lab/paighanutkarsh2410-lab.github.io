/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import type { DATA } from "@/data/resume";
import { FLOWS } from "@/data/flows";
import { cn } from "@/lib/utils";

type Project = (typeof DATA.projects)[number];
type Lenis = { stop: () => void; start: () => void };

const EASE = [0.16, 1, 0.3, 1] as const;

/** The shared names that let a card's screenshot and title fly into the view and back. */
export const sharedId = (p: Project, part: "img" | "title") => `project-${part}-${p.title}`;

/**
 * A project, opened: its screenshot flies up from the card, the system assembles itself layer by
 * layer with requests flowing down through it, and the facts and links come in beside it. Esc,
 * Back, the close button or a click outside fold it back into the card.
 */
export function ProjectView({ project: p, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const flow = FLOWS[p.title];

  // Pause the page behind it, close on Esc, and keep focus inside while it's open.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = before;
      lenis?.start();
      opener?.focus({ preventScroll: true });
    };
  }, [onClose]);

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.28 + i * 0.07, ease: EASE } },
          exit: { opacity: 0, transition: { duration: 0.15 } },
        };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 md:p-8" role="dialog" aria-modal="true" aria-labelledby={`pv-${index}`}>
      <motion.button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#070504]/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.35 } }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.05 } }}
      />
      <motion.div
        ref={panel}
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: EASE } }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 16, transition: { duration: 0.35, ease: EASE } }}
        data-lenis-prevent
        className="relative max-h-full w-full max-w-6xl overflow-y-auto overscroll-contain rounded-3xl border border-orange-500/25 bg-[#0d0907] shadow-[0_40px_120px_-30px_rgba(249,115,22,.35)] outline-none"
      >
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          {/* The project: screenshot, name, what it proves, the way in. */}
          <div className="flex flex-col">
            <motion.div layoutId={reduce ? undefined : sharedId(p, "img")} transition={{ duration: 0.65, ease: EASE }} className="relative aspect-[16/9] overflow-hidden">
              <img src={p.image} alt={`${p.title} screenshot`} className="size-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0907] via-transparent to-transparent" />
            </motion.div>
            <div className="flex flex-1 flex-col p-6 md:p-9">
              <motion.div {...rise(0)} className="font-mono text-xs text-orange-500 tabular-nums">
                {String(index + 1).padStart(2, "0")} · {p.dates}
              </motion.div>
              <motion.h3
                id={`pv-${index}`}
                layoutId={reduce ? undefined : sharedId(p, "title")}
                transition={{ duration: 0.65, ease: EASE }}
                className="mt-3 w-fit text-4xl font-semibold tracking-tighter text-white md:text-5xl"
              >
                {p.title}
              </motion.h3>
              <motion.div {...rise(1)} className="prose prose-sm prose-invert mt-5 max-w-none text-pretty text-white/70 prose-strong:text-white">
                <Markdown>{p.description}</Markdown>
              </motion.div>
              <motion.div {...rise(2)} className="mt-6 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-white/60">
                    {t}
                  </span>
                ))}
              </motion.div>
              <motion.div {...rise(3)} className="mt-auto flex flex-wrap gap-2 pt-8">
                {p.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                      i === 0 ? "bg-white text-black hover:bg-orange-500 hover:text-white" : "border border-white/20 text-white hover:border-orange-500/60 hover:text-orange-400"
                    )}
                  >
                    {l.icon}
                    {l.type}
                  </a>
                ))}
              </motion.div>
            </div>
          </div>

          {/* The system, assembling itself, with work flowing down through it. */}
          {flow && (
            <div className="relative border-t border-white/10 p-6 md:p-9 lg:border-l lg:border-t-0">
              <motion.p {...rise(1)} className="font-mono text-xs text-white/50">
                How it works
              </motion.p>
              <motion.p {...rise(2)} className="mt-2 text-xl font-medium tracking-tight text-white">
                {flow.caption}
              </motion.p>
              <ol className="relative mt-7">
                {/* the rail, with pulses travelling down it */}
                <motion.span
                  aria-hidden
                  className="project-rail absolute bottom-6 left-[15px] top-6 w-px origin-top bg-gradient-to-b from-orange-500/70 via-orange-500/40 to-orange-500/10"
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1, transition: { duration: 0.9, delay: 0.35, ease: EASE } }}
                />
                {flow.layers.map((l, i) => (
                  <motion.li
                    key={l.name}
                    className="relative flex gap-4 py-2.5"
                    initial={reduce ? false : { opacity: 0, x: 26, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, delay: 0.42 + i * 0.08, ease: EASE } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    <span className="relative z-10 mt-0.5 grid size-[31px] shrink-0 place-items-center rounded-full border border-orange-500/50 bg-[#140c08] font-mono text-[11px] text-orange-400">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 transition-colors duration-300 hover:border-orange-500/40 hover:bg-orange-500/[0.06]">
                      <span className="block text-sm font-semibold text-white">{l.name}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-white/60">{l.detail}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:border-orange-500/60 hover:text-orange-400"
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.35, duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <X className="size-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
