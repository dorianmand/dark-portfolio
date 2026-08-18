import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { createDissolveMaterial } from '../shaders/dissolveMaterial';

/**
 * The wordmark itself.
 *
 * The source artwork is a flat isometric raster, so this is a camera-facing
 * quad rather than real geometry — see the asset note in the intro README.
 * Billboarding keeps the drawing crisp while the surrounding world-space
 * systems parallax against it, which is what sells the depth.
 *
 * During siteReveal it travels to the hero's small LayerOff mark, measured
 * live from the DOM. The composition reduces from a full-frame working
 * model to a quiet 200px study beside Dorian's name — which is the whole
 * point of the sequence, and keeps the identity hierarchy intact.
 */
export function LogoPlane({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  // R3F's own loader rather than drei's useTexture — drei was the single
  // heaviest thing in the lazy chunk and this was the only hook used from it.
  const texture = useLoader(THREE.TextureLoader, INTRO_CONFIG.logo.src);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);

  const logoSize = INTRO_CONFIG.logo.size[viewport];

  const { material, uniforms } = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return createDissolveMaterial(texture);
  }, [texture]);

  useEffect(() => () => material.dispose(), [material]);

  // Scratch vectors, reused every frame rather than reallocated.
  const scratch = useMemo(
    () => ({ right: new THREE.Vector3(), up: new THREE.Vector3(), pos: new THREE.Vector3() }),
    [],
  );

  useFrame(() => {
    uniforms.uDissolve.value = state.dissolve;
    uniforms.uOffReveal.value = state.offReveal;
    uniforms.uOpacity.value = state.sceneOpacity;

    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.quaternion.copy(camera.quaternion);

    const settle = state.logoSettle;
    if (settle <= 0.001) {
      mesh.position.set(0, 0, 0);
      mesh.scale.setScalar(1);
      return;
    }

    const target = document.querySelector<HTMLElement>(
      INTRO_CONFIG.logo.settleTarget,
    );
    const rect = target?.getBoundingClientRect();

    // No target in the DOM: fall back to a plain scale settle.
    if (!rect || rect.height < 1) {
      mesh.position.set(0, 0, 0);
      mesh.scale.setScalar(1 + (INTRO_CONFIG.logo.settleScale - 1) * settle);
      return;
    }

    const cam = camera as THREE.PerspectiveCamera;
    const distance = cam.position.length();
    const halfH = distance * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const halfW = halfH * cam.aspect;

    const canvasRect = gl.domElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - canvasRect.left;
    const cy = rect.top + rect.height / 2 - canvasRect.top;

    const ndcX = (cx / size.width) * 2 - 1;
    const ndcY = -((cy / size.height) * 2 - 1);

    // If the target is not actually on screen — an unusually short viewport,
    // or the page scrolled before the intro pinned it — settling toward it
    // would fling the wordmark out of frame. Degrade to a scale-only settle.
    if (Math.abs(ndcX) > 1.4 || Math.abs(ndcY) > 1.4) {
      mesh.position.set(0, 0, 0);
      mesh.scale.setScalar(1 + (INTRO_CONFIG.logo.settleScale - 1) * settle);
      return;
    }

    // The quad faces the camera, so camera-local X/Y map straight to screen.
    scratch.right.setFromMatrixColumn(cam.matrixWorld, 0);
    scratch.up.setFromMatrixColumn(cam.matrixWorld, 1);

    scratch.pos
      .set(0, 0, 0)
      .addScaledVector(scratch.right, ndcX * halfW * settle)
      .addScaledVector(scratch.up, ndcY * halfH * settle);

    mesh.position.copy(scratch.pos);

    const worldPerPx = (halfH * 2) / size.height;
    const targetScale = (rect.height * worldPerPx) / logoSize;
    mesh.scale.setScalar(THREE.MathUtils.lerp(1, targetScale, settle));
  });

  return (
    <mesh ref={meshRef} material={material} renderOrder={10}>
      <planeGeometry args={[logoSize, logoSize]} />
    </mesh>
  );
}

useLoader.preload(THREE.TextureLoader, INTRO_CONFIG.logo.src);
