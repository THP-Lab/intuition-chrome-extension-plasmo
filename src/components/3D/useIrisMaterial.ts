import * as THREE from "three";
import { irisPresets } from "./IrisPresets";
import { IrisShader } from "./IrisShader";
import { applyStandardMaterial } from "./materialUtils";

export function applyIrisMaterial(
  mesh: THREE.Mesh,
  presetKey: keyof typeof irisPresets | "animated" = "neonBlue"
) {
  if (presetKey === "animated") {
    const shaderMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(IrisShader.uniforms),
      vertexShader: IrisShader.vertexShader,
      fragmentShader: IrisShader.fragmentShader,
      transparent: true,
      toneMapped: false,
    });

    const uvAttr = mesh.geometry.attributes.uv;
    const uvCenter = new THREE.Vector2();
    for (let i = 0; i < uvAttr.count; i++) {
      uvCenter.x += uvAttr.getX(i);
      uvCenter.y += uvAttr.getY(i);
    }
    uvCenter.divideScalar(uvAttr.count);

    // Optional manual offset, move to config if needed
    // uvCenter.x += 0.2;
    // uvCenter.y -= 0.07;

    shaderMat.uniforms.center.value.copy(uvCenter);
    mesh.material = shaderMat;
    mesh.layers.set(1);
    mesh.userData.animatedIrisMaterial = shaderMat;
  } else {
    const params = irisPresets[presetKey];
    applyStandardMaterial(mesh, params);
  }
}
