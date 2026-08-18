import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { mergeSegments, segment } from './geometry';
import { applyGroupOpacity } from './sceneUtils';

/**
 * Section markers A–A and B–B. Thin lines cutting the whole scene, with
 * short end ticks. Labels are drawn in HTML by AnnotationLayer so they use
 * the site's own typography.
 */
export function SectionGuides({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { sectionGuides, color } = INTRO_CONFIG;
  const count = sectionGuides.count[viewport];

  const geometry = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    const cuts = [
      { y: 1.35, tick: 0.28 }, // A–A, through the upper LAYER stack
      { y: -1.55, tick: 0.28 }, // B–B, just above OFF
    ].slice(0, count);

    const half = 5.4;

    for (const cut of cuts) {
      parts.push(
        segment(
          new THREE.Vector3(-half, cut.y, 0),
          new THREE.Vector3(half, cut.y, 0),
        ),
      );
      // End ticks, turned back toward the section direction.
      parts.push(
        segment(
          new THREE.Vector3(-half, cut.y, 0),
          new THREE.Vector3(-half, cut.y + cut.tick, 0),
        ),
      );
      parts.push(
        segment(
          new THREE.Vector3(half, cut.y, 0),
          new THREE.Vector3(half, cut.y + cut.tick, 0),
        ),
      );
    }

    return mergeSegments(parts);
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    applyGroupOpacity(group, state.sectionGuides * state.sceneOpacity);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={color.line}
          transparent
          opacity={sectionGuides.opacity}
          depthWrite={false}
          userData={{ baseOpacity: sectionGuides.opacity }}
        />
      </lineSegments>
    </group>
  );
}
