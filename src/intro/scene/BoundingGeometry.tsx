import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTRO_CONFIG, type Viewport } from '../config';
import type { IntroState } from '../introState';
import { LOGO_ANCHORS, buildBoxEdges, mergeSegments, uvToLocal } from './geometry';
import { applyGroupOpacity } from './sceneUtils';

/**
 * Control cages on selected letters only.
 *
 * Boxing every glyph would read as clutter; boxing a few implies the whole
 * composition is parametrically driven, which is the point.
 */
export function BoundingGeometry({
  state,
  viewport,
}: {
  state: IntroState;
  viewport: Viewport;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { boundingGeometry, logo, color } = INTRO_CONFIG;

  const count = boundingGeometry.count[viewport];
  const size = logo.size[viewport];

  const geometry = useMemo(() => {
    // Y on its own, the A/E pair as one extent, R, then OFF as a group cage.
    const targets = [
      { anchor: LOGO_ANCHORS.layer[0], w: 1.15, h: 1.35, d: 0.9 },
      { anchor: LOGO_ANCHORS.layer[1], w: 2.6, h: 1.4, d: 0.9 },
      { anchor: LOGO_ANCHORS.layer[4], w: 1.4, h: 1.35, d: 0.9 },
      { anchor: LOGO_ANCHORS.off[1], w: 3.6, h: 1.3, d: 0.8 },
    ].slice(0, count);

    return mergeSegments(
      targets.map((t) =>
        buildBoxEdges(
          uvToLocal(t.anchor.u, t.anchor.v, size),
          t.w,
          t.h,
          t.d,
        ),
      ),
    );
  }, [count, size]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const value = state.boundingGeometry * state.sceneOpacity;
    if (!applyGroupOpacity(group, value)) return;

    // Cages contract a hair as they release their control of the form.
    const s = 0.98 + state.boundingGeometry * 0.02;
    group.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={color.lineSoft}
          transparent
          opacity={boundingGeometry.opacity}
          depthWrite={false}
          userData={{ baseOpacity: boundingGeometry.opacity }}
        />
      </lineSegments>
    </group>
  );
}
