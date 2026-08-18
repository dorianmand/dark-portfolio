import { createContext, forwardRef, useContext, useEffect, type ReactNode } from 'react';
import { useLocation, Link, type LinkProps } from 'react-router-dom';

export type Lang = 'en' | 'de';

const LangContext = createContext<Lang>('en');

/**
 * German pages live under a /de prefix — /de/projects, /de/projects/compar —
 * so a translated URL can be linked, bookmarked and eventually indexed on its
 * own. English keeps the unprefixed path. See App.tsx for the duplicated
 * route tree that makes this work.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang: Lang = pathname === '/de' || pathname.startsWith('/de/') ? 'de' : 'en';

  // Keeps <html lang> honest, which screen readers use to pick a voice and
  // browsers use to offer translation. index.html ships lang="en", so it has
  // to be updated on the client when a German route is showing.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Strips a leading /de from a path, so it can be re-prefixed for the other language. */
export function stripLangPrefix(pathname: string) {
  if (pathname === '/de') return '/';
  if (pathname.startsWith('/de/')) return pathname.slice(3);
  return pathname;
}

export function withLang(pathname: string, lang: Lang) {
  const bare = stripLangPrefix(pathname);
  if (lang === 'en') return bare;
  return bare === '/' ? '/de' : `/de${bare}`;
}

/**
 * A <Link> that stays in the current language automatically — `to="/projects"`
 * resolves to `/de/projects` when read on a German page. Use this instead of
 * react-router's Link for every in-site link; use plain Link only for the
 * language switcher itself, which deliberately crosses languages.
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function LocalizedLink({ to, ...props }, ref) {
    const lang = useLang();
    const target = typeof to === 'string' ? withLang(to, lang) : to;
    return <Link ref={ref} to={target} {...props} />;
  },
);
