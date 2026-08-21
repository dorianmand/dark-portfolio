import { useT } from '../lib/i18n';
import { AnimatedGridDivider } from './AnimatedGridDivider';

const fields = [
  {
    n: '01',
    title: 'Architecture and design',
    body: 'Competitions, concept development, planning permission and construction documentation. Experience across HOAI phases 1–8, with the strongest delivery focus in phases 1–6.',
  },
  {
    n: '02',
    title: 'Project leadership and delivery',
    body: 'Client, authority and consultant coordination; design-team leadership; programme, cost and delivery coordination across complex architectural projects.',
  },
  {
    n: '03',
    title: 'BIM and digital coordination',
    body: 'Revit- and Archicad-based delivery, information coordination, documentation standards and workflows that support reliable collaboration across project teams.',
  },
  {
    n: '04',
    title: 'Computational design',
    body: 'Rhino, Grasshopper and Python. Parametric control, rule-based evaluation and geometry treated as structured data, connected to architectural criteria and design decisions.',
  },
  {
    n: '05',
    title: 'Applied AI and automation',
    body: 'Agent workflows, n8n, APIs, webhooks and structured document processing. Human-in-the-loop systems for analysis, coordination and decision support, with accountability remaining with the architect.',
  },
];

/** Deliberately quieter than the project cards — a numbered editorial list, not services. */
export function FieldsOfWork() {
  const t = useT();

  return (
    <div className="mx-auto mt-24 max-w-[1200px] px-6 md:mt-28 md:px-10 lg:px-16">
      <h3 className="mb-10 text-xs uppercase tracking-[0.3em] text-muted">
        {t('label.fieldsOfWork')}
      </h3>

      <AnimatedGridDivider contained={false} />

      <ul>
        {fields.map((field) => (
          <li
            key={field.n}
            className="grid gap-2 border-b border-stroke/15 py-6 md:grid-cols-12 md:gap-8"
          >
            <p className="text-xs tracking-[0.15em] text-accent/80 md:col-span-1">
              {field.n} /
            </p>

            <h4 className="text-base tracking-tight md:col-span-3 md:text-lg">
              {field.title}
            </h4>

            <p className="max-w-2xl text-sm leading-relaxed text-muted md:col-span-8 md:text-base">
              {field.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
