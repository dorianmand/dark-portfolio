import { Link } from 'react-router-dom';

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dorian-mandzukic' },
  { name: 'Instagram', url: 'https://instagram.com/layeroff.ai' },
  { name: 'TikTok', url: 'https://tiktok.com/@layeroff.ai' },
];

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-bg pb-10 pt-24 md:pb-12 md:pt-32"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="border-t border-stroke/20 pt-12">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">
            Contact
          </p>

          <a
            href="mailto:hello@layeroff.ai"
            className="inline-block text-3xl tracking-tight transition-opacity hover:opacity-60 md:text-5xl"
          >
            hello@layeroff.ai
          </a>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
            Berlin. Open to conversations about computational design, AI in
            architectural practice, and the projects shown here.
          </p>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-stroke/20 pt-8 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-6 text-sm text-muted">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-text-primary"
              >
                {s.name}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <Link
              to="/impressum"
              className="transition hover:text-text-primary"
            >
              Impressum
            </Link>
            <span className="text-muted/40">·</span>
            © 2026 Dorian Mandzukic
            <span className="mx-2 text-muted/40">·</span>
            <span className="font-display italic">LayerOff</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
