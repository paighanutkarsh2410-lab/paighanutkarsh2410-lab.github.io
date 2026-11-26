"use client";

import Markdown from "react-markdown";
import { IconCloud } from "@/components/ui/icon-cloud";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { DATA } from "@/data/resume";

// brand colour by default; marks that ship black get a light tint so they read on the dark ground
const SLUGS = [
  "kubernetes", "docker", "argo", "helm/ffffff", "terraform", "ansible/ee0000", "prometheus", "grafana",
  "githubactions", "linux/ffffff", "python", "postgresql", "apachekafka/ffffff", "redis", "fastapi",
  "react", "git", "ubuntu", "redhat", "opentelemetry/f5a800", "nginx", "gnubash/ffffff", "yaml/ffffff",
  "nextdotjs/ffffff", "github/ffffff", "claude", "jenkins", "vercel/ffffff", "cloudflare", "githubcopilot/ffffff",
];
const images = SLUGS.map((s) => `https://cdn.simpleicons.org/${s}`);

const GROUPS = [
  ["Cloud", "AWS · Azure · Azure DevOps · App Service"],
  ["Orchestration", "Kubernetes · Docker · Helm · Argo CD · Argo Rollouts · KEDA"],
  ["IaC & config", "Terraform · Ansible · Azure Bicep"],
  ["Observability", "Prometheus · Grafana · Loki · Tempo · OpenTelemetry"],
  ["Supply chain", "GitHub Actions · Trivy · CodeQL · OWASP ZAP · cosign · Kyverno"],
  ["Languages", "Python · Shell · YAML · SQL · Java"],
];

export default function Skills() {
  const half = Math.ceil(DATA.skills.length / 2);
  const rows = [DATA.skills.slice(0, half), DATA.skills.slice(half)];
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 py-24 md:py-32">
      <SectionHeading eyebrow="About & toolkit" title={<>Reliability is a feature. <span className="text-muted-foreground">I build it in.</span></>} />
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
        <div>
          <Reveal>
            <div className="prose max-w-none text-lg leading-relaxed text-muted-foreground dark:prose-invert prose-strong:text-foreground prose-a:text-orange-500 text-pretty">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </Reveal>
          <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
            {GROUPS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.05} y={12}>
                <div className="grid grid-cols-[120px_1fr] gap-4 py-3 text-sm md:grid-cols-[150px_1fr]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80 pt-0.5">{k}</span>
                  <span>{v}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.15}>
          <div className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center">
            <div className="pointer-events-none absolute inset-8 rounded-full bg-orange-500/10 blur-3xl" />
            <IconCloud images={images} showControl={false} />
          </div>
          <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">drag the sphere · click an icon</p>
        </Reveal>
      </div>

      <div className="relative mt-16 flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        {rows.map((row, r) => (
          <Marquee key={r} reverse={r === 1} pauseOnHover className="[--duration:38s] [--gap:0.75rem]">
            {row.map((s) => (
              <div key={s.name} className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm font-medium">
                <s.icon className="size-4" />
                {s.name}
              </div>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
