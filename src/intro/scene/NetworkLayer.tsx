import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { LOGO_ANCHORS, seededRandom, uvToLocal } from './geometry';

/**
 * The computational network.
 *
 * Split into two groups that behave differently:
 *
 * - `branches` sit around the LAYER glyphs and switch off with the rest of
 *   the helper systems.
 * - `core` sits around OFF, becomes briefly denser and more organised while
 *   OFF resolves, then thins back out — so the final wordmark is cleaner
 *   than the intermediate state rather than accumulating decoration.
 *
 * Node placement is anchored to actual letter positions, never scattered
 * across the frame, which is what makes it read as intelligence rather
 * than particles.
 */

interface NodeSet {
  positions: THREE.Vector3[];
  links: THREE.BufferGeometry;
}

function buildNodeSet(
  anchors: readonly { u: number; v: number }[],
  perAnchor: number,
  spread: number,
  size: number,
  linkRadius: number,
  maxLinks: number,
  seed: number,
): NodeSet {
  const rand = seededRandom(seed);
  const positions: THREE.Vector3[] = [];

  for (const anchor of anchors) {
    const origin = uvToLocal(anchor.u, anchor.v, size);
    for (let i = 0; i < perAnchor; i++) {
      positions.push(
        origin
          .clone()
          .add(
            new THREE.Vector3(
              (rand() - 0.5) * spread,
              (rand() - 0.5) * spread * 0.8,
              (rand() - 0.5) * spread * 1.4,
            ),
          ),
      );
    }
  }

  // Link nearby nodes, capped so density stays controlled.
  const segments: number[] = [];
  let linkCount = 0;

  for (let i = 0; i < positions.length && linkCount < maxLinks; i++) {
    for (let j = i + 1; j < positions.length && linkCount < maxLinks; j++) {
      if (positions[i].distanceTo(positions[j]) > linkRadius) continue;
      segments.push(
        positions[i].x, positions[i].y, positions[i].z,
        positions[j].x, positions[j].y, positions[j].z,
      );
      linkCount++;
    }
  }

  const links = new THREE.BufferGeometry();
  links.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));

  return { positions, links };
}

function NodeCloud({
  set,
  color,
  nodeSize,
}: {
  set: NodeSet;
  color: string;
  nodeSize: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    set.positions.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [set]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, set.positions.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[nodeSize, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
    </instancedMesh>
  );
}

export function NetworkLayer({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const branchGroup = useRef<THREE.Group>(null);
  const coreGroup = useRef<THREE.Group>(null);

  const { network, logo, color } = INTRO_CONFIG;
  const size = logo.size[viewport];

  const sets = useMemo(() => {
    const total = network.nodeCount[viewport];
    const offTotal = network.offClusterCount[viewport];
    const maxLinks = network.maxLinks[viewport];

    return {
      branches: buildNodeSet(
        LOGO_ANCHORS.layer,
        Math.max(1, Math.round(total / LOGO_ANCHORS.layer.length)),
        1.9,
        size,
        network.linkRadius,
        Math.round(maxLinks * 0.6),
        0x51a2,
      ),
      core: buildNodeSet(
        LOGO_ANCHORS.off,
        Math.max(1, Math.round(offTotal / LOGO_ANCHORS.off.length)),
        1.4,
        size,
        network.linkRadius * 0.9,
        Math.round(maxLinks * 0.4),
        0x9c3f,
      ),
    };
  }, [network, size, viewport]);

  useEffect(
    () => () => {
      sets.branches.links.dispose();
      sets.core.links.dispose();
    },
    [sets],
  );

  useFrame(() => {
    const branches = branchGroup.current;
    const core = coreGroup.current;

    if (branches) {
      const value = state.networkBranches * state.sceneOpacity;
      branches.visible = value > 0.001;
      if (branches.visible) {
        branches.traverse((child) => {
          const m = (child as THREE.Mesh).material as THREE.Material & {
            opacity: number;
          };
          if (m && 'opacity' in m) {
            m.opacity = value * (m.userData.baseOpacity ?? network.opacity);
          }
        });
      }
    }

    if (core) {
      const value = state.networkCore * state.sceneOpacity;
      core.visible = value > 0.001;
      if (core.visible) {
        core.traverse((child) => {
          const m = (child as THREE.Mesh).material as THREE.Material & {
            opacity: number;
          };
          if (m && 'opacity' in m) {
            m.opacity = value * (m.userData.baseOpacity ?? network.opacity);
          }
        });
      }
    }
  });

  return (
    <>
      <group ref={branchGroup}>
        <NodeCloud set={sets.branches} color={color.node} nodeSize={network.nodeSize} />
        <lineSegments geometry={sets.branches.links}>
          <lineBasicMaterial
            color={color.node}
            transparent
            opacity={network.opacity * 0.45}
            depthWrite={false}
            userData={{ baseOpacity: network.opacity * 0.45 }}
          />
        </lineSegments>
      </group>

      <group ref={coreGroup}>
        <NodeCloud set={sets.core} color={color.node} nodeSize={network.nodeSize * 1.1} />
        <lineSegments geometry={sets.core.links}>
          <lineBasicMaterial
            color={color.node}
            transparent
            opacity={network.opacity * 0.6}
            depthWrite={false}
            userData={{ baseOpacity: network.opacity * 0.6 }}
          />
        </lineSegments>
      </group>
    </>
  );
}
