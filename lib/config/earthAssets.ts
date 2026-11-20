import { publicAsset } from "@/lib/publicAsset";

export interface EarthTextureSet {
  /** Base color / albedo map. Setting this is what triggers the swap. */
  dayMap?: string;
  /** Alpha-blended cloud layer, animated independently of the surface. */
  cloudsMap?: string;
  /** Surface relief. */
  normalMap?: string;
  /** Ocean specular response. */
  specularMap?: string;
  /** City lights, blended in on the planet's night side. */
  nightMap?: string;
}

export const earthTextures: EarthTextureSet = {
  dayMap: publicAsset("/imagery/blue-marble.webp"),
  cloudsMap: undefined,
  normalMap: undefined,
  specularMap: undefined,
  nightMap: undefined,
};

export function hasProductionEarthTextures(set: EarthTextureSet): boolean {
  return Boolean(set.dayMap);
}
