import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';

/**
 * Restrained architectural camera.
 *
 * Sits on the (1, ~0.9, 1) axis so world-space grids and cages project at
 * the same isometric angles as the logo artwork — that alignment is what
 * makes the helper systems read as one coherent CAD model rather than
 * decoration layered behind a picture.
 *
 * Motion is limited to a 7% forward dolly and a damped pointer parallax.
 * No orbiting, no swoops.
 */
export function CameraRig({
  state,
  viewport,
  pointerEnabled,
}: {
  state: IntroState;
  viewport: Viewport;
  pointerEnabled: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const target = useMemo(
    () => new THREE.Vector3(...INTRO_CONFIG.camera.target),
    [],
  );

  const base = useMemo(
    () => new THREE.Vector3(...INTRO_CONFIG.camera[viewport].position),
    [viewport],
  );

  const smoothed = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.fov = INTRO_CONFIG.camera[viewport].fov;
    camera.updateProjectionMatrix();
  }, [camera, viewport]);

  useFrame(() => {
    const { parallax } = INTRO_CONFIG.camera;

    // Slow forward dolly: starts 7% further out, settles to the design distance.
    const distance = THREE.MathUtils.lerp(1.07, 1.0, state.cameraDolly);

    if (pointerEnabled) {
      smoothed.current.x +=
        (state.pointerX - smoothed.current.x) * parallax.damping;
      smoothed.current.y +=
        (state.pointerY - smoothed.current.y) * parallax.damping;
    }

    camera.position.set(
      base.x * distance + smoothed.current.x * parallax.strength,
      base.y * distance + smoothed.current.y * parallax.strength,
      base.z * distance,
    );

    camera.lookAt(target);
  });

  return null;
}
