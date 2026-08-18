import { LocalizedLink as Link } from '../lib/language';

export function Footer() {
  return (
    <footer className="bg-bg pb-10 pt-10">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-stroke/15 pt-6 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} Dorian Mandzukic{' '}
            <span className="mx-1 text-muted/40">·</span>
            <span className="font-display italic">LayerOff</span>{' '}
            <span className="font-display italic">Portfolio</span>
          </p>

          <Link
            to="/impressum"
            className="transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
}
