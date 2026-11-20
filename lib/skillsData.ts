export type SkillCategory = "ai" | "geospatial" | "engineering";

export interface SkillNode {
  id: string;
  label: string;
  category: SkillCategory;
  x: number; // percent of viewBox width
  y: number; // percent of viewBox height
  size: number; // base radius, larger = more central/emphasized
}

// Hand-placed layout (not a runtime force simulation) so the graph is
// stable and predictable rather than jittering into odd shapes on load.
// Three loose clusters — AI/ML, Geospatial, Engineering — orbiting a
// Python hub that bridges all three.
export const skillNodes: SkillNode[] = [
  { id: "python", label: "Python", category: "engineering", x: 50, y: 50, size: 5.5 },

  // AI / ML cluster (upper left)
  { id: "ai", label: "AI", category: "ai", x: 28, y: 18, size: 5 },
  { id: "ml", label: "Machine Learning", category: "ai", x: 18, y: 32, size: 4.5 },
  { id: "dl", label: "Deep Learning", category: "ai", x: 34, y: 34, size: 4.5 },
  { id: "cv", label: "Computer Vision", category: "ai", x: 24, y: 48, size: 4.2 },
  { id: "pytorch", label: "PyTorch", category: "ai", x: 10, y: 46, size: 4 },
  { id: "tensorflow", label: "TensorFlow", category: "ai", x: 14, y: 62, size: 4 },

  // Geospatial cluster (right)
  { id: "gis", label: "GIS", category: "geospatial", x: 76, y: 22, size: 4.5 },
  { id: "remote-sensing", label: "Remote Sensing", category: "geospatial", x: 88, y: 36, size: 4.5 },
  { id: "gdal", label: "GDAL", category: "geospatial", x: 70, y: 40, size: 4 },
  { id: "rasterio", label: "Rasterio", category: "geospatial", x: 82, y: 54, size: 4 },

  // Engineering cluster (bottom)
  { id: "react", label: "React", category: "engineering", x: 62, y: 68, size: 4.2 },
  { id: "fastapi", label: "FastAPI", category: "engineering", x: 44, y: 74, size: 4 },
  { id: "sql", label: "SQL", category: "engineering", x: 30, y: 78, size: 3.8 },
  { id: "docker", label: "Docker", category: "engineering", x: 58, y: 86, size: 3.8 },
  { id: "git", label: "Git", category: "engineering", x: 40, y: 90, size: 3.6 },
];

export const skillEdges: [string, string][] = [
  // Python as central hub
  ["python", "ai"],
  ["python", "ml"],
  ["python", "dl"],
  ["python", "pytorch"],
  ["python", "tensorflow"],
  ["python", "gdal"],
  ["python", "rasterio"],
  ["python", "fastapi"],

  // AI / ML cluster internal
  ["ai", "ml"],
  ["ai", "dl"],
  ["ml", "cv"],
  ["dl", "cv"],
  ["dl", "pytorch"],
  ["dl", "tensorflow"],
  ["cv", "pytorch"],
  ["cv", "tensorflow"],

  // Geospatial cluster internal
  ["gis", "remote-sensing"],
  ["gis", "gdal"],
  ["remote-sensing", "rasterio"],
  ["gdal", "rasterio"],
  ["cv", "remote-sensing"], // computer vision <-> remote sensing bridge

  // Engineering cluster internal
  ["fastapi", "react"],
  ["fastapi", "sql"],
  ["fastapi", "docker"],
  ["react", "git"],
  ["docker", "git"],
  ["sql", "git"],
];
