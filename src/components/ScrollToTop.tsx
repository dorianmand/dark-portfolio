import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores scroll position on route change.
 *
 * Without a hash: back to the top.
 *
 * With a hash: aligns the matching section to the top of the viewport. This is
 * more work than one `scrollIntoView` because the project covers further down
 * the page load lazily and occupy no height until they arrive — a single
 * scroll aims at where the section sits on an image-less page and then the
 * covers push it thousands of pixels further down. So the alignment repeats
 * until the target stops moving, and gives up the moment the visitor takes
 * over by scrolling themselves.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }

    const id = hash.slice(1);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let attempts = 0;
    let stable = 0;
    let timer = 0;
    let stopped = false;

    const stop = () => {
      stopped = true;
      window.clearTimeout(timer);
      window.removeEventListener('wheel', handOver);
      window.removeEventListener('touchstart', handOver);
      window.removeEventListener('keydown', handOver);
    };

    /**
     * The visitor started scrolling. Stop correcting, and halt the smooth
     * scroll already in flight — cancelling the timer alone would let the
     * browser carry them to a destination they have just overridden.
     */
    const handOver = () => {
      if (stopped) return;
      stop();
      window.scrollTo({ top: window.scrollY, behavior: 'auto' });
    };

    const align = () => {
      if (stopped) return;

      const target = document.getElementById(id);

      // The route may not have painted yet.
      if (!target) {
        if (attempts++ > 20) return stop();
        timer = window.setTimeout(align, 50);
        return;
      }

      const offset = target.getBoundingClientRect().top;
      const first = attempts === 0;

      if (Math.abs(offset) <= 2) {
        // Three consecutive readings in place means the page has finished
        // growing underneath us.
        if (++stable >= 3) return stop();
      } else {
        stable = 0;
        window.scrollTo({
          top: window.scrollY + offset,
          behavior: first && !reduced ? 'smooth' : 'auto',
        });
      }

      if (attempts++ > 40) return stop();

      // Let the opening smooth scroll finish before correcting it.
      timer = window.setTimeout(align, first ? 700 : 120);
    };

    window.addEventListener('wheel', handOver, { passive: true });
    window.addEventListener('touchstart', handOver, { passive: true });
    window.addEventListener('keydown', handOver);

    align();

    return stop;
  }, [pathname, hash]);

  return null;
}
