import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { buildGrid } from './geometry';

/**
 * Spatial construction grids — a ground XZ plane plus two vertical
 * reference grids. Deliberately finite and low-contrast: this should read
 * as a Rhino/Grasshopper working plane, not an infinite Tron floor.
 */
export function GridSystem({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { grid, color } = INTRO_CONFIG;

  const showVertical = grid.verticalOn[viewport];
  const baseOpacity = grid.opacity[viewport];

  const geometries = useMemo(() => {
    const ground = buildGrid(grid.ground.size, grid.ground.step, 'xz');
    if (!showVertical) return { ground, xy: null, yz: null };

    return {
      ground,
      xy: buildGrid(grid.vertical.size, grid.vertical.step, 'xy'),
      yz: buildGrid(grid.vertical.size, grid.vertical.step, 'yz'),
    };
  }, [grid, showVertical]);

  useEffect(
    () => () => {
      geometries.ground.dispose();
      geometries.xy?.dispose();
      geometries.yz?.dispose();
    },
    [geometries],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const value = state.grids * state.sceneOpacity;
    group.visible = value > 0.001;
    if (!group.visible) return;

    // Walk the children once per frame — three line materials, so the
    // traversal is cheaper than juggling individual refs.
    group.traverse((child) => {
      const material = (child as THREE.LineSegments).material as
        | THREE.LineBasicMaterial
        | undefined;
      if (material && 'opacity' in material) {
        material.opacity = value * (material.userData.baseOpacity ?? baseOpacity);
      }
    });

    // Grids settle downward very slightly as they switch off.
    group.position.y = -3.1 - (1 - state.grids) * 0.35;
  });

  return (
    <group ref={groupRef} position={[0, -3.1, 0]}>
      <lineSegments geometry={geometries.ground}>
        <lineBasicMaterial
          color={color.line}
          transparent
          opacity={baseOpacity}
          depthWrite={false}
          userData={{ baseOpacity }}
        />
      </lineSegments>

      {geometries.xy && (
        <lineSegments geometry={geometries.xy} position={[0, 7, -7]}>
          <lineBasicMaterial
            color={color.lineSoft}
            transparent
            opacity={baseOpacity * 0.7}
            depthWrite={false}
            userData={{ baseOpacity: baseOpacity * 0.7 }}
          />
        </lineSegments>
      )}

      {geometries.yz && (
        <lineSegments geometry={geometries.yz} position={[-7, 7, 0]}>
          <lineBasicMaterial
            color={color.lineSoft}
            transparent
            opacity={baseOpacity * 0.7}
            depthWrite={false}
            userData={{ baseOpacity: baseOpacity * 0.7 }}
          />
        </lineSegments>
      )}
    </group>
  );
}
