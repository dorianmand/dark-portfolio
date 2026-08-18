#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the same content/ files that drive the
 * site's routing (content/projects/*.md, content/articles/*.md). Runs before
 * `vite build` (see package.json "build" script) so the sitemap can never go
 * stale relative to what's actually published — no hand-maintained URL list.
 *
 * Static pages (/, /projects, /research, /profile, /impressum) are listed in
 * English only. Their /de/* counterparts render mostly-English content in
 * German chrome today (see App.tsx's routing comment) and are deliberately
 * left out until the UI-string translation lands — listing them now would
 * tell Google they're distinct pages when they're currently near-duplicates
 * of the English ones.
 *
 * Project and article pages DO have real per-page German content when a
 * `<slug>.de.md` file exists, so those get both an English and a German URL,
 * cross-linked with hreflang alternates.
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE = 'https://layeroff.ai';

const STATIC_PATHS = ['', 'projects', 'research', 'profile', 'impressum'];

/** Reads content/<dir>/*.md and returns English slugs, flagging which have a `<slug>.de.md` translation. */
function slugsWithTranslations(dir) {
  const files = readdirSync(join(root, 'content', dir)).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_'),
  );
  const deSlugs = new Set(
    files.filter((f) => f.endsWith('.de.md')).map((f) => f.replace(/\.de\.md$/, '')),
  );
  return files
    .filter((f) => !f.endsWith('.de.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .map((slug) => ({ slug, hasDe: deSlugs.has(slug) }));
}

const dynamicRoutes = [
  ...slugsWithTranslations('projects').map((p) => ({ ...p, prefix: 'projects' })),
  ...slugsWithTranslations('articles').map((a) => ({ ...a, prefix: 'news' })),
];

/**
 * One <url> block for `loc`, optionally cross-linked to `altLoc` (the other
 * language's URL for the same content) via hreflang alternates.
 */
function urlBlock(loc, altLoc, altLang) {
  const lines = [`  <url>`, `    <loc>${loc}</loc>`];
  if (altLoc) {
    const thisLang = altLang === 'de' ? 'en' : 'de';
    lines.push(`    <xhtml:link rel="alternate" hreflang="${thisLang}" href="${loc}" />`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altLoc}" />`);
  }
  lines.push(`  </url>`);
  return lines.join('\n');
}

const entries = [];

for (const path of STATIC_PATHS) {
  const loc = path === '' ? `${SITE}/` : `${SITE}/${path}`;
  entries.push(urlBlock(loc, null, null));
}

for (const { slug, hasDe, prefix } of dynamicRoutes) {
  const path = `${prefix}/${slug}`;
  const enLoc = `${SITE}/${path}`;
  const deLoc = `${SITE}/de/${path}`;
  entries.push(urlBlock(enLoc, hasDe ? deLoc : null, 'de'));
  if (hasDe) entries.push(urlBlock(deLoc, enLoc, 'en'));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;

writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(`sitemap.xml written with ${entries.length} URL entries`);
