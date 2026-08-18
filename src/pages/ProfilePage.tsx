import { LocalizedLink as Link } from '../lib/language';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useT } from '../lib/i18n';
import { useSeo } from '../lib/seo';

export function ProfilePage() {
  const t = useT();

  useSeo({
    title: t('page.profile'),
    description:
      'I am a Berlin-based architect and project lead with 13 years of experience across HOAI phases 1–8, from competitions and early design through planning permission, construction documentation, coordination and delivery.',
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-52 lg:px-16">
        <Link
          to="/#profile"
          className="mb-14 inline-block text-xs uppercase tracking-[0.2em] text-muted transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {t('common.backIndex')}
        </Link>

        <h1 className="mb-16 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          {t('page.profile')}
        </h1>

        <div className="grid gap-y-10 border-t border-stroke/15 pt-14 md:grid-cols-12 md:gap-x-16">
          <div className="md:col-span-8">
            <div className="max-w-2xl space-y-6 text-base leading-relaxed text-muted md:text-lg">
              <p className="text-text-primary">
                I am a Berlin-based architect and project lead with 13 years of
                experience across HOAI phases 1–8, from competitions and early
                design through planning permission, construction documentation,
                coordination and delivery.
              </p>

              <p>
                I studied architecture at the University of Zagreb and have
                practised in Berlin and Munich since 2013. My experience
                includes work at OOW, June14 Meyer-Grohbrügge &amp; Chermayeff,
                Lena Wimmer Architects, Aukett + Heese, GRAFT and Wiel Arets
                Architects.
              </p>

              <p>
                At GRAFT, I worked for seven years across education, office,
                hospitality, residential, retail and infrastructure projects. My
                work included project leadership for the 68,000 m² LOVT Vision
                development in Munich.
              </p>

              <p>
                At Wiel Arets Architects, I led the German office and managed
                the 4,660 m² Special Education Centre Munich North-West through
                HOAI phases 3–5, including planning permission. The
                approximately €105 million project involved direct coordination
                with the client, authorities, consultants and a three-person
                design team.
              </p>

              <p>
                The computational and AI work shown on this site comes directly
                from that experience. Each project began with a recurring
                constraint in practice: keeping a competition strategy coherent,
                testing a massing against its own rules or preparing a
                Bauantrag without entering the same information repeatedly.
              </p>

              <p>
                In 2026, I completed a 450-hour professional training programme
                in AI Agents &amp; Automations at WBS Coding School. I work
                across BIM, computational design, automation and applied AI,
                focusing on tools that support project delivery, coordination,
                structured documentation and transparent decision-making.
              </p>

              <p className="text-text-primary">
                My perspective remains architectural. Technology must work under
                real project constraints, remain understandable to the people
                using it and keep professional judgment and responsibility with
                the architect.
              </p>

              <p>Member of the Architektenkammer Berlin since May 2025.</p>
            </div>
          </div>

          <aside className="md:col-span-4 md:sticky md:top-32 md:self-start">
            {/*
              Full column width, cropped to 0.86 from the bottom and graded
              towards the page's warm ground — see public/images. No frame or
              rounded corner: the portrait sits in the column the same way the
              project covers sit in theirs.
            */}
            <img
              src="/images/dorian-portrait.webp"
              alt="Dorian Mandzukic"
              width={945}
              height={1099}
              loading="lazy"
              className="mb-8 w-full border border-stroke/10"
            />

            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
              {t('label.practice')}
            </p>

            <dl className="border-t border-stroke/15">
              {[
                ['Based in', 'Berlin'],
                ['Experience', '13 years, HOAI phases 1–8'],
                ['Education', 'University of Zagreb'],
                ['Chamber', 'Architektenkammer Berlin, since May 2025'],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-stroke/12 py-3 last:border-b-0">
                  <dt className="text-xs uppercase tracking-[0.15em] text-muted/70">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
