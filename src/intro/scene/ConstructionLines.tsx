import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { LOGO_ANCHORS, mergeSegments, seededRandom, segment, uvToLocal } from './geometry';

/**
 * Architectural construction guides projected from real letter positions.
 *
 * Lines extend past the artwork the way setting-out lines do on a drawing,
 * with deliberately varied lengths so there is hierarchy rather than an
 * even hedge of ticks.
 */
export function ConstructionLines({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { constructionLines, logo, color } = INTRO_CONFIG;

  const count = constructionLines.count[viewport];
  const size = logo.size[viewport];

  const geometry = useMemo(() => {
    const rand = seededRandom(0x1a7e);
    const anchors = [...LOGO_ANCHORS.layer, ...LOGO_ANCHORS.off];
    const parts: THREE.BufferGeometry[] = [];

    for (let i = 0; i < count; i++) {
      const anchor = anchors[i % anchors.length];
      const origin = uvToLocal(anchor.u, anchor.v, size);

      // Alternate between horizontal set-out lines, vertical datums and a
      // few depth lines running back into the model space.
      const mode = i % 3;
      const extend = 0.6 + rand() * 2.6;
      const dir = rand() > 0.5 ? 1 : -1;

      const end = origin.clone();
      if (mode === 0) end.x += extend * dir;
      else if (mode === 1) end.y += extend * dir * 0.6;
      else end.z -= extend * 0.8;

      parts.push(segment(origin, end));
    }

    return mergeSegments(parts);
  }, [count, size]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const value = state.constructionLines * state.sceneOpacity;
    group.visible = value > 0.001;

    const material = (group.children[0] as THREE.LineSegments)?.material as
      | THREE.LineBasicMaterial
      | undefined;

    if (material) material.opacity = value * constructionLines.opacity;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={color.line}
          transparent
          opacity={constructionLines.opacity}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
