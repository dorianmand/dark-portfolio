import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayerOffLogo } from './LayerOffLogo';
import { LocalizedLink as Link, useLang, withLang, type Lang } from '../lib/language';
import { useT, type StringKey } from '../lib/i18n';

type NavItem =
  | { kind: 'anchor'; id: string; label: StringKey }
  | { kind: 'route'; to: string; label: StringKey };

/** Sections observed for the active-state highlight. */
const SECTIONS = ['contact'] as const;

const ITEMS: NavItem[] = [
  { kind: 'route', to: '/projects', label: 'nav.work' },
  { kind: 'route', to: '/profile', label: 'nav.profile' },
  { kind: 'route', to: '/research', label: 'nav.research' },
  { kind: 'anchor', id: 'contact', label: 'nav.contact' },
];

/**
 * The bar drops below the wordmark and climbs back to the level line on a
 * true 35-degree ramp. Running the incline the whole way from the left edge
 * instead would fix the depth to breakX * tan(35) — over 290px on a desktop
 * viewport, deep enough to cover the page headings. Keeping the drop flat
 * under the mark and ramping only at the end buys the real angle at a depth
 * the page can afford.
 */
const ANGLE = 35;
const RISE = 44;
/** Gap between the end of the wordmark and the top of the ramp. */
const BRAND_GAP = 10;
/** Clear space kept above and below the wordmark. */
const BRAND_PADDING = 12;
/**
 * Raises all three edges — the deep line, the ramp and the level line — by
 * the same amount, so the bar reads slimmer without altering its profile.
 * The mark keeps its size and is re-centred on the deep band instead.
 */
const BAR_LIFT = 40;

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [breakX, setBreakX] = useState(200);
  const [flatHeight, setFlatHeight] = useState(72);
  /** Sets the bar's height — the wordmark only, unaffected by the switcher. */
  const brandRef = useRef<HTMLAnchorElement | null>(null);
  /** Sets where the bar breaks: the ramp finishes just past the end of
   *  "Portfolio", so the deep band carries the mark and the word together,
   *  and the language switcher sits on the level line. */
  const breakRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lang = useLang();
  const t = useT();

  /**
   * Both numbers are measured rather than fixed, so they survive the web
   * font loading late and the smaller mark on narrow screens.
   */
  useLayoutEffect(() => {
    const brand = brandRef.current;
    const breakAt = breakRef.current;
    if (!brand || !breakAt) return;

    const measure = () => {
      const brandBox = brand.getBoundingClientRect();
      const breakBox = breakAt.getBoundingClientRect();
      setBreakX(Math.round(breakBox.right + BRAND_GAP));
      // The bar is sized by the wordmark rather than a fixed number, so the
      // smaller mark on narrow screens gives back the height it does not need.
      setFlatHeight(Math.round(brandBox.height + BRAND_PADDING * 2 - BAR_LIFT));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(brand);
    observer.observe(breakAt);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  /**
   * The deep left edge of the bar, published as a custom property so page
   * content can sit a fixed distance below the line it actually sees rather
   * than guessing at a padding value. It follows the wordmark, so it stays
   * correct at the smaller mobile size.
   */
  useEffect(() => {
    document.documentElement.style.setProperty('--nav-edge', `${flatHeight + RISE}px`);
  }, [flatHeight]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Highlights the section currently occupying the upper half of the viewport. */
  useEffect(() => {
    if (pathname !== '/') {
      setActive(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const go = (id: string) => {
    if (pathname !== '/' && pathname !== '/de') {
      navigate(`${withLang('/', lang)}#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const rise = RISE;
  const leftEdge = flatHeight + rise;
  /** Horizontal run the ramp needs to climb `rise` at ANGLE degrees. */
  const ramp = Math.round(rise / Math.tan((ANGLE * Math.PI) / 180));
  const rampStart = Math.max(0, breakX - ramp);

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed left-0 right-0 top-0 z-50"
      style={{ height: leftEdge }}
    >
      {/* Background panel, cut to the angled profile. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% ${flatHeight}px, ${breakX}px ${flatHeight}px, ${rampStart}px ${leftEdge}px, 0 ${leftEdge}px)`,
        }}
      />

      {/* The edge itself: incline under the wordmark, then level. */}
      <svg
        aria-hidden="true"
        width="100%"
        height={leftEdge}
        className="absolute inset-x-0 top-0"
        style={{ opacity: scrolled ? 1 : 0.45, transition: 'opacity 300ms' }}
      >
        <line
          x1="0"
          y1={leftEdge - 0.5}
          x2={rampStart}
          y2={leftEdge - 0.5}
          stroke="hsl(var(--stroke) / 0.28)"
          strokeWidth="1"
        />
        <line
          x1={rampStart}
          y1={leftEdge - 0.5}
          x2={breakX}
          y2={flatHeight - 0.5}
          stroke="hsl(var(--stroke) / 0.28)"
          strokeWidth="1"
        />
        <line
          x1={breakX}
          y1={flatHeight - 0.5}
          x2="100%"
          y2={flatHeight - 0.5}
          stroke="hsl(var(--stroke) / 0.28)"
          strokeWidth="1"
        />
      </svg>

      <div
        className="pointer-events-auto relative mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 md:px-10 lg:px-16"
        style={{ height: flatHeight }}
      >
        <div className="flex items-center">
          <Link
            ref={brandRef}
            to="/"
            className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {/*
              Animated LAYER wordmark with its cast OFF shadow swinging
              beneath it. See LayerOffLogo for the two-layer PNG + keyframe
              details.
            */}
            <span
              className="relative block"
              /* Centred on the deep band rather than the level line, so lifting
                 the bar does not push the mark off the top of the screen. */
              style={{ transform: `translateY(${rise / 2}px)` }}
            >
              <LayerOffLogo className="[--lo-h:38px] sm:[--lo-h:78px]" />
            </span>
            <span
              ref={breakRef}
              className="text-xs text-muted transition-colors group-hover:text-text-primary sm:text-sm"
            >
              {t('nav.portfolio')}
            </span>
          </Link>

          {/*
            Language switcher. Sized and cased like the "Berlin" label in the
            hero, not like the nav items — this is metadata about the page,
            not a destination. Each link crosses to the same route in the
            other language, using a plain (non-localized) Link deliberately.
          */}
          <div
            aria-label={t('lang.change')}
            className="ml-10 flex items-center gap-3 sm:ml-14"
          >
            {LANGUAGES.map((language) => (
              <a
                key={language.code}
                href={withLang(pathname, language.code)}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(withLang(pathname, language.code));
                }}
                aria-current={lang === language.code ? 'true' : undefined}
                aria-label={t(language.code === 'de' ? 'lang.toGerman' : 'lang.toEnglish')}
                className={`text-[11px] uppercase tracking-[0.28em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                  lang === language.code
                    ? 'text-text-primary'
                    : 'text-muted/80 hover:text-text-primary'
                }`}
              >
                {language.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-7">
          {ITEMS.map((item) =>
            item.kind === 'route' ? (
              <Link
                key={item.to}
                to={item.to}
                aria-current={pathname === withLang(item.to, lang) ? 'page' : undefined}
                className={`text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-sm ${
                  pathname === withLang(item.to, lang)
                    ? 'text-text-primary underline decoration-accent/70 underline-offset-8'
                    : 'text-muted hover:text-text-primary'
                }`}
              >
                {t(item.label)}
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-sm ${
                  active === item.id
                    ? 'text-text-primary underline decoration-accent/70 underline-offset-8'
                    : 'text-muted hover:text-text-primary'
                }`}
              >
                {t(item.label)}
              </button>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
