import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'https://layeroff.ai';
const SUFFIX = ' | Dorian Mandzukic';

type SeoInput = {
  title: string;
  description: string;
  /** Set true on pages reached by an invalid URL (e.g. NotFoundPage) so search engines don't index the shell. */
  noindex?: boolean;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets document.title and the meta description / canonical / OG / Twitter
 * tags for the current route, replacing the fixed homepage-only values
 * index.html ships as the pre-hydration fallback.
 *
 * Every page must call this with its own real title and description — see
 * fix-seo-indexing project memory. This is why every route reported the
 * homepage as canonical: nothing overwrote index.html's hardcoded tags. The
 * Phase 2 prerender step (Playwright) captures the DOM after this runs, so
 * these become the values search engines and social previews actually see.
 */
export function useSeo({ title, description, noindex }: SeoInput) {
  const { pathname } = useLocation();
  const canonical = `${SITE}${pathname === '/' ? '/' : pathname}`;
  const fullTitle = title.endsWith(SUFFIX) ? title : `${title}${SUFFIX}`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);

    const robotsSelector = 'meta[name="robots"]';
    const existingRobots = document.head.querySelector<HTMLMetaElement>(robotsSelector);
    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, follow');
    } else if (existingRobots) {
      existingRobots.remove();
    }
  }, [fullTitle, description, canonical, noindex]);
}
