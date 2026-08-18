import * as THREE from 'three';

/**
 * Procedural geometry helpers for the intro's construction systems.
 *
 * Everything is seeded, so the composition is identical on every load and
 * therefore actually art-directable. Random-per-reload would make the
 * scene impossible to tune.
 */

/** Mulberry32 — small, fast, deterministic. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Letter anchor points measured off public/logo.png, in the logo plane's
 * local UV space (origin bottom-left, 0..1). Construction lines, cages and
 * network nodes all key off these so the helper systems attach to real
 * artwork features instead of floating arbitrarily.
 */
export const LOGO_ANCHORS = {
  layer: [
    { id: 'Y', u: 0.5, v: 0.849 },
    { id: 'A', u: 0.42, v: 0.645 },
    { id: 'E', u: 0.58, v: 0.645 },
    { id: 'L', u: 0.36, v: 0.465 },
    { id: 'R', u: 0.63, v: 0.455 },
  ],
  off: [
    { id: 'O', u: 0.31, v: 0.235 },
    { id: 'F1', u: 0.51, v: 0.225 },
    { id: 'F2', u: 0.7, v: 0.225 },
  ],
} as const;

/** Convert a logo-local UV point to world space on the billboarded plane. */
export function uvToLocal(u: number, v: number, size: number): THREE.Vector3 {
  return new THREE.Vector3((u - 0.5) * size, (v - 0.5) * size, 0);
}

export type GridPlane = 'xz' | 'xy' | 'yz';

/**
 * Build a flat grid as a single merged LineSegments buffer — one draw call
 * per grid rather than one per line.
 */
export function buildGrid(
  size: number,
  step: number,
  plane: GridPlane,
): THREE.BufferGeometry {
  const half = size / 2;
  const positions: number[] = [];

  for (let c = -half; c <= half + 1e-6; c += step) {
    if (plane === 'xz') {
      positions.push(-half, 0, c, half, 0, c);
      positions.push(c, 0, -half, c, 0, half);
    } else if (plane === 'xy') {
      positions.push(-half, c, 0, half, c, 0);
      positions.push(c, -half, 0, c, half, 0);
    } else {
      positions.push(0, -half, c, 0, half, c);
      positions.push(0, c, -half, 0, c, half);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geometry;
}

/** Wireframe box edges as merged segments, centred on `center`. */
export function buildBoxEdges(
  center: THREE.Vector3,
  w: number,
  h: number,
  d: number,
): THREE.BufferGeometry {
  const box = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(box);
  edges.translate(center.x, center.y, center.z);
  box.dispose();
  return edges;
}

/** Merge many BufferGeometries of the same attribute layout into one. */
export function mergeSegments(
  geometries: THREE.BufferGeometry[],
): THREE.BufferGeometry {
  const positions: number[] = [];

  for (const g of geometries) {
    const attr = g.getAttribute('position');
    for (let i = 0; i < attr.count; i++) {
      positions.push(attr.getX(i), attr.getY(i), attr.getZ(i));
    }
    g.dispose();
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return merged;
}

/** Straight segment between two points, as its own small geometry. */
export function segment(a: THREE.Vector3, b: THREE.Vector3) {
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z], 3),
  );
  return g;
}
