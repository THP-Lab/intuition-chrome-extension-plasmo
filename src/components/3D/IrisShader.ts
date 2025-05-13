import * as THREE from "three"
export const IrisShader = {
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color("hsl(221, 83%, 53%)") },
      center: { value: new THREE.Vector2(0.5, 0.5) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform vec2 center;
      varying vec2 vUv;
  
      void main() {
        float dist = distance(vUv, center);
        float pulse = sin(time * 2.0) * 0.3 + 0.7;
        float glow = pow(1.0 - dist, 3.0);
        float outerGlow = smoothstep(0.6, 0.4, dist);
        glow += outerGlow * 0.3;
        gl_FragColor = vec4(color * glow * pulse * 1.8, glow);
      }
    `
  }
  