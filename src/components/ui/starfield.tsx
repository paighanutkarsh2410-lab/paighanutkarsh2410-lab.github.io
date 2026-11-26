"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo } from "react";

/**
 * The hero's drifting dots, without a canvas: a few hundred small elements, each drifting on a
 * CSS animation of its own, in three depth layers that lean towards the cursor. Everything moves
 * by transform and opacity, so the GPU composites it and nothing is redrawn. (A 2D canvas redrawn
 * every frame made the page wait whenever the GPU was busy elsewhere.)
 */
type Dot = { x: number; y: number; size: number; alpha: number; dur: number; delay: number; dx: number; dy: number };

function dots(count: number, seed: number): Dot[] {
  // A small seeded generator, so server and client draw the same field.
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    size: 1 + rnd() * 1.6,
    alpha: 0.25 + rnd() * 0.6,
    dur: 14 + rnd() * 22,
    delay: -rnd() * 30,
    dx: (rnd() - 0.5) * 60,
    dy: (rnd() - 0.5) * 60,
  }));
}

export function Starfield({ color, className = "" }: { color: string; className?: string }) {
  const reduce = useReducedMotion();
  // 140 dots; phones show about a third of them (the rest are hidden by CSS, so the server and
  // the browser render the same markup).
  const layers = useMemo(() => [dots(70, 7), dots(42, 23), dots(28, 61)], []);

  // The cursor, eased; nearer layers lean further.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const lean = [6, 14, 26].map((k) => ({ x: useTransform(sx, (v) => v * k), y: useTransform(sy, (v) => v * k) })); // eslint-disable-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (reduce) return;
    const on = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [reduce, mx, my]);

  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      {layers.map((layer, l) => (
        <motion.div key={l} className="absolute inset-0 will-change-transform" style={reduce ? undefined : lean[l]}>
          {layer.map((d, i) => (
            <span
              key={i}
              className={`starfield-dot absolute rounded-full ${i % 3 ? "max-md:hidden" : ""}`}
              style={
                {
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: d.size,
                  height: d.size,
                  background: color,
                  opacity: d.alpha,
                  "--dx": `${d.dx}px`,
                  "--dy": `${d.dy}px`,
                  animationDuration: reduce ? "0s" : `${d.dur}s`,
                  animationDelay: `${d.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
