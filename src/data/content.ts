export type Project = {
  slug: string;
  title: string;
  kicker: string;
  status: string;
  field: 'Applied AI' | 'Computational design' | 'Architecture';
  year: string;
};

/**
 * Only projects with verified facts appear here.
 * Built architecture (Sakanela, Kurfürstenstraße 142) is held until the
 * originating offices have cleared publication — see docs/positioning.md §9.
 */
export const projects: Project[] = [
  {
    slug: 'compar',
    title: 'CompAr',
    kicker:
      'Translates architecture competition briefs into structured, validated design strategies.',
    status: 'Graduation project · phases 1–5 implemented',
    field: 'Applied AI',
    year: '2026',
  },
  {
    slug: 'design-copilot',
    title: 'Design Copilot',
    kicker:
      'Parametric building control in Grasshopper with rule-based design critique and environmental analysis.',
    status: 'Working prototype',
    field: 'Computational design',
    year: '2026',
  },
  {
    slug: 'formwerk',
    title: 'Formwerk',
    kicker:
      'A rule-based engine for German Bauantrag forms, with state-specific rule packages.',
    status: 'Berlin pilot · three official forms',
    field: 'Applied AI',
    year: '2026',
  },
];
