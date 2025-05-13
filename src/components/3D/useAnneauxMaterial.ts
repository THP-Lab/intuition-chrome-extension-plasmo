import { anneauxPresets } from "./AnneauxPresets";
import { applyStandardMaterial } from "./materialUtils";
import type * as THREE from "three";

export function applyAnneauxMaterial(
  mesh: THREE.Mesh,
  presetKey: keyof typeof anneauxPresets = "ringSoft"
) {
  const params = anneauxPresets[presetKey];
  applyStandardMaterial(mesh, params);
}