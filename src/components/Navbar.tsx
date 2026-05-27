import { useEffect, useState } from 'react';

const links = ['Home', 'Work', 'Resume'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (label: string) => {
    setActive(label);
    const target = label === 'Home' ? 'hero' : label === 'Work' ? 'work' : 'contact';
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-md shadow-black/10' : ''}`}>
        <button onClick={() => go('Home')} className="group grid h-9 w-9 place-items-center rounded-full accent-gradient p-[1px] transition-transform hover:scale-110 hover:accent-gradient-reverse">
          <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[13px] italic">LO</span>
        </button>
        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
        {links.map((link) => <button key={link} onClick={() => go(link)} className={`rounded-full px-3 py-1.5 text-xs transition sm:px-4 sm:py-2 sm:text-sm ${active === link ? 'bg-stroke/50 text-text-primary' : 'text-muted hover:bg-stroke/50 hover:text-text-primary'}`}>{link}</button>)}
        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
        <a href="mailto:hello@layeroff.ai" className="gradient-border relative rounded-full text-xs text-text-primary sm:text-sm"><span className="relative block rounded-full bg-surface px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2">Say hi ↗</span></a>
      </div>
    </nav>
  );
}
