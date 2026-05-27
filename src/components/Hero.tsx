import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { HlsVideo } from './HlsVideo';
import { hlsSource } from '../data/content';

const roles = ['creative', 'design', 'AI', 'reserach'];

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
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <HlsVideo src={hlsSource} className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      <div className="relative z-10 mx-auto max-w-5xl pt-20">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">DESIGN * RESERCH</p>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">Layer Off</h1>
        <p className="blur-in mb-5 text-lg text-text-primary/90 md:text-2xl">A <span key={roleIndex} className="inline-block animate-role-fade-in font-display italic text-text-primary">{roles[roleIndex]}</span> studio in Berlin.</p>
        <p className="blur-in mx-auto mb-12 max-w-md text-sm text-muted md:text-base">Shaping workflows at the intersection of architecture, technology and sustainability.</p>
        <div className="blur-in inline-flex flex-col gap-4 sm:flex-row">
          <a href="#work" className="gradient-border relative rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg transition hover:scale-105 hover:bg-bg hover:text-text-primary">See Works</a>
          <a href="mailto:hello@layeroff.ai" className="gradient-border relative rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm text-text-primary transition hover:scale-105 hover:border-transparent">Reach out...</a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">SCROLL</div>
        <div className="mx-auto h-10 w-px overflow-hidden bg-stroke"><div className="h-1/2 w-full animate-scroll-down bg-text-primary" /></div>
      </div>
    </section>
  );
}
