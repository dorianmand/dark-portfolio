/**
 * Central tuning surface for the LAYER OFF intro.
 * Every timing, density and camera value the intro uses lives here —
 * nothing in the scene components should contain a bare magic number.
 */

export type Viewport = 'desktop' | 'tablet' | 'mobile';

export const INTRO_CONFIG = {
  /**
   * Phase start times and durations, in seconds, on the master timeline.
   * Phases deliberately overlap; `at` is the absolute start on the timeline.
   */
  phases: {
    complexity: { at: 0.0, duration: 0.8 },
    deconstruction: { at: 0.65, duration: 1.8 },
    dissolve: { at: 1.5, duration: 1.5 },
    offReveal: { at: 2.1, duration: 1.2 },
    siteReveal: { at: 3.2, duration: 1.0 },
  },

  /** Total runtime is derived, not hardcoded, so edits above stay consistent. */
  get totalDuration() {
    return Math.max(
      ...Object.values(this.phases).map((p) => p.at + p.duration),
    );
  },

  /**
   * Order in which the helper systems switch off during deconstruction.
   * Each entry is a fraction of the deconstruction window: [start, end].
   * Sequential with slight overlap, per the layer-by-layer brief.
   */
  deconstructionOrder: {
    annotations: [0.0, 0.22],
    boundingGeometry: [0.12, 0.36],
    constructionLines: [0.24, 0.5],
    sectionGuides: [0.36, 0.58],
    referencePlanes: [0.48, 0.72],
    grids: [0.58, 0.84],
    networkBranches: [0.68, 0.92],
    axes: [0.8, 1.0],
  } as const,

  camera: {
    /** Shared look-at target; the logo sits at the origin. */
    target: [0, 0, 0] as [number, number, number],
    desktop: { position: [7.2, 6.5, 7.2], fov: 22, dolly: 0.72 },
    tablet: { position: [7.8, 6.9, 7.8], fov: 26, dolly: 0.6 },
    mobile: { position: [8.4, 7.2, 8.4], fov: 34, dolly: 0.45 },
    /** Pointer parallax after the intro settles. Kept deliberately tiny. */
    parallax: { strength: 0.16, damping: 0.045 },
  },

  logo: {
    /**
     * The warm mark, 1000x1000 with a real alpha channel — matches the
     * hero's own artwork and this site's palette. Downscaled from a 1254px
     * source, so there is no upscaling anywhere in the chain.
     */
    src: '/images/layeroff-intro.png',

    /**
     * World size of the logo quad. Sized so the wordmark keeps clear
     * margins inside the camera frustum — at 6.0 it filled the viewport
     * height exactly and clipped the Y.
     */
    size: { desktop: 4.8, tablet: 4.5, mobile: 3.9 },
    /**
     * UV height (v, measured from the bottom of the texture) at which the
     * OFF wordmark ends and LAYER begins. The dissolve front stops here so
     * OFF is never eroded. Measured from the warm mark: OFF's top edge sits
     * at v ≈ 0.31, and the feet of L and R dip below it — those are cleared
     * by luminance in the shader rather than by height.
     */
    offBoundary: 0.3,
    /**
     * During siteReveal the 3D wordmark scales toward the size of the
     * hero's <img>, so the crossfade into the real page is continuous
     * rather than a jump cut. Retune if the hero logo size changes.
     */
    settleScale: 0.64,
    /**
     * The hero mark the wordmark settles into. Its position and size are
     * measured from the live DOM, so the handoff stays aligned at every
     * breakpoint instead of depending on hardcoded world coordinates.
     * Falls back to settleScale if the element is missing.
     */
    settleTarget: '[data-intro-settle-target]',
    /**
     * Saturation window separating the two wordmarks, measured off the
     * actual asset:
     *
     *   charcoal LAYER   median 0.037, p95 0.077
     *   cream OFF        p05 0.098, median 0.116
     *
     * Saturation rather than luminance, deliberately. The material has
     * visible grain, and that grain is achromatic — so a luminance
     * threshold jitters pixel to pixel and erodes the glyph edges into
     * dither, while saturation stays stable across both the lit top faces
     * and the shaded sides of the same letter.
     */
    layerSaturation: [0.1, 0.145] as [number, number],
    /** Width of the transitional edge band at the dissolve front, in UV. */
    dissolveBand: 0.13,
    /** Amplitude of threshold noise. Small — this stays surgical, not smoky. */
    noiseAmount: 0.024,
    noiseScale: 5.5,
  },

  grid: {
    /** Ground plane grid extent and spacing. */
    ground: { size: 26, step: 1.0 },
    /** Vertical reference grids (XZ / YZ). */
    vertical: { size: 14, step: 1.0 },
    opacity: { desktop: 0.3, tablet: 0.28, mobile: 0.2 },
    /** Mobile drops the vertical grids entirely. */
    verticalOn: { desktop: true, tablet: true, mobile: false },
  },

  network: {
    nodeCount: { desktop: 78, tablet: 58, mobile: 30 },
    /** Extra nodes clustered around the OFF region. */
    offClusterCount: { desktop: 34, tablet: 26, mobile: 16 },
    nodeSize: 0.032,
    /** Max distance for two nodes to be linked. */
    linkRadius: 1.5,
    maxLinks: { desktop: 150, tablet: 110, mobile: 52 },
    opacity: 0.8,
  },

  constructionLines: {
    count: { desktop: 22, tablet: 18, mobile: 9 },
    opacity: 0.45,
  },

  boundingGeometry: {
    /** Wireframe cages placed on selected logo regions, not everything. */
    count: { desktop: 4, tablet: 3, mobile: 2 },
    opacity: 0.38,
  },

  referencePlanes: {
    opacity: 0.15,
    /** Mobile keeps only the ground plane. */
    count: { desktop: 4, tablet: 3, mobile: 1 },
  },

  sectionGuides: {
    count: { desktop: 2, tablet: 2, mobile: 1 },
    opacity: 0.45,
  },

  /**
   * Palette resolved from this site's own tokens in index.css — warm cream
   * ground, ink line work, warm grey secondaries.
   *
   * Deliberately no accent and no cool blue: CLAUDE.md reserves the single
   * gold accent for hairline rules ("Never a gradient") and rules out
   * glowing technology interfaces, so the construction systems stay
   * achromatic. The only colour in frame is the artwork itself.
   */
  color: {
    background: '#F8F6F1', // --bg   40 33% 96%
    line: '#1C1A17', // --text 40 8% 10%
    lineSoft: '#6C6860', // --muted 40 6% 40%
    glass: '#C9C2B6',
    node: '#57534B',
    annotation: '#6C6860',
  },

  performance: {
    /** Capped DPR — unlimited pixel ratio is the usual mobile killer. */
    dpr: [1, 1.5] as [number, number],
    /** Stop rendering frames once the intro has settled and pointer is idle. */
    demandRenderAfterIntro: true,
  },

  session: {
    /** ?intro=off bypasses the intro; ?skipIntro=1 does the same. */
    replayParam: 'intro',
    skipParam: 'skipIntro',
  },
} as const;

/** Breakpoints match the Tailwind defaults the site already uses. */
export function resolveViewport(width: number): Viewport {
  if (width < 768) return 'mobile';
  if (width < 1280) return 'tablet';
  return 'desktop';
}
