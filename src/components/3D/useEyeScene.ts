import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { applyIrisMaterial } from "./useIrisMaterial";
import { applyAnneauxMaterial } from "./useAnneauxMaterial";

interface EyeSceneRef {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  bloomComposer?: EffectComposer;
  finalComposer?: EffectComposer;
  mixer?: THREE.AnimationMixer;
  clock?: THREE.Clock;
  pivot?: THREE.Object3D;
  ringOuter?: THREE.Mesh;
  ringInner?: THREE.Mesh;
  animatedMaterial?: THREE.ShaderMaterial;
  animationFrameId?: number;
}

export function useEyeScene(
  containerRef: RefObject<HTMLDivElement>,
  modelPath: string,
  hdrPath: string
) {
  const sceneRef = useRef<EyeSceneRef>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    enum Layers { ENTIRE = 0, BLOOM = 1 }

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    dracoLoader.setDecoderConfig({ type: "js" });
    const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader);
    const hdrLoader = new RGBELoader().setDataType(THREE.FloatType);

    const { width, height } = container.getBoundingClientRect();
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dirLight = new THREE.DirectionalLight(0xffffff, 15);
    dirLight.position.set(5, 10, 1);
    scene.add(dirLight);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    camera.layers.enable(Layers.ENTIRE);
    camera.layers.enable(Layers.BLOOM);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 35;
    container.appendChild(renderer.domElement);

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.5, 0.4, 0.65);
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderPass);
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          void main() {
            vec4 base = texture2D(baseTexture, vUv);
            vec4 bloom = texture2D(bloomTexture, vUv);
            gl_FragColor = vec4(base.rgb + bloom.rgb, base.a);
          }
        `
      }),
      "baseTexture"
    );
    finalPass.needsSwap = true;
    finalComposer.addPass(finalPass);

    // Store core refs
    Object.assign(sceneRef.current, { scene, camera, renderer, bloomComposer, finalComposer });

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const materialMap: Record<string, THREE.Material> = {};

    hdrLoader.load(hdrPath, (hdrEquirect) => {
      const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;
      scene.environment = envMap;
      pmremGenerator.dispose();
      loadModel(envMap);
    });

    function loadModel(envMap: THREE.Texture) {
      gltfLoader.load(
        modelPath,
        (gltf) => {
          const eyeGroup = gltf.scene;
          eyeGroup.rotation.y = 0;
          eyeGroup.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              if (node.name === "Iris") {
                applyIrisMaterial(node, "animated");
                sceneRef.current.animatedMaterial = node.userData.animatedIrisMaterial;
              }
              if (node.name === "Anneaux_EXT") {
                applyAnneauxMaterial(node);
                sceneRef.current.ringOuter = node;
              }
              if (node.name === "Anneaux_INT") {
                applyAnneauxMaterial(node);
                sceneRef.current.ringInner = node;
              }
              node.layers.set(Layers.BLOOM);
            }
          });

          const mixer = new THREE.AnimationMixer(eyeGroup);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());

          const pivot = new THREE.Object3D();
          scene.add(pivot);
          pivot.add(eyeGroup);

          Object.assign(sceneRef.current, { mixer, clock: new THREE.Clock(), pivot });
          animate();
        },
        undefined,
        (err) => console.error("Erreur GLTF:", err)
      );
    }

    function darkenNonBloomed(
      obj: THREE.Object3D,
      materialMap: Record<string, THREE.Material>,
      camera: THREE.Camera,
      darkMat: THREE.Material
    ) {
      if (
        obj instanceof THREE.Mesh &&
        obj.layers.test(camera.layers) &&
        obj.layers.mask !== Layers.BLOOM
      ) {
        materialMap[obj.uuid] = obj.material;
        obj.material = darkMat;
      }
    }
    function restoreMaterial(obj: THREE.Object3D, materialMap: Record<string, THREE.Material>) {
      if (obj instanceof THREE.Mesh && materialMap[obj.uuid]) {
        obj.material = materialMap[obj.uuid];
        delete materialMap[obj.uuid];
      }
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const lookTarget = new THREE.Vector3();
    let pointerMoved = false;
    function onPointerMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerMoved = true;
    }
    window.addEventListener("mousemove", onPointerMove);

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
      bloomComposer.setSize(rect.width, rect.height);
      finalComposer.setSize(rect.width, rect.height);
    });
    resizeObserver.observe(container);

    function animate() {
      sceneRef.current.animationFrameId = requestAnimationFrame(animate);

      sceneRef.current.ringOuter  && (sceneRef.current.ringOuter.rotation.y += 0.05);
      sceneRef.current.ringInner  && (sceneRef.current.ringInner.rotation.y -= 0.06);

      if (pointerMoved && sceneRef.current.pivot) {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, lookTarget);
        if (lookTarget.length() > 2) lookTarget.setLength(2);
        lookTarget.z = camera.position.z;
        sceneRef.current.pivot.lookAt(lookTarget);
        pointerMoved = false;
      }

      sceneRef.current.mixer?.update(sceneRef.current.clock!.getDelta());
      if (sceneRef.current.animatedMaterial) {
        sceneRef.current.animatedMaterial.uniforms.time.value = performance.now() / 1000;
      }

      scene.traverse((obj) =>
        darkenNonBloomed(obj, materialMap, camera, darkMaterial)
      );
      bloomComposer.render();
      scene.traverse((obj) => restoreMaterial(obj, materialMap));
      finalComposer.render();
    }

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      resizeObserver.disconnect();
      if (sceneRef.current.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
      renderer.dispose();
      pmremGenerator.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          Array.isArray(obj.material)
            ? obj.material.forEach((m) => m.dispose())
            : obj.material.dispose();
        }
      });
    };
  }, [containerRef, modelPath, hdrPath]);
}
