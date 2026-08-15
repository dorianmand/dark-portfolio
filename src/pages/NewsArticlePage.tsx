import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TagList } from '../components/TagFilter';
import { renderMarkdown } from '../lib/markdown';
import { articles } from '../data/articles';

export function NewsArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[900px] px-6 py-40 md:px-10">
          <h1 className="mb-8 text-4xl tracking-tight md:text-5xl">
            Article not found
          </h1>
          <Link to="/news" className="text-muted underline underline-offset-4">
            All news
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[760px] px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <Link
          to="/news"
          className="mb-12 inline-block text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60"
        >
          ← News
        </Link>

        <h1 className="mb-6 text-4xl leading-[1.1] tracking-tight md:text-5xl">
          {article.title}
        </h1>

        <div className="mb-14 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-b border-stroke/20 pb-8">
          {article.date && (
            <span className="text-sm text-muted">{article.date}</span>
          )}
          <TagList tags={article.tags} />
        </div>

        <article className="text-base md:text-lg">
          {renderMarkdown(article.content.replace(/^#\s+.+$/m, ''))}
        </article>

        {article.sourceUrl && (
          <div className="mt-16 border-t border-stroke/20 pt-8">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">
              Source
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
              Summarised from the original publication. All project credits
              belong to the architects and the publisher.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
