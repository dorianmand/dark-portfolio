import { INTRO_CONFIG } from '../config';

/**
 * Deliberately simple lighting. The scene is line work, transparency and a
 * keyed raster on a white ground, so there is nothing here that benefits
 * from an environment map or real-time shadows — both would cost far more
 * than they'd show.
 */
export function SceneLighting() {
  return (
    <>
      <hemisphereLight
        args={[INTRO_CONFIG.color.background, INTRO_CONFIG.color.glass, 1.15]}
      />
      <directionalLight position={[6, 9, 5]} intensity={0.5} />
      <directionalLight position={[-7, 4, -3]} intensity={0.18} />
    </>
  );
}
