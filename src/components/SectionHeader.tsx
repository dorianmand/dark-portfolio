import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function SectionHeader({ eyebrow, title, italic, subtext, action }: { eyebrow: string; title: string; italic: string; subtext: string; action?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-100px' }} className="mb-10 flex flex-col justify-between gap-8 md:mb-14 md:flex-row md:items-end">
      <div>
        <div className="mb-5 flex items-center gap-4"><span className="h-px w-8 bg-stroke" /><span className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</span></div>
        <h2 className="mb-4 text-4xl tracking-tight md:text-6xl">{title} <span className="font-display italic">{italic}</span></h2>
        <p className="max-w-lg text-sm text-muted md:text-base">{subtext}</p>
      </div>
      {action}
    </motion.div>
  );
}
