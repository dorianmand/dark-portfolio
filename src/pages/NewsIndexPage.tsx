import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TagFilter, TagList } from '../components/TagFilter';
import { articles, articleTags } from '../data/articles';

export function NewsIndexPage() {
  const [tag, setTag] = useState<string | null>(null);

  const shown = useMemo(
    () => (tag ? articles.filter((a) => a.tags.includes(tag)) : articles),
    [tag],
  );

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <h1 className="mb-6 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          News
        </h1>

        <p className="mb-16 max-w-2xl text-lg leading-relaxed text-muted">
          Architecture and technology worth reading, with the original source
          credited on every piece.
        </p>

        <TagFilter tags={articleTags} active={tag} onChange={setTag} label="Topics" />

        <ul className="border-t border-stroke/20">
          {shown.map((article) => (
            <li key={article.slug} className="border-b border-stroke/20">
              <Link
                to={article.url}
                className="group block py-6 transition-opacity hover:opacity-60"
              >
                <div className="flex items-baseline gap-6">
                  <h2 className="min-w-0 flex-1 text-lg leading-snug md:text-xl">
                    {article.title}
                  </h2>
                  <span className="shrink-0 text-sm text-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  {article.source && (
                    <span className="text-xs uppercase tracking-[0.15em] text-accent/80">
                      {article.source}
                    </span>
                  )}
                  <TagList tags={article.tags} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {!shown.length && (
          <p className="py-10 text-muted">Nothing tagged “{tag}” yet.</p>
        )}
      </main>

      <Footer />
    </>
  );
}
