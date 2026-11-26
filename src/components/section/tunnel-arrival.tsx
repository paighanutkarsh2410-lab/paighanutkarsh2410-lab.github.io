"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { ArrowDown } from "lucide-react";
import { DATA } from "@/data/resume";

/* ------------------------------------------------------------------ *
 * The end of the tunnel: a portal opens, the monogram flips up,
 * the name rises in, the four projects converge into orbit,
 * and a status line reports green. Everything is keyed to `progress`
 * (the tunnel's scroll progress), so scrolling back plays it in reverse.
 * ------------------------------------------------------------------ */

const NAME = "Utkarsh Paighan";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const START = 0.74; // tunnel progress where the arrival begins
const local = (v: number) => clamp((v - START) / (1 - START));

export function TunnelArrival({ progress, mobile }: { progress: MotionValue<number>; mobile: boolean }) {
  // phases of the arrival, each 0..1
  const portal = useTransform(progress, (v) => ease(clamp(local(v) / 0.45)));
  const portalScale = useTransform(portal, (p) => 0.25 + 0.75 * p);
  const flip = useTransform(progress, (v) => ease(clamp((local(v) - 0.12) / 0.4)));
  const monoRotate = useTransform(flip, (f) => 78 * (1 - f));
  const monoY = useTransform(flip, (f) => 60 * (1 - f));
  const monoOpacity = useTransform(flip, (f) => clamp(f * 1.6));
  const chips = useTransform(progress, (v) => ease(clamp((local(v) - 0.55) / 0.3)));
  const chipsY = useTransform(chips, (c) => 12 * (1 - c));
  const ctas = useTransform(progress, (v) => ease(clamp((local(v) - 0.78) / 0.2)));
  const ctasY = useTransform(ctas, (c) => 14 * (1 - c));
  const glow = useTransform(portal, (p) => 0.15 + 0.55 * p);

  // name fades and rises in after the monogram, never before the arrival
  const nameIn = useTransform(progress, (v) => ease(clamp((local(v) - 0.3) / 0.3)));
  const nameY = useTransform(nameIn, (n) => 18 * (1 - n));
  const nameBlur = useTransform(nameIn, (n) => `blur(${(8 * (1 - n)).toFixed(1)}px)`);
  const [live, setLive] = useState(false);
  const [ctaOn, setCtaOn] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    const a = local(v);
    setLive(a > 0);
    setCtaOn(a > 0.85);
  });

  // four projects converge from the corners into an elliptical orbit
  const orbit = useRef<(HTMLAnchorElement | null)[]>([]);
  const converge = useTransform(progress, (v) => ease(clamp((local(v) - 0.25) / 0.45)));
  useAnimationFrame((t) => {
    const c = converge.get();
    if (c <= 0) {
      orbit.current.forEach((el) => { if (el && el.style.opacity !== "0") el.style.opacity = "0"; });
      return;
    }
    const rx = mobile ? 150 : 500, ry = mobile ? 330 : 265;
    const far = 1 + 2.4 * (1 - c);
    orbit.current.forEach((el, i) => {
      if (!el) return;
      const th = (i / 4) * Math.PI * 2 + t / 5200 + Math.PI / 4;
      const depth = Math.sin(th); // -1 back, +1 front
      const x = Math.cos(th) * rx * far, y = depth * ry * far * (mobile ? 1 : 1);
      const s = 0.82 + 0.18 * (depth + 1) / 2;
      el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      el.style.opacity = String(clamp(c * 1.4) * (mobile ? 0.5 : 0.6 + 0.4 * (depth + 1) / 2));
      el.style.zIndex = "2";
    });
  });

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden [perspective:900px]">
      {/* portal: rotating ring of light + shockwaves */}
      <motion.div style={{ scale: portalScale, opacity: portal }} className="absolute left-1/2 top-1/2 size-[min(78vw,640px)] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,#f97316_60deg,transparent_120deg,#fbbf24_200deg,transparent_260deg,#f43f5e_320deg,transparent_360deg)] [mask:radial-gradient(circle,transparent_63%,#000_64%,#000_66%,transparent_67%)]" />
        <div className="absolute inset-[9%] animate-[spin_22s_linear_infinite_reverse] rounded-full border border-dashed border-orange-400/25" />
        <div className="absolute inset-[18%] rounded-full border border-orange-500/10" />
        {live &&
          [0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute inset-[30%] rounded-full border border-orange-400/40 animate-[arrival-wave_3.2s_cubic-bezier(.16,1,.3,1)_infinite]"
              style={{ animationDelay: `${i * 1.05}s` }}
            />
          ))}
      </motion.div>
      <motion.div style={{ opacity: glow }} className="absolute left-1/2 top-1/2 size-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,.45)_0%,rgba(249,115,22,.15)_35%,transparent_68%)]" />

      {/* orbiting projects */}
      <div className="absolute left-1/2 top-1/2 z-[2] size-0">
        {DATA.projects.map((p, i) => (
          <a
            key={p.title}
            ref={(el) => {
              orbit.current[i] = el;
            }}
            href="#projects"
            className="pointer-events-auto absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#140c08]/90 px-3.5 py-1.5 text-xs font-medium text-white/90 opacity-0 will-change-transform md:text-sm"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {p.title}
          </a>
        ))}
      </div>

      {/* centre stack */}
      <div className="relative z-[4] flex flex-col items-center px-6 text-center">
        <motion.div
          style={{ rotateX: monoRotate, y: monoY, opacity: monoOpacity, transformPerspective: 900 }}
          className="relative grid size-24 place-items-center rounded-[1.75rem] bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 text-4xl font-semibold tracking-tight text-white shadow-[0_40px_100px_-30px_rgba(249,115,22,.5)] md:size-32 md:text-5xl"
        >
          <span className="relative">UP</span>
        </motion.div>

        <motion.h2
          style={{ opacity: nameIn, y: nameY, filter: nameBlur }}
          className="mt-7 font-semibold tracking-tighter text-white text-[clamp(2.2rem,6vw,4.5rem)] leading-none"
        >
          {NAME}
        </motion.h2>

        <motion.div style={{ opacity: chips, y: chipsY }} className="mt-5 flex flex-wrap justify-center gap-2">
          {["Site Reliability Engineer", "DevOps Engineer", DATA.location].map((t) => (
            <span key={t} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80 md:text-sm">
              {t}
            </span>
          ))}
        </motion.div>

        <motion.div style={{ opacity: chips }} className="mt-4 flex items-center gap-2 font-mono text-[11px] text-white/60 md:text-xs">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          4 services healthy · 5 SLOs green · open to SRE &amp; DevOps roles
        </motion.div>

        <motion.div style={{ opacity: ctas, y: ctasY }} className={`mt-8 flex flex-wrap justify-center gap-3 ${ctaOn ? "pointer-events-auto" : ""}`}>
          <a href="#projects" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-orange-400 active:scale-[0.98]">
            Explore the work <ArrowDown className="size-4" />
          </a>
          <a href="#contact" className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:border-orange-400/70">
            Get in touch
          </a>
        </motion.div>
      </div>
    </div>
  );
}
