import { LocalizedLink as Link } from '../lib/language';
import { useT } from '../lib/i18n';
import { AnimatedGridDivider } from './AnimatedGridDivider';

export function Profile() {
  const t = useT();

  return (
    <section
      id="profile"
      aria-label="Profile"
      // `isolate` gives this section its own stacking context, so the
      // divider at -z-10 paints above this background but below the text.
      className="relative isolate bg-bg py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="mb-10 flex items-baseline justify-between gap-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted">
            {t('label.profile')}
          </h2>

          <Link
            to="/profile"
            className="text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t('common.fullProfile')} →
          </Link>
        </div>

        <AnimatedGridDivider contained={false} />

        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted md:text-lg">
          <p className="text-text-primary">
            I am a Berlin-based architect and project lead with 13 years of
            experience across HOAI phases 1–8, from competitions and early
            design through planning permission, construction documentation,
            coordination and delivery.
          </p>

          <p>
            I studied architecture at the University of Zagreb and have worked
            in Berlin and Munich since 2013, including at OOW, June14
            Meyer-Grohbrügge &amp; Chermayeff, Lena Wimmer Architects, Aukett +
            Heese, GRAFT and Wiel Arets Architects.
          </p>

          <p>Member of the Architektenkammer Berlin since May 2025.</p>
        </div>
      </div>
    </section>
  );
}
