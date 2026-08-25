import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { HeroAutomationLayer } from './HeroAutomationLayer';
import { AnimatedGridDivider } from './AnimatedGridDivider';

/**
 * Reads the OS "reduce motion" setting and keeps it current if the user
 * changes it while the page is open.
 */
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

type HeroProps = {
  /**
   * True while the intro sequence still owns the screen. The hero holds its
   * entry until the intro hands over, so the two do not animate at once — and
   * so the lines are not already in place when the site is revealed.
   */
  deferReveal?: boolean;
};

export function Hero({ deferReveal = false }: HeroProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (deferReveal) {
        gsap.set('.hero-line', { opacity: 0, y: 14 });
        return;
      }

      gsap.fromTo(
        '.hero-line',
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0 : 0.9,
          stagger: reducedMotion ? 0 : 0.1,
          ease: 'power2.out',
        },
      );
    });

    return () => ctx.revert();
  }, [reducedMotion, deferReveal]);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative isolate flex min-h-[85vh] items-start bg-bg pb-28 md:pb-32"
      /* Sits a measured 50px below the header's lower-left line rather than a
         guessed padding — --nav-edge is published by Navbar and tracks the
         wordmark, so the gap holds at the smaller mobile size too. */
      style={{ paddingTop: 'calc(var(--nav-edge, 106px) + 50px)' }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-y-10 md:grid-cols-12">
          <div className="md:col-span-8">
            {/*
              The wordmark in the header already says LayerOff, so the title is
              not repeated here. This sentence carries the h1 instead: the page
              still needs exactly one for the document outline, and it is the
              most descriptive line on it. Heading level is semantic, not a
              size — it keeps body weight so nothing reads as a second title.
            */}
            <h1 className="hero-line max-w-2xl text-base font-normal leading-relaxed text-text-primary md:text-lg">
              A portfolio of computational and AI projects for architectural
              practice.
            </h1>

            <div className="hero-line mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted md:text-lg">
              <p>
                LayerOff refers to a basic CAD operation: switching a layer off.
                The layer is not deleted; its information remains embedded in
                the drawing, temporarily withdrawn from view while continuing to
                organise the work.
              </p>

              <p>
                The name frames this portfolio’s focus on the operative
                structures behind architectural production: project information,
                workflow logic, rules, dependencies, decision paths and
                intermediate representations. These are the working layers that
                shape an architectural outcome but are often absent from its
                final presentation.
              </p>

              <p>
                The projects presented here examine how computational design and
                applied AI can make these structures more legible, reviewable
                and useful, without displacing architectural authorship or
                professional responsibility.
              </p>
            </div>

            {/* Signature. Keeps Dorian's name and role on the page even though
                the portfolio title now carries the headline. */}
            <div className="hero-line mt-8">
              <p className="text-base tracking-tight text-text-primary md:text-lg">
                Dorian Mandzukic
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                Architect <span className="text-muted/60">·</span> Computational
                Designer
              </p>
            </div>

          </div>

          <div className="md:col-span-4 md:justify-self-end md:text-right">
            <p className="hero-line text-[11px] uppercase tracking-[0.28em] text-muted/80">
              Berlin
            </p>
          </div>

          {/*
            Spans the whole grid rather than the text column, so the diagram
            runs the full width of the page — from the wordmark to the last
            nav item. Its small labels need that room.

            Pulled up 50px against the grid's row gap from md up, closing the
            space between the copy and the diagram it illustrates. Only from md:
            below that the grid is a single column and the same pull would drag
            the diagram over the "Berlin" line.
          */}
          <div className="hero-line mt-4 md:col-span-12 md:mt-[calc(1rem_-_50px)]">
            <HeroAutomationLayer hold={deferReveal} />
          </div>
        </div>

        {/* The hero's floor: the surface this section's content sits on. */}
        <AnimatedGridDivider contained={false} />
      </div>
    </section>
  );
}
