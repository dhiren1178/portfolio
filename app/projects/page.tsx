import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen bg-void px-6 pt-32 pb-24 md:px-16">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Selected Work"
          title="Two projects, built end to end."
          description="Depth over breadth — each one is a full experience, not a screenshot."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ProjectCard
            index="01"
            title="Vegetation Height Estimation"
            description="A Vision Transformer estimates canopy height and biomass from satellite imagery across live-selectable regions."
            tags={["Vision Transformer", "Sentinel-2", "Geospatial AI"]}
            href="/projects/vegetation-height"
            gradient="bg-gradient-to-br from-canopy to-ocean"
          />
          <ProjectCard
            index="02"
            title="Sign Language Recognition"
            description="A CNN classifies hand gestures in real time from a webcam feed, with live confidence readouts."
            tags={["CNN", "Computer Vision", "Real-time"]}
            gradient="bg-gradient-to-br from-ocean to-signal-dim"
          />
        </div>
      </div>
    </div>
  );
}
