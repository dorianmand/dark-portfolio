import { useEffect, useRef, useState } from 'react';
import { LOGO_CYCLE_SECONDS } from './LayerOffLogo';

/**
 * The "workflow → AI layer" diagram in the hero, animated.
 *
 * The handoff export ships only a poster — the design tool could not encode
 * the MP4/WebM, and the earlier self-contained HTML bundle was 2MB, carried
 * its own playback UI and could not be re-triggered. So the sequence is
 * rebuilt here from the poster itself: the still is sliced into its parts by
 * position and each part is faded in on a timeline. One 64KB image, no video
 * dependency, replayable, and it cannot silently fail to play.
 *
 * REGIONS are measured from the 2200 × 1000 poster: the six workflow stages
 * with their five connecting arrows, the six dotted connectors, the six
 * automation functions and the AUTOMATION LAYER title bar. Everything is
 * expressed as a fraction of the poster, so it scales with the container.
 */
const POSTER = '/images/automation-layer-poster.webp';
const W = 2200;
const H = 1000;

type Region = { x: number; y: number; w: number; h: number };

const REGIONS = {
  stages: [
    { x: 214, y: 118, w: 87, h: 171 },
    { x: 528, y: 118, w: 132, h: 171 },
    { x: 870, y: 118, w: 108, h: 171 },
    { x: 1164, y: 118, w: 202, h: 171 },
    { x: 1483, y: 118, w: 226, h: 171 },
    { x: 1814, y: 118, w: 203, h: 171 },
  ] as Region[],
  arrows: [
    { x: 382, y: 150, w: 74, h: 50 },
    { x: 726, y: 150, w: 75, h: 50 },
    { x: 1053, y: 150, w: 74, h: 50 },
    { x: 1393, y: 150, w: 75, h: 50 },
    { x: 1718, y: 150, w: 74, h: 50 },
  ] as Region[],
  links: [
    { x: 242, y: 362, w: 27, h: 92 },
    { x: 578, y: 362, w: 27, h: 92 },
    { x: 911, y: 362, w: 27, h: 92 },
    { x: 1250, y: 362, w: 27, h: 92 },
    { x: 1581, y: 362, w: 27, h: 92 },
    { x: 1901, y: 362, w: 27, h: 92 },
  ] as Region[],
  funcs: [
    { x: 126, y: 501, w: 268, h: 276 },
    { x: 468, y: 501, w: 260, h: 276 },
    { x: 816, y: 501, w: 220, h: 276 },
    { x: 1119, y: 501, w: 284, h: 276 },
    { x: 1486, y: 501, w: 219, h: 276 },
    { x: 1794, y: 501, w: 247, h: 276 },
  ] as Region[],
  title: { x: 118, y: 830, w: 1962, h: 46 } as Region,
};

/** Timeline, in seconds, following the sequence described in the handoff. */
const STAGE_STEP = 0.22;
const LINK_START = 1.5;
const LINK_STEP = 0.34;
const TITLE_AT = LINK_START + LINK_STEP * 5 + 0.5;

const ALT =
  'Workflow stages — brief, concept, design, coordination, documentation, construction — each paired with an AI layer function beneath it: brief assistant, concept explorer, design copilot, coordination agent, doc automator, construction intelligence.';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/**
 * One slice of the poster: a window at the region's position, holding a copy
 * of the full image offset so only that region shows through. Percentages are
 * relative to the slice, so the whole thing scales with the container and
 * stays pixel-aligned at any width.
 */
function Slice({
  region,
  delay,
  playing,
  instant = false,
  rise = 0,
}: {
  region: Region;
  delay: number;
  playing: boolean;
  /** Skip the timeline entirely and show the finished diagram. */
  instant?: boolean;
  /** Small upward drift as it fades in, in poster units. */
  rise?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute overflow-hidden"
      style={{
        left: `${(region.x / W) * 100}%`,
        top: `${(region.y / H) * 100}%`,
        width: `${(region.w / W) * 100}%`,
        height: `${(region.h / H) * 100}%`,
        opacity: playing ? 1 : 0,
        transform: playing ? 'translateY(0)' : `translateY(${(rise / H) * 100}%)`,
        transition: instant
          ? 'none'
          : `opacity 620ms ease-out ${delay}s, transform 620ms cubic-bezier(.22,.61,.36,1) ${delay}s`,
      }}
    >
      <img
        src={POSTER}
        alt=""
        className="absolute max-w-none"
        style={{
          width: `${(W / region.w) * 100}%`,
          height: `${(H / region.h) * 100}%`,
          left: `${-(region.x / region.w) * 100}%`,
          top: `${-(region.y / region.h) * 100}%`,
        }}
      />
    </span>
  );
}

type Props = {
  /** True while the intro still owns the screen. Holds the sequence back. */
  hold?: boolean;
};

export function HeroAutomationLayer({ hold = false }: Props) {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [logoDone, setLogoDone] = useState(false);

  /**
   * The header wordmark's shadow makes one full pass before this starts, so
   * the two are read in sequence rather than competing for attention on
   * arrival. Timed from mount, which is when the logo's own CSS animation
   * begins.
   */
  useEffect(() => {
    const timer = window.setTimeout(
      () => setLogoDone(true),
      LOGO_CYCLE_SECONDS * 1000,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  const playing = reducedMotion || (inView && !hold && logoDone);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={ALT}
      className="relative w-full"
      /* 2200 × 1000. Deliberately transparent rather than filled with the
         artwork's ground: the page is already that exact colour, so the fill
         bought nothing, and an opaque box would paint over the copy above it
         now that the diagram is pulled up into the text's row. The artwork
         itself starts ~12% down the block, so the overlap lands in empty
         space. */
      style={{ aspectRatio: '11 / 5' }}
    >
      {REGIONS.stages.map((region, i) => (
        <Slice key={`s${i}`} region={region} delay={i * STAGE_STEP} playing={playing} instant={reducedMotion} rise={10} />
      ))}

      {REGIONS.arrows.map((region, i) => (
        <Slice
          key={`a${i}`}
          region={region}
          delay={i * STAGE_STEP + STAGE_STEP * 0.6}
          playing={playing}
          instant={reducedMotion}
        />
      ))}

      {REGIONS.links.map((region, i) => (
        <Slice
          key={`l${i}`}
          region={region}
          delay={LINK_START + i * LINK_STEP}
          playing={playing}
          instant={reducedMotion}
          rise={-24}
        />
      ))}

      {REGIONS.funcs.map((region, i) => (
        <Slice
          key={`f${i}`}
          region={region}
          delay={LINK_START + i * LINK_STEP + 0.16}
          playing={playing}
          instant={reducedMotion}
          rise={14}
        />
      ))}

      <Slice region={REGIONS.title} delay={TITLE_AT} playing={playing} instant={reducedMotion} />
    </div>
  );
}
