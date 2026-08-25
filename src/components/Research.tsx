import { LocalizedLink as Link } from '../lib/language';
import { useT } from '../lib/i18n';
import { AnimatedGridDivider } from './AnimatedGridDivider';

export type ResearchEntry = {
  n: string;
  kind: 'Reference survey' | 'Research note';
  /** Later: 'Independent research' | 'Reference library'. Not displayed yet. */
  group: 'reference-library' | 'independent-research';
  title: string;
  publisher: string;
  year: string;
  description: string;
  /**
   * The external publication the entry reads. Empty for my own notes, which
   * have no outside source, and for references whose source is unverified.
   */
  url: string;
  verified: boolean;
  /**
   * Filename in content/articles/ when I have written my own reading of the
   * source. Omit it and the entry is a credited outbound link only.
   */
  articleSlug?: string;
};

export const researchEntries: ResearchEntry[] = [
  {
    n: '01',
    kind: 'Research note',
    group: 'independent-research',
    title: 'AI in Architecture: From Image Generation to Intelligent Workflows',
    publisher: 'Dorian Mandzukic',
    year: '2026',
    description:
      'A framework for AI across the architectural workflow, from brief to construction. A working model for where AI can support the work without removing judgment, authorship or responsibility from the architect.',
    url: '',
    verified: true,
    articleSlug: 'ai-in-architecture-framework',
  },
  {
    n: '02',
    kind: 'Reference survey',
    group: 'reference-library',
    title: 'How AI is Reshaping Architectural Design & Visualization in 2026',
    publisher: 'Architizer + Chaos',
    year: '2026',
    description:
      'The follow-up survey, examining the relationship between AI, visualisation, design workflows and architectural practice. Nearly 800 respondents, fielded November 2025.',
    url: 'https://blog.chaos.com/the-state-of-ai-in-architecture-survey-insights',
    verified: true,
  },
  {
    n: '03',
    kind: 'Reference survey',
    group: 'reference-library',
    title: 'The State of AI in Architecture',
    publisher: 'Architizer + Chaos',
    year: '2024',
    description:
      'A reference survey on AI adoption, tools, workflows and practical concerns within architecture offices. 1,227 respondents across 118 countries.',
    url: 'https://blog.chaos.com/the-state-of-ai-in-architecture-new-insights-from-1200-architects',
    verified: true,
    articleSlug: 'state-of-ai-in-architecture-2024',
  },
];

export function Research() {
  const t = useT();

  return (
    <section
      id="research"
      aria-label="Research"
      className="relative isolate bg-bg py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <h2 className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">
          {t('label.research')}
        </h2>

        <p className="mb-14 max-w-2xl text-base leading-relaxed text-muted">
          Selected reports, surveys and references on AI in architectural
          practice, computational workflows and design decision-making.
        </p>

        <ul>
          {researchEntries.map((entry) => (
            <li
              key={entry.n}
              className="grid gap-2 py-6 md:grid-cols-12 md:gap-8"
            >
              <p className="text-xs tracking-[0.15em] text-accent/80 md:col-span-1">
                {entry.n} /
              </p>

              <div className="md:col-span-4">
                <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-muted/70">
                  {entry.kind}
                </p>

                <h3
                  className={`text-base leading-snug tracking-tight md:text-lg ${
                    entry.verified ? '' : 'text-muted'
                  }`}
                >
                  {entry.title}
                </h3>

                <p className="mt-1 text-xs tracking-[0.1em] text-accent/70">
                  {entry.publisher} · {entry.year}
                </p>
              </div>

              <div className="md:col-span-7">
                <p className="max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  {entry.description}
                </p>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-8 gap-y-2">
                  {entry.articleSlug && (
                    <Link
                      to={`/news/${entry.articleSlug}`}
                      className="text-sm text-text-primary underline decoration-accent/50 underline-offset-8 transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {t('common.readMyNotes')}{' '}
                      <span className="text-accent" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  )}

                  {/*
                    My own notes have no outside source, so nothing is shown
                    for them. A reference without a verified URL says so
                    rather than linking somewhere unchecked.
                  */}
                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm underline decoration-accent/50 underline-offset-8 transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                        entry.articleSlug ? 'text-muted' : 'text-text-primary'
                      }`}
                    >
                      {t('common.readSource')}{' '}
                      <span className="text-accent" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : (
                    entry.group === 'reference-library' && (
                      <p className="text-sm text-muted/60">
                        {t('common.readSource')}{' '}
                        <span className="text-accent/50" aria-hidden="true">
                          ↗
                        </span>
                        <span className="ml-2 text-xs">
                          {t('common.sourceUnverified')}
                        </span>
                      </p>
                    )
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <AnimatedGridDivider contained={false} />
      </div>
    </section>
  );
}
