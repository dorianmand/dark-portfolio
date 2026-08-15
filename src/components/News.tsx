import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { TagList } from './TagFilter';

export function News() {
  const recent = articles.slice(0, 6);

  return (
    <section id="news" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="mb-12 flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">News</p>

          <Link
            to="/news"
            className="text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60"
          >
            All news →
          </Link>
        </div>

        <ul className="border-t border-stroke/20">
          {recent.map((entry, i) => (
            <motion.li
              key={entry.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              viewport={{ once: true }}
              className="border-b border-stroke/20"
            >
              <Link
                to={entry.url}
                className="group block py-6 transition-opacity hover:opacity-60"
              >
                <div className="flex items-baseline gap-6">
                  <h3 className="min-w-0 flex-1 text-lg leading-snug md:text-xl">
                    {entry.title}
                  </h3>

                  <span className="shrink-0 text-sm text-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  {entry.source && (
                    <span className="text-xs uppercase tracking-[0.15em] text-accent/80">
                      {entry.source}
                    </span>
                  )}
                  <TagList tags={entry.tags} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
