export interface VegetationRegion {
  id: string;
  name: string;
  subtitle: string;
  // Position as a percentage within the map viewBox, so hotspots
  // stay aligned regardless of container size.
  x: number;
  y: number;
  radius: number;
  stats: {
    avgHeight: number; // meters
    minHeight: number;
    maxHeight: number;
    density: number; // percent canopy cover
    biomass: number; // tons / hectare
    confidence: number; // percent
  };
}

export const vegetationRegions: VegetationRegion[] = [
  {
    id: "ridge",
    name: "New Delhi Ridge",
    subtitle: "Urban forest patch, Aravalli range",
    x: 38,
    y: 46,
    radius: 7,
    stats: {
      avgHeight: 9.4,
      minHeight: 2.1,
      maxHeight: 18.6,
      density: 62,
      biomass: 148,
      confidence: 91,
    },
  },
  {
    id: "ghats",
    name: "Western Ghats Reserve",
    subtitle: "Dense tropical evergreen belt",
    x: 63,
    y: 60,
    radius: 9,
    stats: {
      avgHeight: 21.8,
      minHeight: 6.4,
      maxHeight: 42.3,
      density: 88,
      biomass: 412,
      confidence: 95,
    },
  },
  {
    id: "sundarbans",
    name: "Sundarbans Mangrove Belt",
    subtitle: "Coastal mangrove ecosystem",
    x: 75,
    y: 32,
    radius: 6,
    stats: {
      avgHeight: 12.1,
      minHeight: 3.8,
      maxHeight: 19.7,
      density: 74,
      biomass: 201,
      confidence: 87,
    },
  },
];

export interface PipelineStage {
  id: string;
  label: string;
  detail: string;
}

export const pipelineStages: PipelineStage[] = [
  { id: "input", label: "Satellite imagery", detail: "Sub-metre resolution" },
  { id: "preprocess", label: "Preprocessing", detail: "Normalize, resample and tile" },
  { id: "features", label: "Feature extraction", detail: "DINOv2 encoder" },
  { id: "vit", label: "Height estimation", detail: "Dense Prediction Transformer" },
  { id: "height", label: "Calibration", detail: "CNN ensemble and percentile adjustment" },
  { id: "output", label: "Validation", detail: "Airborne LiDAR reference" },
];
