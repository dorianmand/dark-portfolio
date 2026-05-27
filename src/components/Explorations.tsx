import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { explorations } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

export function Explorations() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !contentRef.current) return;
      ScrollTrigger.create({ trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', pin: contentRef.current, pinSpacing: false });
      gsap.utils.toArray<HTMLElement>('.parallax-card').forEach((card, i) => {
        gsap.fromTo(card, { y: i % 2 ? 220 : 40 }, { y: i % 2 ? -360 : -180, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] overflow-hidden bg-bg">
      <div ref={contentRef} className="relative z-10 flex h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Explorations</p>
          <h2 className="mb-5 text-5xl tracking-tight md:text-7xl">Visual <span className="font-display italic">playground</span></h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-muted md:text-base">Loose studies, experiments, and visual sparks collected between client launches.</p>
          <a className="gradient-border relative inline-flex rounded-full bg-surface px-7 py-3.5 text-sm text-text-primary" href="#">Dribbble →</a>
        </div>
      </div>
      <div className="absolute inset-0 z-20 mx-auto grid max-w-[1400px] grid-cols-2 gap-12 px-8 py-[35vh] md:gap-40 md:px-20">
        <div className="space-y-36 pt-40">
          {explorations.filter((_, i) => i % 2 === 0).map((img, i) => <GalleryCard key={img} img={img} rotation={i % 2 ? 5 : -6} onClick={() => setActive(img)} />)}
        </div>
        <div className="space-y-36 pt-10">
          {explorations.filter((_, i) => i % 2 === 1).map((img, i) => <GalleryCard key={img} img={img} rotation={i % 2 ? -4 : 7} onClick={() => setActive(img)} />)}
        </div>
      </div>
      {active && <button onClick={() => setActive(null)} className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-6 backdrop-blur-sm"><img src={active} alt="Exploration preview" className="max-h-[85vh] max-w-[90vw] rounded-3xl object-contain" /></button>}
    </section>
  );
}

function GalleryCard({ img, rotation, onClick }: { img: string; rotation: number; onClick: () => void }) {
  return <button onClick={onClick} className="parallax-card aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-black/40 transition hover:scale-105" style={{ rotate: `${rotation}deg` }}><img src={img} alt="Exploration" className="h-full w-full object-cover" /></button>;
}
