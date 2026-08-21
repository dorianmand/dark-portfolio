import { useEffect, useRef, useState } from 'react';

/**
 * A wireframe plane that passes through the page edge-on as you scroll.
 *
 * The plane is a real grid in camera space, not a CSS perspective box or a
 * set of lines animating independently. Every frame it is projected through a
 * pinhole camera: a point at depth `z` and lateral offset `x` lands at
 * `(x / z, y / z)`, with focal length and `zNear` both fixed at 1. That is the
 * entire model, and it is what makes the motion read as one rigid object:
 *
 *   - lines of constant depth become horizontals whose spacing tightens
 *     toward the far edge, because spacing falls off as 1/z;
 *   - lines of constant lateral offset converge on the vanishing point, the
 *     outermost angling hardest while the centre one stays exactly vertical,
 *     because x = 0 projects to x = 0 at every depth;
 *   - the whole projection scales with `y`, the plane's height relative to the
 *     camera, so at y = 0 it is exactly edge-on and collapses to a single
 *     line. Nothing is faked to get there — it falls out of the projection.
 *
 * `y` is driven directly by this element's own position in the viewport, so
 * the motion is scroll-locked rather than timed, and every instance responds
 * to where it sits in the document.
 *
 * The far edge is anchored to the site's content column so the plane's back
 * edge lands on the same rules the sections use; the near edge runs past it by
 * `depthRatio`. Proportions start from the Rhino reference stills but are
 * pitched steeper — see `depthRatio` and `travel`.
 */
const GRID = {
  /** Subdivisions per axis. Fewer on narrow screens so hairlines stay legible. */
  subdivisions: { mobile: 8, desktop: 10 },

  /**
   * zFar / zNear. Sets both how hard the plane narrows with depth and how deep
   * the band is: far width is 1/ratio of near width, and the band spans
   * (1 - 1/ratio) of the near edge's offset from centre.
   *
   * It is also exactly how much longer the near edge is than the far one, so
   * this is the knob for "how far does the front run past the back".
   *
   * Well past the 1.75 the reference stills measure at: those were shot from a
   * shallower angle that reads as a thin sliver at this page width.
   */
  depthRatio: 3,

  /**
   * Far edge width as a multiple of the drawing box. The box is the site's own
   * content column, so at 1 the plane's back edge lands exactly on the section
   * rules above and below it. The near edge is this multiplied by depthRatio,
   * running proportionally past the column on both sides.
   */
  farWidth: 1,

  /**
   * Peak offset of the near edge from the centre line, as a fraction of the
   * drawing box — i.e. how high the camera sits above the plane. Independent of
   * depthRatio: raising this shows more of the surface without altering the
   * near/far width proportion. Capped near 0.58, past which the near edge
   * leaves the box at full extension.
   */
  travel: 0.54,

  /**
   * Below this projected band height (px) the grid crossfades to a single
   * stroke. Eleven hairlines packed into a few pixels stop reading as a grid
   * and start reading as a dark bar; this keeps the centre pose to one line,
   * which is the whole point of it.
   */
  collapsePx: 30,

  /** |progress| at which the plane starts fading out near the viewport edges. */
  fadeFrom: 0.86,

  opacity: { grid: 0.4, spine: 0.52 },

  /**
   * Hairline. At DPR >= 2 this resolves to a single device pixel; at DPR 1 the
   * browser antialiases it to a light stroke. Either way it should never read
   * as a 1px border.
   */
  strokeWidth: 0.5,
} as const;

/**
 * How far the drawing box overhangs its layout slot, as a percentage of the
 * slot height. Lets the plane travel further than the space the divider
 * reserves, reaching only into the neighbouring sections' padding.
 */
