import Hero from "@/components/section/hero";
import Tunnel from "@/components/section/tunnel";
import ProjectsSection from "@/components/section/projects-section";
import Pipeline from "@/components/section/pipeline";
import Skills from "@/components/section/skills";
import Experience from "@/components/section/experience";
import ContactSection from "@/components/section/contact-section";

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Tunnel />
      <ProjectsSection />
      <Pipeline />
      <Skills />
      <Experience />
      <ContactSection />
    </main>
  );
}
