import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProjectList } from '../components/ProjectList';
import { TagFilter } from '../components/TagFilter';
import { projectTags } from '../data/projects';

export function ProjectsIndexPage() {
  const [tag, setTag] = useState<string | null>(null);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-44 lg:px-16">
        <h1 className="mb-6 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Projects
        </h1>

        <p className="mb-20 max-w-2xl text-lg leading-relaxed text-muted">
          Computational and AI systems built for architectural work, alongside
          projects delivered in practice.
        </p>

        <TagFilter tags={projectTags} active={tag} onChange={setTag} label="Filter by" />

        <ProjectList tag={tag} />
      </main>

      <Footer />
    </>
  );
}
