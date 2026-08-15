import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { renderMarkdown } from '../lib/markdown';
import { getProject, metadataFields, projects } from '../data/projects';

export function ProjectPage() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[900px] px-6 py-40 md:px-10">
          <h1 className="mb-8 text-4xl tracking-tight md:text-5xl">
            Project not found
          </h1>
          <Link to="/projects" className="text-muted underline underline-offset-4">
            All projects
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-44 lg:px-16">
        <Link
          to="/projects"
          className="mb-14 inline-block text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60"
        >
          ← Projects
        </Link>

        <header className="border-b border-stroke/20 pb-14">
          <h1 className="max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
            {project.title}
          </h1>

          {project.summary && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {project.summary}
            </p>
          )}

          {project.demoUrl && (
            <div className="mt-10 border-t border-stroke/15 pt-6">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-3 text-lg tracking-tight underline underline-offset-8 transition-opacity hover:opacity-60"
              >
                Open the demo
                <span aria-hidden="true">↗</span>
              </a>

              {project.demoNote && (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                  {project.demoNote}
                </p>
              )}
            </div>
          )}
        </header>

        {project.cover && (
          <figure className="mt-14">
            <img
              src={project.cover}
              alt={project.title}
              className="w-full border border-stroke/10"
            />
          </figure>
        )}

        <div className="mt-16 grid gap-16 md:grid-cols-[minmax(0,1fr)_260px] md:gap-20">
          <article className="max-w-2xl text-base md:text-lg">
            {renderMarkdown(project.body)}
          </article>

          <aside className="md:sticky md:top-32 md:self-start">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
              Project
            </p>

            <dl className="border-t border-stroke/20">
              {metadataFields.map((field) => {
                const value = project[field.key];
                if (!value || typeof value !== 'string') return null;

                return (
                  <div
                    key={field.key}
                    className="border-b border-stroke/12 py-3"
                  >
                    <dt className="text-xs uppercase tracking-[0.15em] text-muted/70">
                      {field.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-text-primary">
                      {value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </aside>
        </div>

        {next && next.slug !== project.slug && (
          <div className="mt-28 border-t border-stroke/20 pt-10">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">
              Next project
            </p>

            <Link
              to={`/projects/${next.slug}`}
              className="group inline-flex items-baseline gap-4 text-3xl tracking-tight transition-opacity hover:opacity-60 md:text-4xl"
            >
              {next.title}
              <span className="text-base text-muted transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
