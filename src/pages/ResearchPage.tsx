import { LocalizedLink as Link } from '../lib/language';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { researchEntries } from '../components/Research';
import { useT } from '../lib/i18n';
import { useSeo } from '../lib/seo';

/**
 * The dedicated Research index. One entry per row, given the full column, so
 * each has room for its description and both links. The homepage keeps its
 * shorter Research section; this is where the nav points.
 */
export function ResearchPage() {
  const t = useT();

  useSeo({
    title: t('page.research'),
    description:
      'Selected reports, surveys and references on AI in architectural practice, computational workflows and design decision-making.',
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-52 lg:px-16">
        <h1 className="mb-6 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          {t('page.research')}
        </h1>

        <p className="mb-20 max-w-2xl text-lg leading-relaxed text-muted">
          Selected reports, surveys and references on AI in architectural
          practice, computational workflows and design decision-making.
        </p>

        <ul className="border-t border-stroke/20">
          {researchEntries.map((entry) => (
            <li key={entry.n} className="border-b border-stroke/20 py-10 md:py-14">
              <p className="mb-4 text-xs tracking-[0.15em] text-accent/80">
                {entry.n} /
              </p>

              <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted/70">
                {entry.kind}
              </p>

              <h2
                className={`max-w-3xl text-2xl leading-snug tracking-tight md:text-3xl ${
                  entry.verified ? '' : 'text-muted'
                }`}
              >
                {entry.title}
              </h2>

              <p className="mt-2 text-xs tracking-[0.1em] text-accent/70">
                {entry.publisher} · {entry.year}
              </p>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                {entry.description}
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2">
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
                  My own notes have no outside source, so nothing is shown for
                  them. A reference without a verified URL says so rather than
                  linking somewhere unchecked.
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
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </>
  );
}
