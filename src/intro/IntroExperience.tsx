import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { INTRO_CONFIG, resolveViewport, type Viewport } from './config';
import { createIntroState } from './introState';
import {
  hasFinePointer,
  markIntroSeen,
  prefersReducedMotion,
  registerReplayHook,
  supportsWebGL,
} from './introSession';
import { useIntroTimeline } from './useIntroTimeline';
import { AnnotationLayer } from './AnnotationLayer';

/** three.js and the whole scene graph stay out of the main bundle. */
const IntroCanvas = lazy(() => import('./IntroCanvas'));

/**
 * If anything in the WebGL layer throws, the homepage must still work.
 * This drops straight to the settled state rather than leaving a blank
 * screen.
 */
class CanvasBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function IntroExperience({ onSiteReveal }: { onSiteReveal: () => void }) {
  const state = useMemo(() => createIntroState(), []);
  const overlayRef = useRef<HTMLDivElement>(null);
  const revealFired = useRef(false);

  const [viewport, setViewport] = useState<Viewport>(() =>
    resolveViewport(typeof window === 'undefined' ? 1280 : window.innerWidth),
  );
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [fading, setFading] = useState(false);
  const [webglFailed, setWebglFailed] = useState(() => !supportsWebGL());

  // Stable identity — an inline arrow here re-fires the scene's ready
  // effect on every render.
  const handleReady = useCallback(() => setReady(true), []);
  const handleCanvasError = useCallback(() => setWebglFailed(true), []);

  const reducedMotion = useMemo(prefersReducedMotion, []);
  const pointerEnabled = useMemo(hasFinePointer, []) && !reducedMotion;

  // Track viewport class so the scene rebuilds at its correct density
  // rather than scaling a desktop composition down.
  useEffect(() => {
    const onResize = () => setViewport(resolveViewport(window.innerWidth));
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // The intro is a full-viewport takeover. Browsers restore scroll position
  // on reload, which would leave the page beneath scrolled — and the hero
  // mark the wordmark settles into would be measured far off-screen. Pin to
  // the top and hold scroll until the page is handed over.
  useEffect(() => {
    if (fading) return;

    window.scrollTo(0, 0);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [fading]);

  useEffect(() => {
    if (!pointerEnabled) return;

    const onMove = (event: PointerEvent) => {
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerEnabled, state]);

  /** Hand the page over, then fade the overlay out on top of it. */
  const fireSiteReveal = useCallback(() => {
    if (revealFired.current) return;
    revealFired.current = true;
    markIntroSeen();
    setFading(true);
    onSiteReveal();
  }, [onSiteReveal]);

  const handleComplete = useCallback(() => {
    fireSiteReveal();
    // Unmount once faded. Keeping a live canvas behind the hero would cost
    // frames forever for something the brief asks to end completely clean.
    window.setTimeout(() => setDismissed(true), 750);
  }, [fireSiteReveal]);

  // The site begins revealing while the last helper systems are still
  // clearing, so there is no seam between intro and page. The timeline
  // drives this — see the tl.call at phases.siteReveal.
  useIntroTimeline({
    state,
    enabled: ready && !webglFailed,
    reducedMotion,
    onSiteReveal: fireSiteReveal,
    onComplete: handleComplete,
  });

  // WebGL missing or broken: skip straight to the working homepage.
  useEffect(() => {
    if (!webglFailed) return;
    fireSiteReveal();
    setDismissed(true);
  }, [webglFailed, fireSiteReveal]);

  useEffect(
    () => registerReplayHook(() => window.location.reload()),
    [],
  );

  if (dismissed || webglFailed) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className={`fixed inset-0 z-40 bg-bg transition-opacity duration-700 ease-out ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Minimal loading treatment — the wordmark at low opacity on the
          site's own background. No spinner, no black screen. */}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <img
            src={INTRO_CONFIG.logo.src}
            alt=""
            className="h-64 w-auto opacity-10 transition-opacity duration-500 md:h-80"
          />
        </div>
      )}

      <CanvasBoundary onError={handleCanvasError}>
        <Suspense fallback={null}>
          <IntroCanvas
            state={state}
            viewport={viewport}
            pointerEnabled={pointerEnabled}
            onReady={handleReady}
          />
        </Suspense>
      </CanvasBoundary>

      <AnnotationLayer state={state} isMobile={viewport === 'mobile'} />
    </div>
  );
}
