import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProjectList } from '../components/ProjectList';
import { TagFilter } from '../components/TagFilter';
import { getProjectTags } from '../data/projects';
import { useLang } from '../lib/language';
import { useT } from '../lib/i18n';
import { useSeo } from '../lib/seo';

export function ProjectsIndexPage() {
  const [tag, setTag] = useState<string | null>(null);
  const t = useT();
  const lang = useLang();
  const projectTags = getProjectTags(lang);

  useSeo({
    title: t('page.work'),
    description:
      'Computational and AI systems built for architectural work, alongside projects delivered in practice.',
  });

  // Tags are themselves translated, so a filter picked in one language matches
  // nothing in the other. Clear it on switch rather than showing an empty grid.
  useEffect(() => {
    setTag(null);
  }, [lang]);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-52 lg:px-16">
        <h1 className="mb-6 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          {t('page.work')}
        </h1>

        <p className="mb-20 max-w-2xl text-lg leading-relaxed text-muted">
          Computational and AI systems built for architectural work, alongside
          projects delivered in practice.
        </p>

        <TagFilter tags={projectTags} active={tag} onChange={setTag} label={t('common.filterBy')} />

        <ProjectList tag={tag} layout="grid" />
      </main>

      <Footer />
    </>
  );
}
