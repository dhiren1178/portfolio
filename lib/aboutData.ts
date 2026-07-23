export interface TimelineEntry {
  id: string;
  year: string;
  kind: "education" | "experience";
  title: string;
  org: string;
  description: string;
  tags: string[];
}

export const timelineEntries: TimelineEntry[] = [
  {
    id: "btech",
    year: "2018 — 2022",
    kind: "education",
    title: "B.Tech, Artificial Intelligence",
    org: "India",
    description:
      "Foundations in machine learning, algorithms, and software engineering — the base layer everything after was built on.",
    tags: ["Machine Learning", "Python", "Data Structures"],
  },
  {
    id: "isro",
    year: "2022",
    kind: "experience",
    title: "Research Internship",
    org: "ISRO",
    description:
      "Worked hands-on with satellite imagery pipelines — dataset processing, feature extraction, and early deep-learning models for Earth observation tasks.",
    tags: ["Satellite Imagery", "Deep Learning", "Geospatial AI"],
  },
  {
    id: "msc",
    year: "2023 — Present",
    kind: "education",
    title: "M.Sc, Artificial Intelligence",
    org: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
    description:
      "Deepening into computer vision, vision transformers, and geospatial AI — applying research-grade models to real Earth observation problems.",
    tags: ["Computer Vision", "Vision Transformers", "Geospatial AI"],
  },
];

export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "AI & Research",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Geospatial AI",
      "Satellite Image Analysis",
    ],
  },
  {
    label: "Frameworks & Tools",
    skills: ["Python", "PyTorch", "TensorFlow", "Rasterio", "GDAL"],
  },
  {
    label: "Engineering",
    skills: ["FastAPI", "React"],
  },
];
