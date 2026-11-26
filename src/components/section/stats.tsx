"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { MagicCard } from "@/components/ui/magic-card";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { value: 1182, suffix: "", label: "of 1,182 viewers served under k6 load", tag: "Pitwall" },
  { value: 205, suffix: " ms", label: "p99 latency at peak", tag: "Pitwall" },
  { value: 5, suffix: " SLOs", label: "with multi-window burn-rate alerts", tag: "Pitwall" },
  { value: 8, suffix: " agents", label: "detect, diagnose and remediate", tag: "SentryAI" },
  { value: 90, suffix: " races", label: "of real F1 telemetry, replayable", tag: "Pitwall" },
  { value: 0, suffix: "", label: "unsigned images admitted to the cluster", tag: "Dishpatch" },
];

export default function Stats() {
  return (
    <section id="stats" className="relative mx-auto max-w-6xl px-6 py-10 md:py-16">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.07}>
            <MagicCard
              className="h-full rounded-2xl p-5 md:p-7"
              gradientFrom="#f97316"
              gradientTo="#f43f5e"
              gradientColor="rgba(249,115,22,0.10)"
            >
              <div className="relative z-40">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500/90">{s.tag}</div>
                <div className="mt-3 text-4xl font-semibold tracking-tighter tabular-nums md:text-5xl">
                  {s.value === 0 ? "0" : <NumberTicker value={s.value} className="text-foreground" />}
                  <span className="text-2xl text-muted-foreground md:text-3xl">{s.suffix}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </MagicCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
