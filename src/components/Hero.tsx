import { useEffect } from 'react';
import gsap from 'gsap';

export function Hero() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] items-center bg-bg px-6 py-32 md:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="hero-line mb-10 text-xs uppercase tracking-[0.3em] text-muted">
          Berlin
        </p>

        <h1 className="hero-line max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Dorian Mandzukic
        </h1>

        <p className="hero-line mt-5 text-lg text-muted md:text-2xl">
          Architect <span className="text-muted/50">·</span> Computational Designer
        </p>

        <div className="hero-line mt-16 max-w-2xl space-y-5 text-base leading-relaxed text-muted md:text-lg">
          <p>
            I am an architect with thirteen years of practice across HOAI phases
            1–6, most recently as office director at Wiel Arets Architects and
            senior architect at Graft. I build computational and AI systems for
            the parts of that work I know from the inside: competition strategy,
            parametric design control, and building permit documentation.
          </p>

          <p className="text-text-primary">
            These are not products. They are instruments for testing how far
            software can support architectural judgment without replacing it.
          </p>
        </div>
      </div>
    </section>
  );
}
