import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { INTRO_CONFIG } from './config';
import { applyFinalState, type IntroState } from './introState';

/**
 * The master intro timeline.
 *
 * Orchestration only — this file never touches geometry. It tweens the
 * plain numbers on `state`; the scene components read them each frame.
 * Phase boundaries and easings all resolve from INTRO_CONFIG so timings
 * stay tunable in one place.
 */
export function useIntroTimeline({
  state,
  enabled,
  reducedMotion,
  onSiteReveal,
  onComplete,
}: {
  state: IntroState;
  enabled: boolean;
  reducedMotion: boolean;
  onSiteReveal: () => void;
  onComplete: () => void;
}) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const revealRef = useRef(onSiteReveal);
  revealRef.current = onSiteReveal;

  useEffect(() => {
    if (!enabled) return;

    // Reduced motion: land on the settled composition with a short fade.
    // No camera movement, no dissolve.
    if (reducedMotion) {
      applyFinalState(state);
      state.sceneOpacity = 0;
      revealRef.current();
      const tween = gsap.to(state, {
        sceneOpacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => completeRef.current(),
      });
      return () => {
        tween.kill();
      };
    }

    const { phases, deconstructionOrder } = INTRO_CONFIG;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => completeRef.current(),
    });
    timelineRef.current = tl;

    // --- Phase 01 — complexity ------------------------------------------
    // Everything is already on; the camera begins an almost imperceptible
    // forward move that runs underneath the whole sequence.
    state.phase = 'complexity';
    tl.to(
      state,
      {
        cameraDolly: 1,
        duration: phases.complexity.duration + phases.deconstruction.duration,
        ease: 'power1.inOut',
      },
      phases.complexity.at,
    );

    // --- Phase 02 — systems switch off ----------------------------------
    // Sequential, with the overlaps defined in config. Each system also
    // drifts up a touch as it goes, so it reads as being switched off
    // rather than simply faded.
    tl.call(() => { state.phase = 'deconstruction'; }, [], phases.deconstruction.at);

    const decon = phases.deconstruction;
    for (const [key, [from, to]] of Object.entries(deconstructionOrder)) {
      const startAt = decon.at + from * decon.duration;
      const duration = Math.max(0.12, (to - from) * decon.duration);

      tl.to(
        state,
        { [key]: 0, duration, ease: 'power2.in' },
        startAt,
      );
    }

    // --- Phase 03 — LAYER dissolves -------------------------------------
    // The front descends through the artwork and stops at the OFF boundary.
    tl.call(() => { state.phase = 'layerDissolve'; }, [], phases.dissolve.at);
    tl.to(
      state,
      {
        dissolve: 1,
        duration: phases.dissolve.duration,
        ease: 'power3.inOut',
      },
      phases.dissolve.at,
    );

    // --- Phase 04 — OFF resolves ----------------------------------------
    // The core network briefly organises around OFF, then thins back out,
    // so the final state is cleaner than the intermediate one.
    tl.call(() => { state.phase = 'offReveal'; }, [], phases.offReveal.at);
    tl.to(
      state,
      {
        offReveal: 1,
        duration: phases.offReveal.duration,
        ease: 'power2.out',
      },
      phases.offReveal.at,
    );

    tl.to(
      state,
      { networkCore: 1, duration: phases.offReveal.duration * 0.45, ease: 'power2.out' },
      phases.offReveal.at,
    );
    tl.to(
      state,
      {
        networkCore: 0,
        duration: phases.offReveal.duration * 0.7,
        ease: 'power2.inOut',
      },
      phases.offReveal.at + phases.offReveal.duration * 0.5,
    );

    // --- Phase 05 — clarity ---------------------------------------------
    // The wordmark settles to the hero's scale as the page arrives.
    tl.to(
      state,
      {
        logoSettle: 1,
        duration: phases.siteReveal.duration,
        ease: 'power2.inOut',
      },
      phases.siteReveal.at,
    );

    // Hand the page over from the timeline itself rather than a parallel
    // setTimeout — otherwise the reveal fires on wall-clock time even if the
    // animation is paused, slowed or running behind.
    tl.call(
      () => {
        state.phase = 'siteReveal';
        revealRef.current();
      },
      [],
      phases.siteReveal.at,
    );
    tl.call(() => { state.phase = 'done'; }, [], INTRO_CONFIG.totalDuration);

    // Dev-only scrubbing. Freeze a moment with ?introAt=2.4 or slow the
    // whole sequence with ?introSpeed=0.2 while art-directing; the console
    // handle allows the same live.
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__layeroffTimeline = tl;

      const search = new URLSearchParams(window.location.search);
      const speed = Number(search.get('introSpeed'));
      if (speed > 0) tl.timeScale(speed);

      const at = search.get('introAt');
      if (at !== null) tl.pause(Number(at));
    }

    return () => {
      tl.kill();
      timelineRef.current = null;
      if (import.meta.env.DEV) {
        delete (window as unknown as Record<string, unknown>).__layeroffTimeline;
      }
    };
  }, [enabled, reducedMotion, state]);

  return timelineRef;
}
