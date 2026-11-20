/**
 * ASSET SWAP POINT — Satellite model.
 *
 * `modelPath` is currently `null`, so the satellite renders as a small
 * primitive-built placeholder (see components/satellite/PrimitiveSatellite.tsx).
 *
 * To upgrade later: drop a .glb into /public/models/ and set the path
 * below. SatelliteVisual.tsx will then load it via useGLTF instead — the
 * orbit motion, camera-facing behavior, and every call site that renders
 * <Satellite /> stay exactly as they are, since orbit motion and visual
 * representation are deliberately separate concerns (see
 * components/satellite/Satellite.tsx and useOrbitMotion.ts).
 */
export interface SatelliteAssetConfig {
  modelPath: string | null;
  /** Optional uniform scale applied only to the loaded model, since real
   * GLB assets rarely come pre-scaled to scene units. */
  modelScale: number;
}

export const satelliteAsset: SatelliteAssetConfig = {
  modelPath: null,
  modelScale: 1,
};

export function hasProductionSatelliteModel(config: SatelliteAssetConfig): boolean {
  return Boolean(config.modelPath);
}
