/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { TunnelArrival } from "./tunnel-arrival";

/* ------------------------------------------------------------------ *
 * A corridor rendered with CSS 3D. The "world" is translated toward the
 * viewer as you scroll, so panels hung along both walls rush past.
 * ------------------------------------------------------------------ */

const GAP = 1100; // depth between panels (px)
const LEAD = 700; // empty corridor before the first panel

type Panel = { side: -1 | 1; kind: "project" | "skills"; render: ReactNode };

function ProjectPanel({ p, i }: { p: (typeof DATA.projects)[number]; i: number }) {
  return (
    <a href={`#projects`} className="group block size-full overflow-hidden rounded-2xl border border-orange-500/30 bg-[#120c09] shadow-[0_0_60px_-10px_rgba(249,115,22,.45)]">
      <div className="relative h-[60%] overflow-hidden">
        <img src={p.image} alt="" className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120c09] via-transparent" />
      </div>
      <div className="p-4 md:p-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-orange-400 md:text-[10px]">
          {String(i + 1).padStart(2, "0")} · project
        </div>
        <div className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-4xl">{p.title}</div>
        <div className="mt-1 line-clamp-2 text-xs text-white/70 md:text-base">{p.dates}</div>
      </div>
    </a>
  );
}


function SkillsPanel() {
  return (
    <div className="flex size-full flex-col justify-center rounded-2xl border border-orange-500/30 bg-[#0f0b09] p-5 shadow-[0_0_60px_-14px_rgba(249,115,22,.45)] md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-400 md:text-xs">tech stack</div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-white md:text-3xl">What I build with</div>
      <div className="mt-4 grid grid-cols-4 gap-1.5 md:grid-cols-5 md:gap-2.5">
        {DATA.skills.slice(0, 15).map((s, i) => (
          <div key={s.name} className={i >= 12 ? "hidden flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2 md:flex md:py-3" : "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2 md:py-3"}>
            <s.icon className="size-5 md:size-7" />
            <span className="text-[9px] text-white/70 md:text-xs">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function buildPanels(): Panel[] {
  const [pit, lb, sai, dp] = DATA.projects;
  return [
    { side: -1, kind: "project", render: <ProjectPanel p={pit} i={0} /> },
    { side: 1, kind: "project", render: <ProjectPanel p={lb} i={1} /> },
    { side: -1, kind: "project", render: <ProjectPanel p={sai} i={2} /> },
    { side: 1, kind: "project", render: <ProjectPanel p={dp} i={3} /> },
    { side: -1, kind: "skills", render: <SkillsPanel /> },
  ];
}

function PanelInWorld({
  panel,
  z,
  cam,
  w,
  h,
  spread,
}: {
  panel: Panel;
  z: number;
  cam: MotionValue<number>;
  w: number;
  h: number;
  spread: number;
}) {
  // distance from the viewer: large = far ahead, negative = already passed
  const dist = useTransform(cam, (c) => z - c);
  const opacity = useTransform(dist, (d) => (d < -260 ? 0 : d < -40 ? (d + 260) / 220 : d < 2400 ? 1 : d < 3600 ? 1 - (d - 2400) / 1200 : 0));
  const x = panel.side * spread - w / 2;
  const y = 0.03 * h - h / 2;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: w,
        height: h,
        opacity,
        transform: `translate3d(${x}px, ${y}px, ${-z}px) rotateY(${-panel.side * 9}deg)`,
      }}
    >
      {panel.render}
    </motion.div>
  );
}

export default function Tunnel() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [vw, setVw] = useState(1440);
  const [vh, setVh] = useState(900);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const on = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    on();
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const panels = buildPanels();
  const END = LEAD + panels.length * GAP + 900; // stop just in front of the monogram
  const mobile = vw < 768;
  // phones and tablets: no giant 3D planes. Each wall is a texture of several hundred MB at 3x,
  // which is enough for iOS Safari to kill and reload the tab.
  const lite = mobile || coarse;
  const pw = mobile ? Math.min(vw * 0.86, 360) : Math.min(vw * 0.44, 660);
  const ph = pw * 0.7;
  const spread = mobile ? vw * 0.05 : Math.min(vw * 0.2, 300);
  const half = Math.max(vw, 900) * 0.5; // corridor half-width

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const camRaw = useTransform(scrollYProgress, [0, 1], [0, END]);
  const cam = useSpring(camRaw, { stiffness: 140, damping: 30, mass: 0.4 });
  const worldZ = useTransform(cam, (c) => `translateZ(${c}px)`);
  const gridShift = useTransform(cam, (c) => `${-(c % 200)}px`);

  // pointer sway — the camera leans toward the cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const swayY = useTransform(sx, (v) => v * 4);
  const swayX = useTransform(sy, (v) => -v * 3);

  const introOpacity = useTransform(scrollYProgress, (v) => Math.max(0, 1 - v / 0.06));
  const progressW = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  if (reduce) return null;

  const wallStyle = (bgPos: MotionValue<string>) => ({
    backgroundImage:
      "linear-gradient(90deg, rgba(249,115,22,.55) 1px, transparent 1px), linear-gradient(0deg, rgba(249,115,22,.18) 1px, transparent 1px)",
    backgroundSize: "200px 100%, 100% 120px",
    backgroundPositionX: bgPos,
    WebkitMaskImage: "linear-gradient(90deg, #000 0%, rgba(0,0,0,.6) 35%, transparent 75%)",
    maskImage: "linear-gradient(90deg, #000 0%, rgba(0,0,0,.6) 35%, transparent 75%)",
  });
  const DEPTH = 3600;

  return (
    <section
      ref={ref}
      id="tunnel"
      aria-label="Walk-through of projects, numbers and experience"
      style={{ height: `${Math.round(lite ? panels.length * 55 + 110 : panels.length * 90 + 170)}vh` }}
      className="relative"
    >
      <div
        className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(ellipse_at_center,#1d0f08_0%,#0b0706_55%,#050304_100%)]"
        style={{ perspective: mobile ? 700 : 1000, perspectiveOrigin: "50% 50%" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
      >
        {/* far glow at the end of the corridor (a gradient, not a blur filter: far cheaper on phones) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,.32)_0%,rgba(249,115,22,.12)_35%,transparent_70%)]" />

        {lite && (
          <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g stroke="rgba(249,115,22,.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
              {[[0, 0], [100, 0], [0, 100], [100, 100], [25, 100], [75, 100], [0, 75], [100, 75], [0, 25], [100, 25]].map(([x, y], i) => (
                <line key={i} x1="50" y1="50" x2={x} y2={y} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <g className="tunnel-rings" stroke="rgba(249,115,22,.4)" fill="none">
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x="0" y="0" width="100" height="100" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${-i * 1.2}s` }} />
              ))}
            </g>
          </svg>
        )}

        <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateY: swayY, rotateX: swayX }}>
          {!lite && (
            <>
          {/* corridor surfaces — they slide with the camera so the grid streams past */}
          <motion.div
            className="absolute top-0 h-full"
            style={{ left: `calc(50% - ${half}px)`, width: DEPTH, transformOrigin: "left center", transform: "rotateY(90deg)", ...wallStyle(gridShift) }}
          />
          <motion.div
            className="absolute top-0 h-full"
            style={{ left: `calc(50% + ${half}px - ${DEPTH}px)`, width: DEPTH, transformOrigin: "right center", transform: "rotateY(-90deg) scaleX(-1)", ...wallStyle(gridShift) }}
          />
          <motion.div
            className="absolute left-1/2 top-full -translate-x-1/2"
            style={{
              width: half * 2,
              height: DEPTH,
              transformOrigin: "top center",
              transform: "rotateX(-90deg)",
              backgroundImage:
                "linear-gradient(0deg, rgba(249,115,22,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,.22) 1px, transparent 1px)",
              backgroundSize: "100% 200px, 160px 100%",
              backgroundPositionY: gridShift,
              WebkitMaskImage: "linear-gradient(180deg, #000, transparent 75%)",
              maskImage: "linear-gradient(180deg, #000, transparent 75%)",
            }}
          />
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2"
            style={{
              width: half * 2,
              height: DEPTH,
              transformOrigin: "bottom center",
              transform: "rotateX(90deg)",
              backgroundImage: "linear-gradient(90deg, rgba(249,115,22,.16) 1px, transparent 1px)",
              backgroundSize: "160px 100%",
              WebkitMaskImage: "linear-gradient(0deg, #000, transparent 70%)",
              maskImage: "linear-gradient(0deg, #000, transparent 70%)",
            }}
          />

            </>
          )}
          <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: worldZ }}>
            {panels.map((p, i) => (
              <PanelInWorld key={i} panel={p} z={LEAD + i * GAP} cam={cam} w={pw} h={ph} spread={spread} />
            ))}
          </motion.div>
        </motion.div>

        {/* arrival at the end of the tunnel */}
        <TunnelArrival progress={scrollYProgress} mobile={mobile} />

        {/* entry caption */}
        <motion.div style={{ opacity: introOpacity }} className="pointer-events-none absolute inset-x-0 top-[14%] px-6 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-orange-400">The work, up close</div>
          <div className="mt-3 text-4xl font-semibold tracking-tighter text-white md:text-6xl">Four platforms. One way of building.</div>
        </motion.div>

        {/* depth gauge */}
        <div className="pointer-events-none absolute bottom-24 left-1/2 h-px w-40 -translate-x-1/2 bg-white/10 md:bottom-10">
          <motion.div className="h-full bg-gradient-to-r from-orange-500 to-rose-500" style={{ width: progressW }} />
        </div>
        <div className={cn("pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_60px_#050304]")} />
      </div>
    </section>
  );
}
