"use client";

import { Meteors } from "@/components/ui/meteors";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TextAnimate } from "@/components/ui/text-animate";
import { Reveal } from "@/components/motion/reveal";
import { FileDown, Phone } from "lucide-react";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  const { GitHub, LinkedIn, email } = DATA.contact.social;
  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 pt-16 pb-40">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-b from-orange-500/[0.08] via-background to-background px-6 py-20 text-center md:py-28">
          <Meteors number={22} className="bg-orange-400 shadow-[0_0_0_1px_#ffffff10]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[100px]" />
          <div className="relative">
            <div className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-orange-500">Contact</div>
            <TextAnimate as="h2" by="word" animation="blurInUp" startOnView once className="mx-auto max-w-3xl text-5xl font-semibold tracking-tighter text-balance md:text-7xl">
              Let&apos;s keep something running.
            </TextAnimate>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              I&apos;m open to Site Reliability and DevOps roles. Email or call, and I&apos;ll get back to you within a day.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href={email.url}>
                <ShimmerButton background="linear-gradient(135deg,#ea580c,#c2410c)" shimmerColor="#ffe4c4" className="px-7 py-3.5 text-sm font-medium shadow-2xl shadow-orange-500/30">
                  <email.icon className="mr-2 size-4" />
                  {DATA.contact.email}
                </ShimmerButton>
              </a>
              <a
                href={DATA.resumeUrl}
                download="Utkarsh-Paighan-Resume.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-orange-500/60 bg-background/60 px-6 py-3.5 text-sm font-medium backdrop-blur transition-[transform,border-color] hover:-translate-y-0.5 hover:border-orange-500"
              >
                <FileDown className="size-4" />
                Download resume
              </a>
              <a
                href={`tel:${DATA.contact.tel.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-sm font-medium tabular-nums backdrop-blur transition-[transform,border-color] hover:-translate-y-0.5 hover:border-orange-500/60"
              >
                <Phone className="size-4" />
                {DATA.contact.tel}
              </a>
              {[LinkedIn, GitHub].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-sm font-medium backdrop-blur transition-[transform,border-color] hover:-translate-y-0.5 hover:border-orange-500/60"
                >
                  <s.icon className="size-4" />
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      <p className="mt-10 text-center font-mono text-xs text-muted-foreground">
        © 2026 {DATA.name}
      </p>
    </section>
  );
}
