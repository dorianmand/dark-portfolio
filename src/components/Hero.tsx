import { useEffect, useState } from 'react';
import gsap from 'gsap';

const roles = ['Creative', 'Design', 'AI', 'Research'];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 })
        .fromTo('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, delay: 0.3 }, '<');
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-24 text-center">
      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 mx-auto max-w-5xl pt-20">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-black/50">
          ARCHITECTURE & DESIGN * RESEARCH
        </p>

        <img
          src="/logo.png"
          alt="Layer_Off logo"
          className="blur-in mx-auto mb-10 h-100 w-auto"
        />

        <p className="blur-in mb-5 text-lg text-black/80 md:text-2xl">
          <span key={roleIndex} className="inline-block animate-role-fade-in font-display italic text-black">
            {roles[roleIndex]}
          </span>{' '}
          studio in Berlin.
        </p>

        <p className="blur-in mx-auto mb-12 max-w-md text-sm text-black/70 md:text-base">
          Layer_off explores the invisible intelligence behind structures, systems and everyday workflows.
        </p>

        <div className="blur-in inline-flex flex-col gap-4 sm:flex-row">
          <a
            href="#work"
            className="gradient-border relative rounded-full bg-black px-7 py-3.5 text-sm text-white transition hover:scale-105 hover:bg-bg hover:text-text-primary"
          >
            See Works
          </a>

          <a
            href="mailto:hello@layeroff.ai"
            className="gradient-border relative rounded-full border-2 border-black/20 bg-white px-7 py-3.5 text-sm text-black transition hover:scale-105 hover:border-transparent"
          >
            Reach out
          </a>
        </div>

        <div className="blur-in mt-14 text-center md:mt-20">
          <div className="mb-4 text-xs uppercase tracking-[0.35em] text-muted">
            SCROLL
          </div>

          <div className="mx-auto h-14 w-px overflow-hidden bg-stroke">
            <div className="h-1/2 w-full animate-scroll-down bg-text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}