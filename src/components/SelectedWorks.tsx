import { Link } from 'react-router-dom';
import { ProjectList } from './ProjectList';

export function SelectedWorks() {
  return (
    <section id="work" className="relative bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="mb-12 flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Selected work
          </p>

          <Link
            to="/projects"
            className="text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60"
          >
            All projects →
          </Link>
        </div>

        <ProjectList />
      </div>
    </section>
  );
}
