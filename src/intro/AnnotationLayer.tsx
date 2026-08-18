import { useEffect, useRef } from 'react';
import type { IntroState } from './introState';

/**
 * Drawing notation, rendered in HTML rather than WebGL so it uses the
 * site's own typography and stays out of the texture budget.
 *
 * Each label declares which system it belongs to, and fades with that
 * system's own state value — so the notation switches off in step with the
 * geometry it describes, without a second timeline to keep in sync.
 */

type SystemKey = Extract<
  keyof IntroState,
  | 'annotations'
  | 'grids'
  | 'sectionGuides'
  | 'constructionLines'
  | 'boundingGeometry'
  | 'axes'
  | 'networkBranches'
>;

interface Annotation {
  label: string;
  system: SystemKey;
  /**
   * Anchored to the nearest edge rather than centred on a percentage —
   * centring pushed the longer labels off-screen at mobile widths.
   */
  side: 'left' | 'right';
  /** Inset from that edge, as a percentage of canvas width. */
  inset: number;
  /** Vertical position, as a percentage of canvas height. */
  y: number;
  /** Hidden on mobile, where the frame is much tighter. */
  desktopOnly?: boolean;
}

const ANNOTATIONS: Annotation[] = [
  { label: 'NODE', system: 'networkBranches', side: 'left', inset: 7, y: 19 },
  { label: 'PARAMETER 01', system: 'boundingGeometry', side: 'left', inset: 7, y: 31 },
  { label: 'VECTOR', system: 'constructionLines', side: 'left', inset: 7, y: 47, desktopOnly: true },
  { label: 'X  Y  Z', system: 'axes', side: 'left', inset: 7, y: 68 },
  { label: 'GRID', system: 'grids', side: 'left', inset: 7, y: 84 },
  { label: 'DATUM', system: 'grids', side: 'left', inset: 7, y: 88, desktopOnly: true },
  { label: 'CONSTRAINT', system: 'boundingGeometry', side: 'right', inset: 7, y: 19, desktopOnly: true },
  { label: 'SECTION A–A', system: 'sectionGuides', side: 'right', inset: 7, y: 31 },
  { label: 'SURFACE', system: 'constructionLines', side: 'right', inset: 7, y: 47, desktopOnly: true },
  { label: 'SECTION B–B', system: 'sectionGuides', side: 'right', inset: 7, y: 62, desktopOnly: true },
  { label: '02', system: 'annotations', side: 'right', inset: 7, y: 84, desktopOnly: true },
  { label: '03', system: 'annotations', side: 'right', inset: 7, y: 88, desktopOnly: true },
];

export function AnnotationLayer({
  state,
  isMobile,
}: {
  state: IntroState;
  isMobile: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-system]'),
    );

    let raf = 0;
    const tick = () => {
      for (const node of nodes) {
        const system = node.dataset.system as SystemKey;
        node.style.opacity = String(state[system] * state.sceneOpacity);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const visible = ANNOTATIONS.filter((a) => !(isMobile && a.desktopOnly));

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 select-none"
    >
      {visible.map((annotation) => (
        <span
          key={annotation.label}
          data-system={annotation.system}
          className={`absolute whitespace-nowrap text-[9px] uppercase tracking-[0.28em] text-muted/70 md:text-[10px] ${
            annotation.side === 'right' ? 'text-right' : 'text-left'
          }`}
          style={{
            [annotation.side]: `${annotation.inset}%`,
            top: `${annotation.y}%`,
            transform: 'translateY(-50%)',
          }}
        >
          {annotation.label}
        </span>
      ))}
    </div>
  );
}
