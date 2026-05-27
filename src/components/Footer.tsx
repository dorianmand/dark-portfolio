import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HlsVideo } from './HlsVideo';
import { hlsSource } from '../data/content';

const socials = ['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'];

export function Footer() {
  const marquee = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marquee.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" className="relative overflow-hidden bg-bg pb-8 pt-16 md:pb-12 md:pt-20">
      <HlsVideo src={hlsSource} flipped className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-50" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 overflow-hidden whitespace-nowrap py-6">
        <div ref={marquee} className="inline-flex font-display text-6xl italic text-text-primary/10 md:text-9xl">
          {Array.from({ length: 20 }).map((_, i) => <span key={i} className="pr-6">BUILDING THE FUTURE • </span>)}
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Contact</p>
        <h2 className="mx-auto mb-8 max-w-3xl text-5xl tracking-tight md:text-7xl">Let’s build something <span className="font-display italic">alive</span>.</h2>
        <a href="mailto:hello@layeroff.ai" className="gradient-border relative inline-flex rounded-full bg-text-primary px-8 py-4 text-sm text-bg transition hover:bg-bg hover:text-text-primary">hello@layeroff.ai</a>
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-stroke pt-8 md:flex-row">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">{socials.map((s) => <a key={s} href="#" className="hover:text-text-primary">{s}</a>)}</div>
          <div className="flex items-center gap-3 text-sm text-muted"><span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" /></span>Available for projects</div>
        </div>
      </div>
    </footer>
  );
}
