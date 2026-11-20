export interface ExperienceNode {
  id: string;
  index: string;
  title: string;
  description: string;
}

export const isroTimeline: ExperienceNode[] = [
  {
    id: "research",
    index: "01",
    title: "Research",
    description:
      "Reviewed existing approaches to canopy height and land-cover estimation from satellite imagery to scope a feasible internship project.",
  },
  {
    id: "dataset",
    index: "02",
    title: "Dataset Processing",
    description:
      "Cleaned and tiled large multi-band raster datasets, handling reprojection, cloud masking, and train/val/test splits.",
  },
  {
    id: "imagery",
    index: "03",
    title: "Satellite Imagery",
    description:
      "Worked directly with Sentinel-2 and Cartosat products — band composites, atmospheric correction, and resolution matching.",
  },
  {
    id: "vit",
    index: "04",
    title: "Vision Transformers",
    description:
      "Adapted a ViT-based encoder for dense regression over imagery tiles, moving beyond CNN baselines for larger receptive fields.",
  },
  {
    id: "dl",
    index: "05",
    title: "Deep Learning",
    description:
      "Built and trained the end-to-end pipeline in PyTorch, iterating on loss functions suited to skewed height distributions.",
  },
  {
    id: "eval",
    index: "06",
    title: "Model Evaluation",
    description:
      "Validated predictions against ground-truth LiDAR-derived height samples, tracking MAE and R² across region types.",
  },
  {
    id: "results",
    index: "07",
    title: "Results",
    description:
      "Delivered a working prototype and writeup that became the seed for the Vegetation Height Estimation project shown here.",
  },
];
