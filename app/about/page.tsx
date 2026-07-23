import SectionHeading from "@/components/ui/SectionHeading";
import AboutTimeline from "@/components/about/AboutTimeline";
import SkillsGrid from "@/components/about/SkillsGrid";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen bg-void px-6 pt-32 pb-24 md:px-16">
      {/* Ambient backdrop grid, consistent with hero's atmosphere */}
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="About"
          title="From orbit to inference."
          description="A short path from foundational AI to reading the planet through satellite data — built on internships, research, and a graduate degree focused on vision and geospatial intelligence."
        />

        <AboutTimeline />

        <div className="mt-8">
          <SectionHeading eyebrow="Toolkit" title="What I build with." />
          <SkillsGrid />
        </div>
      </div>
    </section>
  );
}
