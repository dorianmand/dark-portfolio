import { parseFrontmatter } from '../lib/markdown';

const projectModules = import.meta.glob('../../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

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
  demoUrl?: string;
  demoNote?: string;
  tags: string[];
  body: string;
};

/** Metadata rows shown on a project page, in order. Empty values are omitted. */
export const metadataFields: { label: string; key: keyof Project }[] = [
  { label: 'Year', key: 'year' },
  { label: 'Location', key: 'location' },
  { label: 'Type', key: 'type' },
  { label: 'Status', key: 'status' },
  { label: 'Role', key: 'role' },
  { label: 'Team', key: 'team' },
  { label: 'Tools', key: 'tools' },
];

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const fallbackSlug = path.split('/').pop()?.replace('.md', '') ?? '';

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
      demoUrl: data.demoUrl || undefined,
      demoNote: data.demoNote || undefined,
      tags: (data.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
      body,
    };
  })
  .sort((a, b) => a.order - b.order);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** Every tag used across the projects, alphabetical. */
export const projectTags = [
  ...new Set(projects.flatMap((project) => project.tags)),
].sort((a, b) => a.localeCompare(b));
