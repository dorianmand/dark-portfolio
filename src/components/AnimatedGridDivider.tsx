import { useEffect, useRef, useState } from 'react';

/**
 * A wireframe plane that the page floats over, driven by scroll.
 *
 * The plane is a real grid in camera space, projected through a pinhole
 * camera: a point at depth `z` and lateral offset `x` lands at `(x / z, y / z)`,
 * with focal length and `zNear` both fixed at 1. That single model produces
 * every behaviour here:
 *
 *   - lines of constant depth become horizontals whose spacing tightens toward
 *     the far edge, because screen spacing falls off as 1/z²;
 *   - lines of constant lateral offset converge on the vanishing point. An odd
 *     column count puts no line at x = 0, centring a strip instead with its two
 *     bounding lines symmetric either side;
 *   - the projection scales with `y`, the plane's height relative to the
 *     camera, so at y = 0 it is exactly edge-on and collapses to one line.
 *
 * Two things are worth knowing about how it is anchored.
 *
 * The horizon sits at this element's own centre, so the collapse happens
 * exactly as the element crosses the middle of the viewport — that hairline is
 * the section rule. Everything else is measured in VIEWPORT fractions, not in
 * fractions of the element. An earlier version scaled the plane off its own
 * layout slot, which capped how large it could get: the slot had to contain the
 * plane, and once the slot grew taller than the viewport its centre scrolled
 * off-screen and took the plane with it.
 *
 * The plane is drawn BELOW the horizon when the element is ABOVE the middle of
 * the viewport. That is the pose the Rhino reference shows — looking down onto
 * the surface — and it only fits on screen that way round: a plane below a low
 * horizon has nowhere to go but off the bottom edge.
 */

/**
 * One geometry for every instance — there is deliberately no second variant.
 *
 * Measured off the Rhino reference, read as a full viewport frame: horizon at
 * 28% with empty ground above it, far edge at 55%, near edge at 97% — a
 * complete visible line just inside the bottom, not clipped. The far edge is
 * 39% of the near edge width, which fixes the depth ratio at 2.6.
 */