const OVERSCAN = 140;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Honours the OS setting, plus the same `?motion=full` / `?motion=reduced`
 * override the intro uses — so one URL exercises every motion path on the
 * site rather than just the intro's.
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
   * Wrap in the site's content column. Leave on when the divider stands
   * between sections; turn it off when it replaces a rule that already sits
   * inside a section's column, so the padding is not applied twice.
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
     * The collapsed hairline is drawn at the far edge width, so the moment the
     * plane goes edge-on it reads as one more section rule rather than a line
     * overshooting the column. Physically the edge-on plane spans the near
     * width; this is a deliberate stylisation of that instant.
     */
    const spinePath = (w: number, h: number) => {
      const halfFar = (w * GRID.farWidth) / 2;
      const cy = (h / 2).toFixed(1);
      return `M${(w / 2 - halfFar).toFixed(1)} ${cy}H${(w / 2 + halfFar).toFixed(1)}`;
    };

    /** The plane seen exactly edge-on: one hairline across the centre. */
    const drawCollapsed = () => {
      const w = svg.clientWidth;
      const h = svg.clientHeight;
      if (!w || !h) return;

      grid.setAttribute('opacity', '0');
      spine.setAttribute('d', spinePath(w, h));
      spine.setAttribute('opacity', String(GRID.opacity.spine));
    };

    if (reducedMotion) {
      drawCollapsed();
      const idle = new ResizeObserver(drawCollapsed);
      idle.observe(host);
      return () => idle.disconnect();
    }

    const draw = () => {
      const w = svg.clientWidth;
      const h = svg.clientHeight;
      if (!w || !h) return;

      // Where this instance sits relative to the viewport centre:
      // -1 entering from the bottom, 0 dead centre, +1 leaving past the top.
      const rect = host.getBoundingClientRect();
      const viewport = window.innerHeight;
      const centre = rect.top + rect.height / 2;
      const p = clamp(
        (viewport / 2 - centre) / ((viewport + rect.height) / 2),
        -1,
        1,
      );

      const cx = w / 2;
      const cy = h / 2;
      // World lateral extent. With zNear = 1 the near edge projects at exactly
      // this, and the far edge at this over R — so anchoring the far edge to
      // the column means scaling the extent up by R.
      const halfNear = ((w * GRID.farWidth) / 2) * R;
      const y = p * (h * GRID.travel);
      const n = w < 768 ? GRID.subdivisions.mobile : GRID.subdivisions.desktop;

      let d = '';

      // Constant depth -> horizontals. Depth runs 1 to R, so the spacing
      // tightens toward the far edge on its own.
      for (let i = 0; i <= n; i++) {
        const z = 1 + (R - 1) * (i / n);
        const sy = (cy - y / z).toFixed(1);
        const sx = halfNear / z;
        d += `M${(cx - sx).toFixed(1)} ${sy}H${(cx + sx).toFixed(1)}`;
      }

      // Constant lateral offset -> verticals, near edge to far edge.
      const nearY = (cy - y).toFixed(1);
      const farY = (cy - y / R).toFixed(1);
      for (let j = 0; j <= n; j++) {
        const x = -halfNear + (2 * halfNear * j) / n;
        d += `M${(cx + x).toFixed(1)} ${nearY}L${(cx + x / R).toFixed(1)} ${farY}`;
      }

      const bandPx = Math.abs(y) * (1 - 1 / R);
      const collapse = 1 - smoothstep(0, GRID.collapsePx, bandPx);
      const edge = 1 - smoothstep(GRID.fadeFrom, 1, Math.abs(p));

      grid.setAttribute('d', d);
      grid.setAttribute(
        'opacity',
        (GRID.opacity.grid * edge * (1 - collapse)).toFixed(3),
      );

      spine.setAttribute('d', spinePath(w, h));
      spine.setAttribute(
        'opacity',
        (GRID.opacity.spine * edge * collapse).toFixed(3),
      );
    };

    // One frame per scroll burst, and only while the plane is near the
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
      { rootMargin: '25% 0px' },
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
      className={`pointer-events-none relative h-[220px] md:h-[320px] ${className}`}
    >
      {/*
        The same content column every section uses, so the plane's back edge —
        and the hairline it collapses into — lands on the same width as the
        rules it replaces rather than running full bleed.
      */}
      <div
        className={
          contained
            ? 'mx-auto h-full max-w-[1200px] px-6 md:px-10 lg:px-16'
            : 'h-full'
        }
      >
        <div className="relative h-full">
          {/*
            The drawing box overhangs its layout slot vertically so the plane
            can travel further than the space the divider reserves. It only
            reaches into the neighbouring sections' padding, and being
            absolutely positioned it cannot push content.

            Height is set explicitly rather than via top + bottom: an <svg> is
            a replaced element with an intrinsic 300x150 size, so an
            over-constrained absolute box ignores `bottom` and keeps that
            intrinsic height.
          */}
          <svg
            ref={svgRef}
            className="absolute inset-x-0 block w-full overflow-visible text-text-primary"
            style={{ top: `${-OVERSCAN / 2}%`, height: `${100 + OVERSCAN}%` }}
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
