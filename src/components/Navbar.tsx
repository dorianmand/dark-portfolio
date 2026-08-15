import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type NavLink = { label: string; to?: string; anchor?: string };

/** Order set by Dorian, 15 Aug 2026: Profile · News · Work · About · Contact. */
const links: NavLink[] = [
  { label: 'Profile', anchor: 'profile' },
  { label: 'News', to: '/news' },
  { label: 'Work', to: '/projects' },
  { label: 'About', anchor: 'about' },
  { label: 'Contact', anchor: 'contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToAnchor = (anchor: string) => {
    if (pathname !== '/') {
      navigate(`/#${anchor}`);
      return;
    }

    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 bg-bg/90 backdrop-blur-sm transition-colors ${
        scrolled ? 'border-b border-stroke/15' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 md:px-10 lg:px-16">
        <Link
          to="/"
          className="text-sm tracking-tight transition-opacity hover:opacity-60"
        >
          Dorian Mandzukic
        </Link>

        <div className="flex items-center gap-4 sm:gap-7">
          {links.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs text-muted transition-colors hover:text-text-primary sm:text-sm"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={() => goToAnchor(link.anchor!)}
                className="text-xs text-muted transition-colors hover:text-text-primary sm:text-sm"
              >
                {link.label}
              </button>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
