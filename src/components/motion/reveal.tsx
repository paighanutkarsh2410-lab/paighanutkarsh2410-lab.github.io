"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Blur-and-rise into view, once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Section heading: small eyebrow + large title, revealed together. */
export function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 md:mb-16 max-w-3xl">
      {eyebrow && (
        <div className="mb-4 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-orange-500">
          <span className="h-px w-8 bg-orange-500/60" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl">{title}</h2>
      {sub && <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg text-pretty">{sub}</p>}
    </Reveal>
  );
}
