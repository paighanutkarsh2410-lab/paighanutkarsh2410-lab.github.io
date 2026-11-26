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
  const reduce = useReducedMotion();
  const EASE = [0.16, 1, 0.3, 1] as const;
  const view = { once: true, margin: "0px 0px -12% 0px" };
  return (
    <div className="mb-12 md:mb-16 max-w-3xl">
      {eyebrow && (
        <motion.div
          className="mb-4 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-orange-500"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.span
            className="h-px w-8 origin-left bg-orange-500/60"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={view}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          />
          {eyebrow}
        </motion.div>
      )}
      {/* the title rises out of a slot: clipped below, it travels up into view */}
      <div className="overflow-hidden pb-[0.12em]">
        <motion.h2
          className="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl"
          initial={reduce ? false : { y: "105%", rotate: 1.5 }}
          whileInView={{ y: 0, rotate: 0 }}
          viewport={view}
          transition={{ duration: 1, delay: 0.08, ease: EASE }}
        >
          {title}
        </motion.h2>
      </div>
      {sub && (
        <motion.p
          className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg text-pretty"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
