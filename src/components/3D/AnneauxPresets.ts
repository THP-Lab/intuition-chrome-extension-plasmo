import type { StandardMaterialParams } from "./materialUtils";

export const anneauxPresets: Record<string, StandardMaterialParams> = {
  ringStrong: {
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 2.0,
    metalness: 1.0,
    roughness: 0.2,
    toneMapped: false,
    bloomLayer: 2,
  },
  ringSoft: {
    color: "#aaaaaa",
    emissive: "#333333",
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.4,
    toneMapped: false,
    bloomLayer: 2,
  },
  ringNone: {
    color: "#888888",
    emissive: "#000000",
    emissiveIntensity: 0.0,
    metalness: 0.5,
    roughness: 0.5,
    toneMapped: false,
    bloomLayer: 0,
  },
};