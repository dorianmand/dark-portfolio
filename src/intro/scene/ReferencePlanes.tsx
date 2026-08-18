import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { applyGroupOpacity } from './sceneUtils';

/**
 * Semi-transparent reference planes.
 *
 * Deliberately NOT using transmission/refraction — a physically accurate
 * glass shader needs its own render target every frame and would dominate
 * the budget for something that reads as a 6% tint. Standard material with
 * a low opacity and a defined edge gives the architectural-model look at a
 * fraction of the cost.
 */
export function ReferencePlanes({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { referencePlanes, color } = INTRO_CONFIG;
  const count = referencePlanes.count[viewport];
  const base = referencePlanes.opacity;

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    applyGroupOpacity(group, state.referencePlanes * state.sceneOpacity);
  });

  const planes = [
    // Ground datum
    { pos: [0, -3.1, 0], rot: [-Math.PI / 2, 0, 0], size: [13, 13], op: base },
    // Vertical XY backdrop
    { pos: [0, 0.6, -5.2], rot: [0, 0, 0], size: [11, 9], op: base * 0.8 },
    // Diagonal study plane
    { pos: [2.2, 0, -2], rot: [0, -Math.PI / 4, 0], size: [8, 8], op: base * 0.6 },
    // Top glass associated with OFF, sitting just above the wordmark
    { pos: [0, -1.15, 0.9], rot: [-Math.PI / 2, 0, 0], size: [6.2, 4], op: base * 1.5 },
  ].slice(0, count);

  return (
    <group ref={groupRef}>
      {planes.map((plane, i) => (
        <group
          key={i}
          position={plane.pos as [number, number, number]}
          rotation={plane.rot as [number, number, number]}
        >
          <mesh>
            <planeGeometry args={[plane.size[0], plane.size[1]]} />
            <meshStandardMaterial
              color={color.glass}
              transparent
              opacity={plane.op}
              roughness={0.18}
              metalness={0}
              side={THREE.DoubleSide}
              depthWrite={false}
              userData={{ baseOpacity: plane.op }}
            />
          </mesh>

          {/* Edge definition — without this the planes read as haze. */}
          <lineSegments>
            <edgesGeometry
              args={[new THREE.PlaneGeometry(plane.size[0], plane.size[1])]}
            />
            <lineBasicMaterial
              color={color.lineSoft}
              transparent
              opacity={plane.op * 2.4}
              depthWrite={false}
              userData={{ baseOpacity: plane.op * 2.4 }}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
