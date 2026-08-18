import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { INTRO_CONFIG, type Viewport } from './config';
import type { IntroState } from './introState';
import { IntroScene } from './scene/IntroScene';

/**
 * Canvas host, in its own module so the whole three.js graph can be code
 * split out of the main bundle — see the lazy() call in IntroExperience.
 *
 * The `gl` and `camera` props MUST keep a stable identity. R3F treats a new
 * object here as a request to rebuild the renderer, which drops the WebGL
 * context and remounts the scene on every render.
 */

const GL_CONFIG = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
} as const;

/** Fires once the suspended scene content has actually mounted. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export default function IntroCanvas({
  state,
  viewport,
  pointerEnabled,
  onReady,
}: {
  state: IntroState;
  viewport: Viewport;
  pointerEnabled: boolean;
  onReady: () => void;
}) {
  const cameraConfig = useMemo(() => {
    const { position, fov } = INTRO_CONFIG.camera[viewport];
    return { position: [...position] as [number, number, number], fov, near: 0.1, far: 100 };
  }, [viewport]);

  return (
    <Canvas
      dpr={INTRO_CONFIG.performance.dpr}
      gl={GL_CONFIG}
      camera={cameraConfig}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <IntroScene
          state={state}
          viewport={viewport}
          pointerEnabled={pointerEnabled}
        />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
