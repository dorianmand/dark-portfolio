const articleModules = import.meta.glob('../../articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function getSlugFromPath(path: string) {
  return path.split('/').pop()?.replace('.md', '') || '';
}

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

function getTitleFromMarkdown(content: string) {
  const clean = stripHtml(content);
  const heading = clean.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : 'Untitled Article';
}

function getExcerptFromMarkdown(content: string) {
  return stripHtml(content)
    .replace(/^#\s+.+$/m, '')
    .replace(/[#*_>`-]/g, '')
    .trim()
    .slice(0, 160);
}

export const articles = Object.entries(articleModules).map(([path, rawContent]) => {
  const slug = getSlugFromPath(path);
  const content = stripHtml(rawContent);
  const title = getTitleFromMarkdown(rawContent);

  return {
    slug,
    title,
    date: 'Jun 7, 2026',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=600&auto=format&fit=crop',
    url: `/articles/${slug}`,
    content,
    excerpt: getExcerptFromMarkdown(rawContent),
  };
});