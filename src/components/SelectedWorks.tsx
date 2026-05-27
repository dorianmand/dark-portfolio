import { motion } from 'framer-motion';
import { projects } from '../data/content';
import { SectionHeader } from './SectionHeader';

export function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow="Selected Work" title="Featured" italic="projects" subtext="A selection of projects I've worked on, from concept to launch." action={<a className="gradient-border relative hidden rounded-full bg-surface px-6 py-3 text-sm text-text-primary md:inline-flex">View all work →</a>} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {projects.map((project, i) => (
            <motion.article key={project.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.08 }} viewport={{ once: true }} className={`${project.span} ${project.ratio} group relative overflow-hidden rounded-3xl border border-stroke bg-surface`}>
              <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="halftone absolute inset-0 opacity-20 mix-blend-multiply" />
              <div className="absolute inset-0 grid place-items-center bg-bg/70 opacity-0 backdrop-blur-lg transition duration-300 group-hover:opacity-100">
                <div className="gradient-border relative rounded-full bg-white px-5 py-2 text-sm text-bg">View — <span className="font-display italic">{project.title}</span></div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
