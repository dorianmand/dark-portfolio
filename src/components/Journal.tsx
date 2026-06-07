import { motion } from 'framer-motion';
import { articles } from '../data/articles';
import { SectionHeader } from './SectionHeader';

export function Journal() {
  return (
    <section id="news" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="News"
          title="Recent"
          italic="news"
          subtext="On the topics of architecture, urban design, AI technology and the invisible systems shaping the built environment."
          action={
            <a className="gradient-border relative hidden rounded-full bg-black px-6 py-3 text-sm text-white md:inline-flex">
              View all →
            </a>
          }
        />

        <div className="space-y-4">
          {articles.map((entry, i) => (
            <motion.a
              href={entry.url}
              key={entry.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: i * 0.06 }}
              viewport={{ once: true }}
              className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-black/5 p-4 transition hover:bg-black/10 sm:rounded-full"
            >
              <img
                src={entry.image}
                alt=""
                className="h-20 w-20 shrink-0 rounded-full object-cover transition group-hover:scale-105"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base text-text-primary md:text-xl">
                  {entry.title}
                </h3>

                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {entry.date}
                </p>
              </div>

              <div className="hidden text-sm text-muted sm:block">
                {entry.read}
              </div>

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-transparent text-black transition group-hover:translate-x-1">
                ↗
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}