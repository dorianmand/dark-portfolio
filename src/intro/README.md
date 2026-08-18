# LAYER OFF — homepage intro

A real-time WebGL intro integrated into the homepage hero. The scene opens
as an architectural/computational working model and switches its helper
systems off one by one until only the clean portfolio homepage remains.

## Asset limitation — read this first

**There is no 3D or vector source for the logo.** The only asset in the
project is `public/logo.png` — 1254×1254, 8-bit RGB, **no alpha channel**.

The intro works around this rather than faking a 3D logo:

- The wordmark is a **camera-facing textured quad**, not real geometry.
- The white background is **keyed out by luminance** in the shader, since
  the PNG has no alpha.
- LAYER and OFF are separated by **UV height plus chroma**, not by mesh
  hierarchy — LAYER is chromatic blue and sits above `v = 0.37`, OFF is an
  achromatic black outline below it. The feet of L and R dip under that
  line, which is why the shader also clears remnants by saturation.

### To get the fully intended version, provide a GLB

A `logo.glb` with **separate meshes for LAYER and OFF** would allow:

- real geometry with depth, silhouette and parallax instead of a flat quad
- true camera orbit/dolly without the artwork skewing
- per-letter animation and staggered dissolve
- genuine glass material on the OFF forms
- network nodes bound to actual vertices rather than measured UV anchors

Drop it at `public/logo.glb` and replace `LogoPlane.tsx`. Everything else —
timeline, helper systems, config, responsive and fallback logic — is
independent of how the wordmark is rendered and needs no changes.

An SVG would also be a large improvement over the PNG: paths could be
extruded to real geometry, and the LAYER/OFF split would come from the
document structure instead of being inferred from pixels.

## Structure

```
config.ts              all tunable values — timings, density, camera, colour
introState.ts          mutable state object shared with the scene
useIntroTimeline.ts    GSAP master timeline; orchestration only, no geometry
introSession.ts        session/replay rules, reduced motion, WebGL detection
IntroExperience.tsx    orchestrator: lazy canvas, fallbacks, pointer, handoff
IntroCanvas.tsx        <Canvas> host — lazy-loaded so three.js is code split
AnnotationLayer.tsx    HTML drawing notation (kept out of WebGL)
scene/                 one component per helper system
shaders/               the vertical dissolve material
```

GSAP tweens plain numbers on `introState`; scene components read them in
`useFrame` and write straight to materials. The 5.2s timeline causes **zero
React re-renders**.

## Where to tune what

Everything below lives in `config.ts`.

| I want to change… | Edit |
| --- | --- |
| Phase timings / total length | `phases` — each has `at` and `duration` |
| Order layers switch off | `deconstructionOrder` — `[start, end]` fractions |
| Camera angle, FOV, dolly | `camera.{desktop,tablet,mobile}` |
| Pointer parallax strength | `camera.parallax` |
| Logo size / dissolve boundary | `logo.size`, `logo.offBoundary` |
| Handoff scale into the hero | `logo.settleScale` |
| Dissolve softness | `logo.dissolveBand`, `logo.noiseAmount` |
| Grid density / opacity | `grid` |
| Node and link counts | `network` |
| Mobile simplification | the `mobile` key in each section |
| Frame rate cost | `performance.dpr` |

Annotation text and placement live in `AnnotationLayer.tsx`.

## Development

| URL | Effect |
| --- | --- |
| `?intro=always` | Replay every load, ignoring the session flag |
| `?intro=off` / `?skipIntro=1` | Skip entirely |
| `?introAt=3.2` | Freeze the timeline at 3.2s (dev only) |
| `?introSpeed=0.25` | Slow the sequence to a quarter speed (dev only) |
| `?motion=full` / `?motion=reduced` | Force a motion path (dev only) |

`window.__layeroffTimeline` is the live GSAP timeline in dev —
`.pause(2.4)`, `.timeScale(0.3)`, `.play()`.
`window.__layeroffReplayIntro()` clears the session flag and reloads.

## Behaviour guarantees

- **Session**: full intro once per browser session; later homepage visits in
  the same session land on the settled state. Deep links with a hash or
  `?skipIntro=1` always skip.
- **Reduced motion**: `prefers-reduced-motion: reduce` skips the whole
  sequence and fades into the final state over 0.45s. No camera move, no
  dissolve.
- **No WebGL**: `IntroExperience` returns `null` and the homepage renders
  normally. A render error inside the canvas is caught by `CanvasBoundary`
  and does the same.
- **Accessibility**: the overlay is `aria-hidden`, all real content stays in
  HTML, and the navbar remains mounted throughout — only its paint is
  deferred, so it is never removed from the accessibility tree.
- **Cost after the intro**: the canvas unmounts once it completes, so there
  is no ongoing render loop behind the hero.
