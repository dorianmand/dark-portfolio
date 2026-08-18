/**
 * Mutable animation state shared between the GSAP master timeline and the
 * R3F scene.
 *
 * GSAP tweens these plain numbers; scene components read them inside
 * useFrame and write straight to materials/uniforms. Nothing here goes
 * through React state, so the 5-second timeline triggers zero re-renders.
 */

export type IntroPhase =
  | 'idle'
  | 'complexity'
  | 'deconstruction'
  | 'layerDissolve'
  | 'offReveal'
  | 'siteReveal'
  | 'done';

export interface IntroState {
  /** Per-system visibility, 1 = fully on, 0 = switched off. */
  annotations: number;
  boundingGeometry: number;
  constructionLines: number;
  sectionGuides: number;
  referencePlanes: number;
  grids: number;
  networkBranches: number;
  networkCore: number;
  axes: number;

  /** 0 = LAYER intact, 1 = LAYER fully dissolved down to the OFF boundary. */
  dissolve: number;
  /** 0 = OFF buried in interference, 1 = OFF fully resolved. */
  offReveal: number;
  /** 0 = intro scale, 1 = settled to the hero logo's on-screen size. */
  logoSettle: number;

  /** Normalised camera dolly, 0 = start distance, 1 = settled. */
  cameraDolly: number;
  /** Pointer parallax, in normalised device coords, damped. */
  pointerX: number;
  pointerY: number;
  /** Master scene opacity, used by the reduced-motion and fallback paths. */
  sceneOpacity: number;

  phase: IntroPhase;
}

export function createIntroState(): IntroState {
  return {
    annotations: 1,
    boundingGeometry: 1,
    constructionLines: 1,
    sectionGuides: 1,
    referencePlanes: 1,
    grids: 1,
    networkBranches: 1,
    networkCore: 1,
    axes: 1,
    dissolve: 0,
    offReveal: 0,
    logoSettle: 0,
    cameraDolly: 0,
    pointerX: 0,
    pointerY: 0,
    sceneOpacity: 1,
    phase: 'idle',
  };
}

/** The settled end state, used for reduced-motion and WebGL-failure paths. */
export function applyFinalState(state: IntroState): void {
  state.annotations = 0;
  state.boundingGeometry = 0;
  state.constructionLines = 0;
  state.sectionGuides = 0;
  state.referencePlanes = 0;
  state.grids = 0;
  state.networkBranches = 0;
  state.networkCore = 0;
  state.axes = 0;
  state.dissolve = 1;
  state.offReveal = 1;
  state.logoSettle = 1;
  state.cameraDolly = 1;
  state.sceneOpacity = 1;
  state.phase = 'done';
}
