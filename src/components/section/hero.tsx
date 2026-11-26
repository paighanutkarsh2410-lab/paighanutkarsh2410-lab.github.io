"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Starfield } from "@/components/ui/starfield";
import { TextAnimate } from "@/components/ui/text-animate";
import { Magnetic } from "@/components/motion/magnetic";
import { DATA } from "@/data/resume";

// three.js globe, loaded after first paint so the hero text never waits on it
const TrafficGlobe = dynamic(() => import("@/components/traffic-globe"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full rounded-full bg-orange-500/5" />,
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, (v) => Math.max(0, 1 - v / 0.7));
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  return (
    <section ref={ref} id="hero" className="relative isolate min-h-[100svh] overflow-hidden">
      <Starfield className="absolute inset-0 -z-10" color={dark ? "#ffb37a" : "#7c2d12"} />

      <div className="mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-24 pb-28 lg:grid-cols-[1.15fr_1fr]">
        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-7 flex items-center gap-2 font-mono text-xs text-muted-foreground md:text-sm"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Open to SRE &amp; DevOps roles · {DATA.location}
          </motion.div>

          <h1 className="text-[clamp(3.4rem,10vw,7rem)] font-semibold leading-[0.9] tracking-tighter">
            <span className="sr-only">Utkarsh Paighan</span>
            <TextAnimate as="span" by="character" animation="blurInUp" duration={0.8} once accessible={false} className="block whitespace-nowrap">
              Utkarsh
            </TextAnimate>
            <motion.span
              aria-hidden
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="block whitespace-nowrap pb-[0.08em]"
            >
              Paighan
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-xl text-lg text-muted-foreground md:text-2xl md:leading-snug text-pretty"
          >
            Site Reliability &amp; DevOps Engineer. I build platforms that{" "}
            <span className="font-medium text-orange-500">ship safely and stay up.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
            <a href="#projects" className="inline-flex items-center rounded-full bg-orange-500 px-7 py-3.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-orange-400 active:scale-[0.98]">
              See what I&apos;ve built <ArrowRight className="ml-2 size-4" />
            </a>
            </Magnetic>
            <Magnetic strength={0.12}>
            <a
              href="#contact"
              className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98]"
            >
              Get in touch
            </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: globeY, scale: globeScale }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[600px]"
        >
          <TrafficGlobe key={dark ? "d" : "l"} dark={dark} />
        </motion.div>
      </div>

      <motion.a
        href="#tunnel"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 rounded-full border border-border/70 p-2 text-muted-foreground md:block"
      >
        <ArrowDown className="size-4" />
      </motion.a>
    </section>
  );
}
