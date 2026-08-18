import { parseFrontmatter } from '../lib/markdown';
import type { StringKey } from '../lib/i18n';

const projectModules = import.meta.glob('../../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Files named with a leading underscore are templates and drafts, not pages. */
const isPublished = ([path]: [string, string]) =>
  !(path.split('/').pop() ?? '').startsWith('_');

/** compar.de.md is the German translation of compar.md, not a separate project. */
const isGerman = ([path]: [string, string]) =>
  (path.split('/').pop() ?? '').endsWith('.de.md');

export type Project = {
  slug: string;
  title: string;
  summary: string;
  group: string;
  order: number;
  year: string;
  location: string;
  type: string;
  status: string;
  role: string;
  team: string;
  tools: string;
  employer: string;
  cover?: string;
  /**
   * How the cover sits in the 16:9 card frame. 'cover' fills and crops, which
   * suits every board so far except Formwerk, whose crop cuts the bottom row.
   */
  coverFit: 'cover' | 'contain';
  /**
   * Optional wide banner used only by the featured-poster treatment on the
   * projects page (see FeaturedPoster). Falls back to `cover` when unset, so
   * a project doesn't need a second image just to be featured.
   */
  poster?: string;
  /**
   * Marks the project shown as the homepage's poster announcement. Separate
   * from `order` on purpose — `order` controls grid position everywhere
   * (including this project's own place in the projects-page grid), while
   * `featured` controls only which one project gets the homepage banner.
   */
  featured?: boolean;
  demoUrl?: string;
  demoNote?: string;
  tags: string[];
  body: string;
};

/**
 * Metadata rows shown on a project page, in order. Empty values are omitted.
 * `label` is an i18n key rather than literal text, so the row headings follow
 * the page language — see lib/i18n.
 */
export const metadataFields: { label: StringKey; key: keyof Project }[] = [
  { label: 'meta.year', key: 'year' },
  { label: 'meta.location', key: 'location' },
  { label: 'meta.type', key: 'type' },
  { label: 'meta.status', key: 'status' },
  { label: 'meta.role', key: 'role' },
  { label: 'meta.team', key: 'team' },
  { label: 'meta.tools', key: 'tools' },
];

function toProject(path: string, raw: string): Project {
  const { data, body } = parseFrontmatter(raw);
  const fallbackSlug = (path.split('/').pop() ?? '')
    .replace(/\.de\.md$/, '')
    .replace(/\.md$/, '');

  return {
    slug: data.slug || fallbackSlug,
    title: data.title ?? fallbackSlug,
    summary: data.summary ?? '',
    group: data.group ?? '',
    order: Number(data.order ?? 99),
    year: data.year ?? '',
    location: data.location ?? '',
    type: data.type ?? '',
    status: data.status ?? '',
    role: data.role ?? '',
    team: data.team ?? '',
    tools: data.tools ?? '',
    employer: data.employer ?? '',
    cover: data.cover,
    coverFit: (data.coverFit === 'contain' ? 'contain' : 'cover') as Project['coverFit'],
    poster: data.poster || undefined,
    featured: data.featured === 'true',
    demoUrl: data.demoUrl || undefined,
    demoNote: data.demoNote || undefined,
    tags: (data.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    body,
  };
}

const entries = Object.entries(projectModules).filter(isPublished);

export const projects: Project[] = entries
  .filter((entry) => !isGerman(entry))
  .map(([path, raw]) => toProject(path, raw))
  .sort((a, b) => a.order - b.order);

/** German translations, keyed by the same slug as their English original. Not every project has one yet. */
const projectsDe: Record<string, Project> = Object.fromEntries(
  entries
    .filter(isGerman)
    .map(([path, raw]) => toProject(path, raw))
    .map((project) => [project.slug, project]),
);

/**
 * Looks up a project by slug in the requested language. Falls back to the
 * English version silently when no translation exists yet — see CLAUDE.md
 * discussion with Dorian: an untranslated project should not look broken,
 * it should just read in English until the translation lands.
 */
export function getProject(slug: string, lang: 'en' | 'de' = 'en') {
  if (lang === 'de' && projectsDe[slug]) return projectsDe[slug];
  return projects.find((project) => project.slug === slug);
}

/** True when a German translation exists for this slug. */
export function hasTranslation(slug: string, lang: 'en' | 'de') {
  return lang !== 'de' || Boolean(projectsDe[slug]);
}

/**
 * The project list in a given language, in the same order. Listing pages must
 * use this rather than the `projects` export directly — otherwise the cards
 * show English type, summary, status and tags even on a German page, while
 * the project page behind them reads German.
 */
export function getProjects(lang: 'en' | 'de') {
  return projects.map((project) => getProject(project.slug, lang) ?? project);
}

/** Every tag used across the projects in that language, alphabetical. */
export function getProjectTags(lang: 'en' | 'de') {
  return [...new Set(getProjects(lang).flatMap((project) => project.tags))].sort(
    (a, b) => a.localeCompare(b, lang),
  );
}

/** Every tag used across the projects, alphabetical. */
export const projectTags = [
  ...new Set(projects.flatMap((project) => project.tags)),
].sort((a, b) => a.localeCompare(b));
