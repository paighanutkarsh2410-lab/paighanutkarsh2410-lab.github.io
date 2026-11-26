"use client";

import { Magnetic } from "@/components/motion/magnetic";
import { TextAnimate } from "@/components/ui/text-animate";
import { Reveal } from "@/components/motion/reveal";
import { FileDown, Phone } from "lucide-react";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  const { GitHub, LinkedIn, email } = DATA.contact.social;
  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-10 px-6 pt-16 pb-40">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-muted/20 px-6 py-20 text-center md:py-28">
          <div className="relative">
            <div className="mb-5 font-mono text-sm text-orange-500">Contact</div>
            <TextAnimate as="h2" by="word" animation="blurInUp" startOnView once className="mx-auto max-w-3xl text-5xl font-semibold tracking-tighter text-balance md:text-7xl">
              Let&apos;s keep something running.
            </TextAnimate>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              I&apos;m open to Site Reliability and DevOps roles. Email or call, and I&apos;ll get back to you within a day.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
              <a href={email.url} className="inline-flex items-center rounded-full bg-orange-500 px-7 py-3.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-orange-400 active:scale-[0.98]">
                <email.icon className="mr-2 size-4" />
                {DATA.contact.email}
              </a>
              </Magnetic>
              <a
                href={DATA.resumeUrl}
                download="Utkarsh-Paighan-Resume.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98]"
              >
                <FileDown className="size-4" />
                Download resume
              </a>
              <a
                href={`tel:${DATA.contact.tel.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium tabular-nums transition-colors hover:bg-muted active:scale-[0.98]"
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
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98]"
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
