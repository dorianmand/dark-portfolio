import { Suspense } from 'react';
import type { Viewport } from '../config';
import type { IntroState } from '../introState';
import { AxesIndicator } from './AxesIndicator';
import { BoundingGeometry } from './BoundingGeometry';
import { CameraRig } from './CameraRig';
import { ConstructionLines } from './ConstructionLines';
import { GridSystem } from './GridSystem';
import { LogoPlane } from './LogoPlane';
import { NetworkLayer } from './NetworkLayer';
import { ReferencePlanes } from './ReferencePlanes';
import { SceneLighting } from './SceneLighting';
import { SectionGuides } from './SectionGuides';

/**
 * Scene composition. Each helper system is its own component reading its
 * own slice of the shared mutable state, so timings can be retuned in
 * config.ts without touching geometry code.
 */
export function IntroScene({
  state,
  viewport,
  pointerEnabled,
}: {
  state: IntroState;
  viewport: Viewport;
  pointerEnabled: boolean;
}) {
  return (
    <>
      <CameraRig state={state} viewport={viewport} pointerEnabled={pointerEnabled} />
      <SceneLighting />

      <ReferencePlanes state={state} viewport={viewport} />
      <GridSystem state={state} viewport={viewport} />
      <SectionGuides state={state} viewport={viewport} />
      <ConstructionLines state={state} viewport={viewport} />
      <BoundingGeometry state={state} viewport={viewport} />
      <AxesIndicator state={state} />
      <NetworkLayer state={state} viewport={viewport} />

      {/* The wordmark suspends on its texture; everything else renders
          immediately behind it. */}
      <Suspense fallback={null}>
        <LogoPlane state={state} viewport={viewport} />
      </Suspense>
    </>
  );
}
