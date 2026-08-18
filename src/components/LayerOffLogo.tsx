import { useEffect } from 'react';

// Animated LAYER OFF header logo.
// Two stacked PNG layers: the LAYER wordmark stays put, the OFF shadow beneath
// it animates independently, as if a light source were swinging overhead.
//
// Size it with the --lo-h custom property (height of the LAYER wordmark),
// e.g. className="[--lo-h:48px] sm:[--lo-h:110px]". The cast shadow extends
// below the box and overflows it — that's intentional, don't clip an ancestor.
//
// The wordmark's letter interiors are filled #F8F5F1 to match --bg, so it can
// occlude the shadow passing beneath it. Regenerate the PNG if --bg changes.

const ASSETS = '/images';
/** One full pass of the shadow sweep. Exported so the hero diagram can wait
 *  for the wordmark to finish its first cycle before starting its own. */
export const LOGO_CYCLE_SECONDS = 6.4;
const LETTERS_H = 177;
const BOX_H = 264;

const CSS = `
@keyframes lo-shadow {
  0%   { transform: none; filter: blur(calc(var(--lo-h) * .0095)); opacity: .92; }
  20%  { transform: none; filter: blur(calc(var(--lo-h) * .0095)); opacity: .92; }
  36%  { transform: skewX(-13deg) scaleY(1.4); filter: blur(calc(var(--lo-h) * .043)); opacity: .68; }
  52%  { transform: skewX(-4deg) scaleY(.52); filter: blur(calc(var(--lo-h) * .014)); opacity: .95; }
  68%  { transform: skewX(9deg) scaleY(1.22); filter: blur(calc(var(--lo-h) * .033)); opacity: .74; }
  82%  { transform: skewX(3deg) scaleY(.8); filter: blur(calc(var(--lo-h) * .014)); opacity: .9; }
  92%  { transform: none; filter: blur(calc(var(--lo-h) * .0095)); opacity: .92; }
  100% { transform: none; filter: blur(calc(var(--lo-h) * .0095)); opacity: .92; }
}
@keyframes lo-letters {
  0%   { filter: drop-shadow(calc(var(--lo-h) * -.0095) calc(var(--lo-h) * .014) calc(var(--lo-h) * .019) rgba(20,18,15,.2)); }
  20%  { filter: drop-shadow(calc(var(--lo-h) * -.0095) calc(var(--lo-h) * .014) calc(var(--lo-h) * .019) rgba(20,18,15,.2)); }
  36%  { filter: drop-shadow(calc(var(--lo-h) * .019) calc(var(--lo-h) * .024) calc(var(--lo-h) * .033) rgba(20,18,15,.14)); }
  52%  { filter: drop-shadow(calc(var(--lo-h) * .005) calc(var(--lo-h) * .0095) calc(var(--lo-h) * .014) rgba(20,18,15,.22)); }
  68%  { filter: drop-shadow(calc(var(--lo-h) * -.024) calc(var(--lo-h) * .019) calc(var(--lo-h) * .033) rgba(20,18,15,.14)); }
  92%  { filter: drop-shadow(calc(var(--lo-h) * -.0095) calc(var(--lo-h) * .014) calc(var(--lo-h) * .019) rgba(20,18,15,.2)); }
  100% { filter: drop-shadow(calc(var(--lo-h) * -.0095) calc(var(--lo-h) * .014) calc(var(--lo-h) * .019) rgba(20,18,15,.2)); }
}
@media (prefers-reduced-motion: reduce) {
  .lo-shadow, .lo-letters { animation: none !important; }
}
`;

// Injected once per document, not per instance.
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.dataset.layerOffLogo = '';
  el.textContent = CSS;
  document.head.appendChild(el);
}

type Props = {
  /** Tailwind classes, expected to set the --lo-h custom property. */
  className?: string;
  duration?: number;
};

export function LayerOffLogo({ className = '', duration = LOGO_CYCLE_SECONDS }: Props) {
  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <span
      aria-label="LAYER OFF"
      role="img"
      className={`relative inline-block ${className}`}
      style={{
        width: 'calc(var(--lo-h) * 2.8136)',
        height: 'var(--lo-h)',
      }}
    >
      <span
        className="pointer-events-none absolute left-0 top-0 w-full"
        style={{ height: `calc(var(--lo-h) * ${(BOX_H / LETTERS_H).toFixed(4)})` }}
      >
        <img
          className="lo-shadow absolute"
          src={`${ASSETS}/mark-shadow.png`}
          alt=""
          style={{
            left: '4.82%',
            top: '42.05%',
            width: '92.57%',
            height: '57.95%',
            transformOrigin: '0% 0%',
            animation: `lo-shadow ${duration}s cubic-bezier(.45,.02,.28,1) infinite`,
            willChange: 'transform, filter, opacity',
          }}
        />
        <img
          className="lo-letters absolute left-0 top-0 w-full"
          src={`${ASSETS}/mark-letters.png`}
          alt=""
          style={{
            height: `${((LETTERS_H / BOX_H) * 100).toFixed(4)}%`,
            animation: `lo-letters ${duration}s cubic-bezier(.42,0,.3,1) infinite`,
          }}
        />
      </span>
    </span>
  );
}
