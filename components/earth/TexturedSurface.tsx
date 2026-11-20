"use client";

import { useEffect } from "react";
import { SRGBColorSpace } from "three";
import { useTexture } from "@react-three/drei";
import type { EarthTextureSet } from "@/lib/config/earthAssets";

export default function TexturedSurface({ textures }: { textures: EarthTextureSet }) {
  const maps = useTexture({
    map: textures.dayMap!,
    ...(textures.normalMap && { normalMap: textures.normalMap }),
    ...(textures.specularMap && { roughnessMap: textures.specularMap }),
  });

  const colorMap = maps.map;
  useEffect(() => {
    colorMap.colorSpace = SRGBColorSpace;
    colorMap.needsUpdate = true;
  }, [colorMap]);

  return (
    <mesh>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial {...maps} />
    </mesh>
  );
}
