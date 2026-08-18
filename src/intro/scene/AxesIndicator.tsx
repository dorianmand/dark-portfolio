import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG } from '../config';
import type { IntroState } from '../introState';
import { mergeSegments, segment } from './geometry';
import { applyGroupOpacity } from './sceneUtils';

/** Small X/Y/Z construction origin. Supporting detail, not a focal graphic. */
export function AxesIndicator({ state }: { state: IntroState }) {
  const groupRef = useRef<THREE.Group>(null);
  const { color } = INTRO_CONFIG;

  const geometry = useMemo(() => {
    const o = new THREE.Vector3(0, 0, 0);
    const len = 0.85;
    return mergeSegments([
      segment(o, new THREE.Vector3(len, 0, 0)),
      segment(o, new THREE.Vector3(0, len, 0)),
      segment(o, new THREE.Vector3(0, 0, len)),
    ]);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    applyGroupOpacity(group, state.axes * state.sceneOpacity);
  });

  return (
    <group ref={groupRef} position={[-3.6, -3.05, 1.4]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={color.line}
          transparent
          opacity={0.34}
          depthWrite={false}
          userData={{ baseOpacity: 0.34 }}
        />
      </lineSegments>
    </group>
  );
}
