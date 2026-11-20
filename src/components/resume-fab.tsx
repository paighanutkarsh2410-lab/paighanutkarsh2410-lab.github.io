"use client";

import { FileDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { DATA } from "@/data/resume";

/** Always-on resume shortcut: a small round button that widens to show its label on hover or focus. */
export function ResumeFab() {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={DATA.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open resume (PDF)"
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 20 }}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      className="group fixed right-4 bottom-24 z-40 flex h-12 items-center rounded-full border border-orange-500/50 bg-background/85 pl-3.5 pr-3.5 text-sm font-medium shadow-lg shadow-black/40 backdrop-blur-md transition-[padding,border-color,background-color] duration-300 hover:border-orange-500 hover:pr-5 focus-visible:pr-5 sm:right-6 sm:bottom-6"
    >
      <span className="grid size-5 place-items-center text-orange-500">
        <FileDown className="size-5" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-24 group-focus-visible:opacity-100">
        Resume
      </span>
    </motion.a>
  );
}
