import { motion } from 'framer-motion';

const stats = [
  ['20+', 'Years Experience'],
  ['95+', 'Projects Done'],
  ['200%', 'Satisfied Clients'],
];

export function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-6 md:grid-cols-3 md:px-10 lg:px-16">
        {stats.map(([value, label], i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.08 }} viewport={{ once: true }} className="rounded-3xl border border-stroke bg-surface/50 p-8 text-center">
            <div className="mb-2 font-display text-6xl italic text-text-primary md:text-7xl">{value}</div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
