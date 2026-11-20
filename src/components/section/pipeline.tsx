"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import { GitCommitHorizontal, ShieldCheck, PackageCheck, Bot } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { brandIcon } from "@/components/ui/svgs/brand-icon";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const Actions = brandIcon("githubactions", "#2088FF");
const Argo = brandIcon("argo", "#EF7B4D");
const Prom = brandIcon("prometheus", "#E6522C");
const Grafana = brandIcon("grafana", "#F46800");

const Node = forwardRef<HTMLDivElement, { children: ReactNode; label: string; big?: boolean; className?: string }>(
  ({ children, label, big, className }, ref) => (
    <div className={cn("relative z-10 flex flex-col items-center gap-2", className)}>
      <div
        ref={ref}
        className={cn(
          "grid place-items-center rounded-2xl border border-border bg-background shadow-[0_0_24px_-8px_rgba(249,115,22,.35)]",
          big ? "size-20 md:size-24" : "size-12 md:size-16"
        )}
      >
        {children}
      </div>
      <span className="max-w-[88px] text-center font-mono text-[10px] leading-tight text-muted-foreground md:max-w-none md:whitespace-nowrap md:text-xs">{label}</span>
    </div>
  )
);
Node.displayName = "Node";

const STEPS = [
  ["01", "Commit", "Every change starts as a pull request."],
  ["02", "Gate", "Tests, CodeQL, Trivy, ZAP and an SBOM, or it doesn't ship."],
  ["03", "Sign", "Keyless cosign signature; unsigned images are rejected at admission."],
  ["04", "Deploy", "Argo CD syncs from Git; Argo Rollouts canaries with automated analysis."],
  ["05", "Observe", "SLO burn-rate alerts, traces and dashboards; AI agents help remediate."],
];

export default function Pipeline() {
  const box = useRef<HTMLDivElement>(null);
  const commit = useRef<HTMLDivElement>(null);
  const ci = useRef<HTMLDivElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const reg = useRef<HTMLDivElement>(null);
  const argo = useRef<HTMLDivElement>(null);
  const k8s = useRef<HTMLDivElement>(null);
  const prom = useRef<HTMLDivElement>(null);
  const graf = useRef<HTMLDivElement>(null);
  const bot = useRef<HTMLDivElement>(null);

  const beam = { containerRef: box, gradientStartColor: "#f97316", gradientStopColor: "#f43f5e", pathOpacity: 0.15, duration: 3.2 } as const;

  return (
    <section id="pipeline" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 py-24 md:py-32">
      <SectionHeading
        eyebrow="How I ship"
        title={
          <>
            From commit to cluster, <span className="text-muted-foreground">nothing unsigned gets through.</span>
          </>
        }
        sub="The delivery path behind Dishpatch, Launchbay and Pitwall. Every hop automated, every artifact verified, every release watched."
      />
      <Reveal>
        <div
          ref={box}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-muted/40 to-background px-4 py-12 md:px-12 md:py-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,.10),transparent_60%)]" />
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-y-10">
            <div className="flex flex-col items-start gap-8 md:gap-10">
              <Node ref={commit} label="git push"><GitCommitHorizontal className="size-6 md:size-7" /></Node>
              <Node ref={ci} label="GitHub Actions"><Actions className="size-6 md:size-7" /></Node>
              <Node ref={scan} label="Trivy · CodeQL · ZAP"><ShieldCheck className="size-6 text-emerald-500 md:size-7" /></Node>
              <Node ref={reg} label="GHCR · cosign"><PackageCheck className="size-6 text-orange-500 md:size-7" /></Node>
            </div>
            <div className="flex flex-col items-center gap-10 md:gap-14">
              <Node ref={argo} label="Argo CD · Rollouts"><Argo className="size-8 md:size-10" /></Node>
              <Node ref={k8s} big label="Kubernetes"><Kubernetes className="size-10 md:size-12" /></Node>
            </div>
            <div className="flex flex-col items-end gap-10 md:gap-14">
              <Node ref={prom} label="Prometheus · SLOs"><Prom className="size-6 md:size-7" /></Node>
              <Node ref={graf} label="Grafana · Tempo"><Grafana className="size-6 md:size-7" /></Node>
              <Node ref={bot} label="SentryAI agents"><Bot className="size-6 text-violet-500 md:size-7" /></Node>
            </div>
          </div>
          <AnimatedBeam {...beam} fromRef={commit} toRef={argo} curvature={-40} delay={0} />
          <AnimatedBeam {...beam} fromRef={ci} toRef={argo} curvature={-10} delay={0.4} />
          <AnimatedBeam {...beam} fromRef={scan} toRef={argo} curvature={20} delay={0.8} />
          <AnimatedBeam {...beam} fromRef={reg} toRef={argo} curvature={60} delay={1.2} />
          <AnimatedBeam {...beam} fromRef={argo} toRef={k8s} delay={1.6} />
          <AnimatedBeam {...beam} fromRef={k8s} toRef={prom} curvature={-30} delay={2} />
          <AnimatedBeam {...beam} fromRef={k8s} toRef={graf} delay={2.3} />
          <AnimatedBeam {...beam} fromRef={k8s} toRef={bot} curvature={30} delay={2.6} />
          <AnimatedBeam {...beam} fromRef={bot} toRef={k8s} curvature={-30} reverse delay={3} gradientStartColor="#8b5cf6" gradientStopColor="#22c55e" />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map(([n, t, d], i) => (
          <Reveal key={n} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-border/70 p-5 transition-colors hover:border-orange-500/50">
              <div className="font-mono text-xs text-orange-500">{n}</div>
              <div className="mt-2 font-semibold">{t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
