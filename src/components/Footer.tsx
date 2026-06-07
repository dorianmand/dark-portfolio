import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const socials = [
  { name: 'LinkedIn', url: '#' },
  { name: 'Instagram', url: 'https://instagram.com/layeroff.ai' },
  { name: 'TikTok', url: 'https://tiktok.com/@layeroff.ai' },
  { name: 'GitHub', url: '#' },
];

export function Footer() {
  const marquee = useRef<HTMLDivElement | null>(null);
  const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');
const sendEmail = () => {
  window.location.href = `mailto:hello@layeroff.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
};
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marquee.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" className="relative overflow-hidden bg-white pb-8 pt-16 md:pb-12 md:pt-20">
      <div className="hidden relative z-10 overflow-hidden whitespace-nowrap py-6">
        <div ref={marquee} className="inline-flex font-display text-6xl italic text-text-primary/10 md:text-9xl">
          {Array.from({ length: 20 }).map((_, i) => <span key={i} className="pr-6">BUILDING THE FUTURE • </span>)}
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Contact</p>
        <h2 className="mx-auto mb-8 max-w-3xl text-5xl tracking-tight md:text-7xl">Let’s build something <span className="font-display italic">alive</span>.</h2>
        <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4">
  <input
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    placeholder="Subject"
    className="rounded-full border border-black bg-white px-5 py-3 text-sm text-black outline-none placeholder:text-black/40"
  />

  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Message"
    rows={5}
    className="resize-none rounded-3xl border border-black bg-white px-5 py-4 text-sm text-black outline-none placeholder:text-black/40"
  />

  <button
    onClick={sendEmail}
    className="rounded-full border border-black bg-transparent px-7 py-3.5 text-sm text-black transition hover:scale-105"
  >
    Send message
  </button>
</div>
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-stroke pt-8 md:flex-row">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">
  {socials.map((s) => (
    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition">
      {s.name}
    </a>
  ))}</div>
          <div className="flex items-center gap-3 text-sm text-muted"><span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" /></span>Available for projects</div>
        </div>
      </div>
    </footer>
  );
}
