import * as THREE from "three";

export interface StandardMaterialParams {
  color: THREE.Color | string;
  emissive?: THREE.Color | string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  toneMapped?: boolean;
  bloomLayer?: number;
}

/**
 * Apply standard material settings to a mesh
 */
export function applyStandardMaterial(
    mesh: THREE.Mesh,
    params: StandardMaterialParams
  ) {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    // Color
    if (typeof params.color === "string") mat.color.set(params.color);
    else mat.color.copy(params.color);
    // Emissive
    if (params.emissive) {
      if (typeof params.emissive === "string") mat.emissive.set(params.emissive);
      else mat.emissive.copy(params.emissive);
    }
    // Numeric properties
    if (params.emissiveIntensity !== undefined) mat.emissiveIntensity = params.emissiveIntensity;
    if (params.metalness         !== undefined) mat.metalness         = params.metalness;
    if (params.roughness         !== undefined) mat.roughness         = params.roughness;
    if (params.toneMapped        !== undefined) mat.toneMapped        = params.toneMapped;
    mat.needsUpdate = true;
    if (params.bloomLayer !== undefined) mesh.layers.set(params.bloomLayer);
  }