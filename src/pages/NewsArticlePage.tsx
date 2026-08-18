import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TagList } from '../components/TagFilter';
import { renderMarkdown } from '../lib/markdown';
import { getArticle } from '../data/articles';
import { LocalizedLink as Link, useLang } from '../lib/language';
import { useT } from '../lib/i18n';
import { useSeo } from '../lib/seo';

export function NewsArticlePage() {
  const { slug } = useParams();
  const lang = useLang();
  const t = useT();
  const article = getArticle(slug ?? '', lang);

  useSeo({
    title: article ? article.title : t('error.articleNotFound'),
    description: article?.excerpt || 'This article could not be found.',
    noindex: !article,
  });

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[900px] px-6 py-40 md:px-10">
          <h1 className="mb-8 text-4xl tracking-tight md:text-5xl">
            {t('error.articleNotFound')}
          </h1>
          <Link
            to="/research"
            className="text-muted underline underline-offset-4"
          >
            {t('error.allResearch')}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Same container as the navbar, so the column runs from the wordmark
          to the last nav item rather than sitting inside it. */}
      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-52 lg:px-16">
        <Link
          to="/research"
          className="mb-12 inline-block text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60"
        >
          {t('common.backResearch')}
        </Link>

        <div>
        <h1 className="mb-4 max-w-4xl text-4xl leading-[1.1] tracking-tight md:text-5xl">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="mb-6 text-lg leading-snug text-muted md:text-xl">
            {article.subtitle}
          </p>
        )}

        <div className="mb-14 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-b border-stroke/20 pb-8">
          {article.date && (
            <span className="text-sm text-muted">{article.date}</span>
          )}
          <TagList tags={article.tags} />
        </div>
        </div>

        <article className="text-base md:text-lg">
          {renderMarkdown(article.content.replace(/^#\s+.+$/m, ''))}
        </article>

        {article.sourceUrl && (
          <div className="mt-16 border-t border-stroke/20 pt-8">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">
              {t('article.source')}
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg underline underline-offset-8 transition-opacity hover:opacity-60"
            >
              {article.source ?? article.sourceUrl} ↗
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The figures above are the publisher’s. The reading of them is
              mine.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
