import { motion } from 'framer-motion';
import { journals } from '../data/content';
import { SectionHeader } from './SectionHeader';

export function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow="Journal" title="Recent" italic="thoughts" subtext="Notes on craft, systems, motion, and the small details that make digital work memorable." action={<a className="gradient-border relative hidden rounded-full bg-surface px-6 py-3 text-sm text-text-primary md:inline-flex">View all →</a>} />
        <div className="space-y-4">
          {journals.map((entry, i) => (
            <motion.a href="#" key={entry.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: i * 0.06 }} viewport={{ once: true }} className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition hover:bg-surface sm:rounded-full">
              <img src={entry.image} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover transition group-hover:scale-105" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base text-text-primary md:text-xl">{entry.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{entry.date}</p>
              </div>
              <div className="hidden text-sm text-muted sm:block">{entry.read}</div>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stroke/50 text-text-primary transition group-hover:translate-x-1">↗</div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
