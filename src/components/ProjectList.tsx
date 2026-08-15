import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { TagList } from './TagFilter';

export function ProjectList({ tag = null }: { tag?: string | null }) {
  const shown = tag ? projects.filter((p) => p.tags.includes(tag)) : projects;

  return (
    <ul className="border-t border-stroke/20">
      {shown.map((project, i) => (
        <motion.li
          key={project.slug}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.06 }}
          viewport={{ once: true }}
          className="border-b border-stroke/20"
        >
          <Link
            to={`/projects/${project.slug}`}
            className="group block py-8 transition-opacity hover:opacity-70 md:py-10"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
              <div className="w-full md:w-1/3">
                <h3 className="text-2xl tracking-tight md:text-3xl">
                  {project.title}
                </h3>

                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                  {project.type} · {project.year}
                </p>
              </div>

              <div className="w-full md:w-2/3">
                <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
                  {project.summary}
                </p>

                <div className="mt-3 flex items-baseline gap-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted/70">
                    {project.status}
                  </p>

                  <span className="text-sm text-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <div className="mt-4">
                  <TagList tags={project.tags} />
                </div>
              </div>
            </div>

            {project.cover && (
              <div className="mt-8 overflow-hidden border border-stroke/10">
                <img
                  src={project.cover}
                  alt={project.title}
                  loading="lazy"
                  className="w-full transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            )}
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
