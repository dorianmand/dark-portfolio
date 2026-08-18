import { INTRO_CONFIG } from './config';

/**
 * Session behaviour for the intro.
 *
 * The intro runs on every page load, including a refresh.
 *
 * It does NOT re-run on client-side navigation. This is a react-router SPA,
 * so returning to "/" from another route remounts HomePage without a page
 * load — replaying the intro there would put it in front of the visitor
 * every time they clicked back to the homepage. The module-scoped flag
 * below draws exactly that line: it resets on refresh, survives in-app
 * navigation.
 *
 * Development overrides:
 *   ?intro=off     — skip entirely
 *   ?skipIntro=1   — skip entirely (pre-existing convention, kept working)
 *   window.__layeroffReplayIntro()  — replay from the console
 */

const { replayParam, skipParam } = INTRO_CONFIG.session;

let playedThisPageLoad = false;

function params() {
  return new URLSearchParams(window.location.search);
}

export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;

  const search = params();

  // A deep link to a section should never sit behind the animation.
  if (search.get(skipParam) === '1') return false;
  if (window.location.hash.length > 0) return false;

  const mode = search.get(replayParam);
  if (mode === 'off') return false;
  if (mode === 'always') return true;

  return !playedThisPageLoad;
}

export function markIntroSeen(): void {
  playedThisPageLoad = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;

  // Explicit per-visit override, available in production too:
  //   ?motion=full     play the intro regardless of the OS setting
  //   ?motion=reduced  force the reduced path
  //
  // This does not weaken the accessibility guarantee. Without the parameter
  // the OS preference is still authoritative; the override only applies when
  // someone deliberately puts it in the URL — which is what makes it possible
  // to demo the intro on a machine that has animations switched off.
  const mode = params().get('motion');
  if (mode === 'full') return false;
  if (mode === 'reduced') return true;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Coarse pointer means touch — parallax is disabled there. */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: fine)').matches;
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

/** Exposes a console replay hook in dev without shipping a visible button. */
export function registerReplayHook(replay: () => void): () => void {
  if (!import.meta.env.DEV) return () => {};

  (window as unknown as Record<string, unknown>).__layeroffReplayIntro = () => {
    playedThisPageLoad = false;
    replay();
  };

  return () => {
    delete (window as unknown as Record<string, unknown>).__layeroffReplayIntro;
  };
}
