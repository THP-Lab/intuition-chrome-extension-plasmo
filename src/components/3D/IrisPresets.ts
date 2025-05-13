import type { StandardMaterialParams } from "./materialUtils";

export const irisPresets: Record<string, StandardMaterialParams> = {
  neonBlue: {
    color: "hsl(205,98%,20%)",
    emissive: "hsl(196,100%,25%)",
    emissiveIntensity: 1.2,
    toneMapped: false,
    bloomLayer: 1,
  },
  alertRed: {
    color: "#ff0033",
    emissive: "#ff0033",
    emissiveIntensity: 1.2,
    toneMapped: false,
    bloomLayer: 1,
  },
  calmGreen: {
    color: "#00ff88",
    emissive: "#00ff88",
    emissiveIntensity: 1.2,
    toneMapped: false,
    bloomLayer: 2,
  },
};