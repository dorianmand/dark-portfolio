import { parseFrontmatter } from '../lib/markdown';

const articleModules = import.meta.glob('../../articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export type Article = {
  slug: string;
  title: string;
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

export const articles: Article[] = Object.entries(articleModules).map(
  ([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const slug = path.split('/').pop()?.replace('.md', '') ?? '';

    return {
      slug,
      title: data.title || titleFrom(body),
      url: `/news/${slug}`,
      content: stripHtml(body),
      excerpt: excerptFrom(body),
      source: data.source || undefined,
      sourceUrl: data.sourceUrl || undefined,
      date: data.date || undefined,
      tags: splitTags(data.tags),
    };
  },
);

/** Every tag used across the articles, alphabetical. */
export const articleTags = [
  ...new Set(articles.flatMap((article) => article.tags)),
].sort((a, b) => a.localeCompare(b));