const GRID = {
  /** Odd column count — no line down the centre, a centred strip instead. */
  columns: { mobile: 9, desktop: 11 },
  rows: { mobile: 12, desktop: 16 },
  depthRatio: 2.6,

  /** Horizon height at full extension, as a fraction of the viewport. */
  horizonVh: 0.28,
  /** Near edge at full extension. The gap to horizonVh is the plane's reach. */
  nearEdgeVh: 0.97,
  /** Near edge width as a fraction of the viewport width. */
  nearWidthVw: 0.93,

  heightClass: 'h-[140px] md:h-[180px]',

  /**
   * Below this projected band height (px) the grid crossfades to a single
   * stroke. Hairlines packed into a few pixels stop reading as a grid and start
   * reading as a dark bar; this keeps the centre pose to one line.
   */
  collapsePx: 30,

  /**
   * Fade window, in multiples of the full-extension position. The plane keeps
   * growing past its reference pose, so it is faded out shortly after rather
   * than allowed to run away. This is also why two instances a few hundred
   * pixels apart never both paint at once.
   */
  fadeFromQ: 1.15,
  fadeToQ: 1.6,

  /**
   * The mirrored side fades far sooner than the floor side, deliberately.
   *
   * Past the collapse the plane flips and becomes the underside, and with a
   * symmetric fade that mirrored copy hangs at the top of the screen while the
   * next section's floor is already rising — two surfaces at once, one an exact
   * mirror of the other. Cutting it early keeps the flip as a gesture without
   * leaving a second plane on screen.
   */
  mirrorFadeFromQ: 0.12,
  mirrorFadeToQ: 0.55,

  opacity: { grid: 0.4, spine: 0.52 },

  /**
   * Hairline. At DPR >= 2 this resolves to a single device pixel; at DPR 1 the
   * browser antialiases it to a light stroke. Either way it should never read
   * as a 1px border.
   */
  strokeWidth: 0.5,
} as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Honours the OS setting, plus the same `?motion=full` / `?motion=reduced`
 * override the intro uses — so one URL exercises every motion path on the site
 * rather than just the intro's.
 */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const override = new URLSearchParams(window.location.search).get('motion');
    if (override === 'full' || override === 'reduced') {
      setReduced(override === 'reduced');
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

export function AnimatedGridDivider({
  className = '',
  contained = true,
}: {
  className?: string;
  /**
   * Wrap in the site's content column. Leave on when the divider stands between
   * sections; turn it off when it replaces a rule already inside a section's
   * column, so the padding is not applied twice.
   */
  contained?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gridRef = useRef<SVGPathElement | null>(null);
  const spineRef = useRef<SVGPathElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    const grid = gridRef.current;
    const spine = spineRef.current;
    if (!host || !svg || !grid || !spine) return;

    const R = GRID.depthRatio;

    /**
     * The collapsed hairline spans the near edge width — which is what an
     * edge-on plane actually projects to, and wide enough to read as the
     * section rule it replaces.
     */
    const spinePath = () => {
      const box = svg.getBoundingClientRect();
      const rect = host.getBoundingClientRect();
      const halfNear = (window.innerWidth * GRID.nearWidthVw) / 2;
      const cx = window.innerWidth / 2 - box.left;
      const cy = rect.top + rect.height / 2 - box.top;
      return `M${(cx - halfNear).toFixed(1)} ${cy.toFixed(1)}H${(cx + halfNear).toFixed(1)}`;
    };

    const drawCollapsed = () => {
      grid.setAttribute('opacity', '0');
      spine.setAttribute('d', spinePath());
      spine.setAttribute('opacity', String(GRID.opacity.spine));
    };

    if (reducedMotion) {
      drawCollapsed();
      const idle = new ResizeObserver(drawCollapsed);
      idle.observe(host);
      window.addEventListener('resize', drawCollapsed, { passive: true });
      return () => {
        idle.disconnect();
        window.removeEventListener('resize', drawCollapsed);
      };
    }

    const draw = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = host.getBoundingClientRect();
      const box = svg.getBoundingClientRect();
      if (!vw || !vh || !box.width) return;

      // The element marks the plane's NEAR edge — its front lip — so the
      // surface lies ABOVE the element, underneath the section content that
      // precedes it. Anchoring the horizon here instead put the surface below
      // the element, where it floored the *next* section rather than its own.
      const nearV = rect.top + rect.height / 2;

      // Signed progress. 0 when the element sits at the viewport centre, where
      // the plane is edge-on; +1 once it reaches `nearEdgeVh` near the bottom of
      // the screen — the reference pose, with the section's content filling the
      // frame above the floor. Negative once the element rises past centre,
      // which mirrors the plane and reads as the flip.
      const q = (nearV - vh / 2) / ((GRID.nearEdgeVh - 0.5) * vh);

      const reach = (GRID.nearEdgeVh - GRID.horizonVh) * vh;
      const y = q * reach;
      const horizonV = nearV - y;

      const halfNear = (vw * GRID.nearWidthVw) / 2;
      const cx = vw / 2 - box.left;
      const toBoxY = (viewportY: number) => viewportY - box.top;

      const narrow = vw < 768;
      const rows = narrow ? GRID.rows.mobile : GRID.rows.desktop;
      const columns = narrow ? GRID.columns.mobile : GRID.columns.desktop;

      let d = '';

      // Constant depth -> horizontals, tightening toward the far edge on their own.
      for (let i = 0; i <= rows; i++) {
        const z = 1 + (R - 1) * (i / rows);
        const sy = toBoxY(horizonV + y / z).toFixed(1);
        const sx = halfNear / z;
        d += `M${(cx - sx).toFixed(1)} ${sy}H${(cx + sx).toFixed(1)}`;
      }

      // Constant lateral offset -> verticals, near edge to far edge.
      const nearY = toBoxY(horizonV + y).toFixed(1);
      const farY = toBoxY(horizonV + y / R).toFixed(1);
      for (let j = 0; j <= columns; j++) {
        const x = -halfNear + (2 * halfNear * j) / columns;
        d += `M${(cx + x).toFixed(1)} ${nearY}L${(cx + x / R).toFixed(1)} ${farY}`;
      }

      const bandPx = Math.abs(y) * (1 - 1 / R);
      const collapse = 1 - smoothstep(0, GRID.collapsePx, bandPx);
      const edge =
        q >= 0
          ? 1 - smoothstep(GRID.fadeFromQ, GRID.fadeToQ, q)
          : 1 - smoothstep(GRID.mirrorFadeFromQ, GRID.mirrorFadeToQ, -q);

      grid.setAttribute('d', d);
      grid.setAttribute(
        'opacity',
        (GRID.opacity.grid * edge * (1 - collapse)).toFixed(3),
      );

      spine.setAttribute('d', spinePath());
      spine.setAttribute(
        'opacity',
        (GRID.opacity.spine * edge * collapse).toFixed(3),
      );
    };

    // One frame per scroll burst, and only while the element is near the
    // viewport, so geometry is never computed for instances far off screen.
    let frame = 0;
    let visible = false;

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      // Generous, because the plane reaches far beyond the element itself.
      { rootMargin: '150% 0px' },
    );
    observer.observe(host);

    const onScroll = () => {
      if (visible) schedule();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    const resize = new ResizeObserver(schedule);
    resize.observe(host);

    return () => {
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none relative -z-10 ${GRID.heightClass} ${className}`}
    >
      <div
        className={
          contained
            ? 'mx-auto h-full max-w-[1200px] px-6 md:px-10 lg:px-16'
            : 'h-full'
        }
      >
        <div className="relative h-full">
          {/*
            The SVG only reserves its slot; `overflow-visible` lets the plane
            paint well outside it, up behind the section's text. Coordinates are
            computed in viewport space and converted into this box, so the box's
            own size never constrains the geometry.
          */}
          <svg
            ref={svgRef}
            className="absolute inset-0 block h-full w-full overflow-visible text-text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={GRID.strokeWidth}
            shapeRendering="geometricPrecision"
          >
            <path ref={gridRef} opacity="0" />
            <path ref={spineRef} opacity="0" />
          </svg>
        </div>
      </div>
    </div>
  );
}
