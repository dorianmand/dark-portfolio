import { useT } from '../lib/i18n';
import { AnimatedGridDivider } from './AnimatedGridDivider';

const links = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dorian-mandzukic' },
  { name: 'Instagram', url: 'https://instagram.com/layeroff.ai' },
  { name: 'TikTok', url: 'https://tiktok.com/@layeroff.ai' },
];

export function Contact() {
  const t = useT();

  return (
    <section id="contact" aria-label="Contact" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <h2 className="mb-10 text-xs uppercase tracking-[0.3em] text-muted">
          {t('label.contact')}
        </h2>

        <AnimatedGridDivider contained={false} />

        <div>
          <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Based in Berlin. For general inquiries, computational design, AI in
            architectural practice or the projects shown here.
          </p>

          <a
            href="mailto:hello@layeroff.ai"
            className="mt-8 inline-block text-3xl tracking-tight transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-5xl"
          >
            hello@layeroff.ai
          </a>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
