import { useEffect, useState } from 'react';

const links = ['News', 'Work', 'About'];

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

    const target =
      label === 'News'
        ? 'news'
        : label === 'Work'
          ? 'work'
          : label === 'About'
            ? 'stats'
            : 'contact';

    if (window.location.pathname !== '/') {
      window.location.href = `/?skipIntro=1#${target}`;
      return;
    }

    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goHome = () => {
    if (window.location.pathname !== '/') {
      window.location.href = '/?skipIntro=1';
      return;
    }

    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div className={`inline-flex items-center rounded-full border border-black/10 bg-white px-2 py-2 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-md shadow-black/10' : ''}`}>
        <button
          onClick={goHome}
          className="group grid h-9 w-9 place-items-center rounded-full accent-gradient p-[1px] transition-transform hover:scale-110 hover:accent-gradient-reverse"
        >
          <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[13px] italic">
            LO
          </span>
        </button>

        <div className="ml-6 mr-2 hidden h-5 w-px bg-stroke sm:block" />

        {links.map((link) => (
          <button
            key={link}
            onClick={() => go(link)}
            className={`rounded-full px-1 py-1.5 text-xs transition sm:px-4 sm:py-2 sm:text-sm ${active === link ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5 hover:text-black'}`}
          >
            {link}
          </button>
        ))}

        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        <button
          onClick={() => go('Contact')}
          className="relative rounded-full text-xs text-black sm:text-sm"
        >
          <span className="relative block rounded-full px-3 py-1.5 transition hover:bg-black/5 sm:px-4 sm:py-2">
            Contact ↗
          </span>
        </button>
      </div>
    </nav>
  );
}