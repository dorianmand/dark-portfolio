import type * as THREE from 'three';

/**
 * Fade every material under a group to `value` x its own authored opacity.
 *
 * Each material stores its design opacity in userData.baseOpacity so the
 * art direction stays in the JSX and the timeline only ever supplies a
 * 0..1 multiplier.
 */
export function applyGroupOpacity(group: THREE.Object3D, value: number): boolean {
  const visible = value > 0.001;
  group.visible = visible;
  if (!visible) return false;

  group.traverse((child) => {
    const material = (child as THREE.Mesh).material as
      | (THREE.Material & { opacity: number })
      | undefined;

    if (material && 'opacity' in material) {
      material.opacity = value * ((material.userData.baseOpacity as number) ?? 1);
    }
  });

  return true;
}
