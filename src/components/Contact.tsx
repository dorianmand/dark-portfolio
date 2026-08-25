import { useT } from '../lib/i18n';
import { AnimatedGridDivider } from './AnimatedGridDivider';
import { ContactForm } from './ContactForm';

const links = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dorian-mandzukic' },
  { name: 'Instagram', url: 'https://instagram.com/layeroff.ai' },
  { name: 'TikTok', url: 'https://tiktok.com/@layeroff.ai' },
];

export function Contact() {
  const t = useT();

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative isolate bg-bg py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <h2 className="mb-10 text-xs uppercase tracking-[0.3em] text-muted">
          {t('label.contact')}
        </h2>

        <div>
          <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Based in Berlin. For general inquiries, computational design, AI in
            architectural practice or the projects shown here.
          </p>

          {/* The form carries the address as a plain mailto underneath, so the
              oversized email link is no longer needed here. */}
          <div className="mt-10">
            <ContactForm />
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
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

        <AnimatedGridDivider contained={false} />
      </div>
    </section>
  );
}
