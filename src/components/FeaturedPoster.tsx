import { LocalizedLink as Link } from '../lib/language';
import { useT } from '../lib/i18n';
import { inline } from '../lib/markdown';
import type { Project } from '../data/projects';

type FeaturedPosterProps = {
  project: Project;
};

/**
 * The newest project gets a poster treatment above the regular grid on the
 * projects page: a large image that opens the live app directly — this is a
 * working deployment, not just a case study — with a quiet "Read more" link
 * to the written project page underneath.
 *
 * Only renders when the project has both an image and a demoUrl; there is
 * nothing to open otherwise, so it's used for a featured, live project, not
 * every entry.
 */
export function FeaturedPoster({ project }: FeaturedPosterProps) {
  const t = useT();
  const image = project.poster || project.cover;

  if (!image || !project.demoUrl) return null;

  return (
    <div className="mb-20">
      <a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — ${t('common.openDemo')}`}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="overflow-hidden">
          <img
            src={image}
            alt={project.title}
            className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        </div>
      </a>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg [&_a]:text-text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-opacity hover:[&_a]:opacity-60">
          {inline(project.summary, 'poster-summary')}
        </p>

        <Link
          to={`/projects/${project.slug}`}
          className="shrink-0 text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {t('common.readMore')} →
        </Link>
      </div>
    </div>
  );
}
