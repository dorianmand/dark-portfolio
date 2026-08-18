import { parseFrontmatter } from '../lib/markdown';

const articleModules = import.meta.glob('../../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Files named with a leading underscore are templates and drafts, not pages. */
const isPublished = ([path]: [string, string]) =>
  !(path.split('/').pop() ?? '').startsWith('_');

/** ai-in-architecture-framework.de.md is the German translation, not a separate article. */
const isGerman = ([path]: [string, string]) =>
  (path.split('/').pop() ?? '').endsWith('.de.md');

export type Article = {
  slug: string;
  title: string;
  subtitle?: string;
  url: string;
  content: string;
  excerpt: string;
  /** Where the piece was originally published. Always credited when present. */
  source?: string;
  sourceUrl?: string;
  date?: string;
  tags: string[];
};

function stripHtml(content: string) {
  return content
    .replace(/<h1>/g, '# ')
    .replace(/<\/h1>/g, '')
    .replace(/<h2>/g, '## ')
    .replace(/<\/h2>/g, '')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .trim();
}

function titleFrom(body: string) {
  const heading = stripHtml(body).match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : 'Untitled';
}

function excerptFrom(body: string) {
  return stripHtml(body)
    .replace(/^#\s+.+$/m, '')
    .replace(/[#*_>`-]/g, '')
    .trim()
    .slice(0, 160);
}

const splitTags = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

function toArticle(path: string, raw: string): Article {
  const { data, body } = parseFrontmatter(raw);
  const slug = (path.split('/').pop() ?? '').replace(/\.de\.md$/, '').replace(/\.md$/, '');

  return {
    slug,
    title: data.title || titleFrom(body),
    subtitle: data.subtitle || undefined,
    url: `/news/${slug}`,
    content: stripHtml(body),
    excerpt: excerptFrom(body),
    source: data.source || undefined,
    sourceUrl: data.sourceUrl || undefined,
    date: data.date || undefined,
    tags: splitTags(data.tags),
  };
}

const entries = Object.entries(articleModules).filter(isPublished);

export const articles: Article[] = entries
  .filter((entry) => !isGerman(entry))
  .map(([path, raw]) => toArticle(path, raw));

/** German translations, keyed by the same slug as their English original. Not every article has one yet. */
const articlesDe: Record<string, Article> = Object.fromEntries(
  entries
    .filter(isGerman)
    .map(([path, raw]) => toArticle(path, raw))
    .map((article) => [article.slug, article]),
);

/**
 * Falls back to the English version silently when no translation exists yet
 * — an untranslated article should read in English, not look broken.
 */
export function getArticle(slug: string, lang: 'en' | 'de' = 'en') {
  if (lang === 'de' && articlesDe[slug]) return articlesDe[slug];
  return articles.find((article) => article.slug === slug);
}

export function hasArticleTranslation(slug: string, lang: 'en' | 'de') {
  return lang !== 'de' || Boolean(articlesDe[slug]);
}

/** Every tag used across the articles, alphabetical. */
export const articleTags = [
  ...new Set(articles.flatMap((article) => article.tags)),
].sort((a, b) => a.localeCompare(b));
