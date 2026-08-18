import { LocalizedLink as Link, useLang } from '../lib/language';
import { ProjectList } from './ProjectList';
import { FeaturedPoster } from './FeaturedPoster';
import { FieldsOfWork } from './FieldsOfWork';
import { useT } from '../lib/i18n';
import { getProjects } from '../data/projects';

export function SelectedWorks() {
  const t = useT();
  const lang = useLang();

  // Exactly one project can carry `featured: true` in its frontmatter — that
  // one gets the poster treatment above the homepage list, independent of
  // its grid position (see Project['featured'] in data/projects.ts).
  const featured = getProjects(lang).find((project) => project.featured);
  const showFeatured = Boolean(featured?.demoUrl);

  return (
    <section id="work" aria-label="Selected work" className="relative bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="mb-12 flex items-baseline justify-between gap-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted">
            {t('label.selectedWork')}
          </h2>

          <Link
            to="/projects"
            className="text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t('common.allProjects')} →
          </Link>
        </div>

        {featured && showFeatured && <FeaturedPoster project={featured} />}

        <ProjectList excludeSlug={featured && showFeatured ? featured.slug : undefined} />
      </div>

      <FieldsOfWork />
    </section>
  );
}
