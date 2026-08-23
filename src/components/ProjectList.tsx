import { motion } from 'framer-motion';
import { LocalizedLink as Link, useLang } from '../lib/language';
import { getProjects } from '../data/projects';
import { TagList } from './TagFilter';
import { AnimatedGridDivider } from './AnimatedGridDivider';

type ProjectListProps = {
  tag?: string | null;
  /**
   * 'list' is the stacked row used on the homepage. 'grid' is two per row for
   * the Work page, where the covers carry more of the browsing.
   */
  layout?: 'list' | 'grid';
  /** Slug to leave out — used when that project already has its own featured-poster treatment above this list. */
  excludeSlug?: string;
};

export function ProjectList({ tag = null, layout = 'list', excludeSlug }: ProjectListProps) {
  const lang = useLang();
  const projects = getProjects(lang);
  const filtered = tag ? projects.filter((p) => p.tags.includes(tag)) : projects;
  const shown = excludeSlug ? filtered.filter((p) => p.slug !== excludeSlug) : filtered;

  if (layout === 'grid') {
    return (
      <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
        {shown.map((project, i) => (
          <motion.li
            key={project.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/projects/${project.slug}`}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {project.cover && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.title}
                    loading="lazy"
                    className={`h-full w-full ${
                      project.coverFit === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                  />
                </div>
              )}

              <h3 className="mt-5 text-2xl tracking-tight transition-opacity group-hover:opacity-60 md:text-3xl">
                {project.title}
              </h3>

              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                {project.type} · {project.year}
              </p>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                {project.summary}
              </p>

              <div className="mt-4 flex items-baseline gap-4">
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
            </Link>
          </motion.li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <AnimatedGridDivider contained={false} />

      <ul>
        {shown.map((project, i) => (
          <motion.li
            key={project.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/projects/${project.slug}`}
              className="group block py-8 md:py-10"
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

              {/*
                The covers fill a fixed 16:9 frame. They are information boards
                rather than photographs, so the crop loses content at the edges —
                that is accepted here because the project page shows each cover
                uncropped at full width. The frame also reserves height before
                the lazy image arrives, which keeps the page from growing under
                an in-progress scroll to #research.
              */}
              {project.cover && (
                <div className="mt-8 aspect-[16/9] overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.title}
                    loading="lazy"
                    className={`h-full w-full ${
                        project.coverFit === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                  />
                </div>
              )}
            </Link>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
