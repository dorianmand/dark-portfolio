import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSeo } from '../lib/seo';

/**
 * § 5 DDG requires a ladungsfähige Anschrift — a real, servable postal address.
 * Address, telephone and chamber details confirmed by Dorian, 15 Aug 2026.
 */

const link =
  'underline decoration-accent/50 underline-offset-4 transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-stroke/15 py-8 md:grid-cols-12 md:gap-10">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted md:col-span-3">
        {label}
      </h2>

      <div className="space-y-3 text-base leading-relaxed text-text-primary md:col-span-9 md:text-lg">
        {children}
      </div>
    </div>
  );
}

export function ImpressumPage() {
  useSeo({
    title: 'Impressum',
    description: 'Information pursuant to Section 5 of the German Digital Services Act (DDG).',
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-52 lg:px-16">
        <h1 className="mb-5 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Impressum
        </h1>

        <p className="mb-16 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Information pursuant to Section 5 of the German Digital Services Act
          (DDG).
        </p>

        <div className="border-t border-stroke/15">
          <Row label="Provider">
            <p>
              Dorian Mandzukic
              <br />
              Karlsgartenstraße 18
              <br />
              12049 Berlin
              <br />
              Germany
            </p>
          </Row>

          <Row label="Contact">
            <p>
              Email:{' '}
              <a href="mailto:hello@layeroff.ai" className={link}>
                hello@layeroff.ai
              </a>
              <br />
              Telephone:{' '}
              <a href="tel:+4917641507345" className={link}>
                +49 176 41507345
              </a>
            </p>
          </Row>

          <Row label="Professional title">
            <p>
              Architect
              <br />
              Professional title awarded in the Federal Republic of Germany
            </p>
          </Row>

          <Row label="Competent chamber">
            <p>
              Berlin Chamber of Architects
              <br />
              Alte Jakobstraße 149
              <br />
              10969 Berlin
              <br />
              Germany
              <br />
              Membership number: 19862
            </p>
            <p>
              <a
                href="https://www.ak-berlin.de"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                www.ak-berlin.de{' '}
                <span className="text-accent" aria-hidden="true">
                  ↗
                </span>
              </a>
            </p>
          </Row>

          <Row label="Professional regulations">
            <p>
              Berlin Architects’ and Building Chamber Act (ABKG)
              <br />
              Professional Code of Conduct of the Berlin Chamber of Architects
            </p>
            <p>
              <a
                href="https://www.ak-berlin.de/architektenkammer-berlin/regelwerke/"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                www.ak-berlin.de/architektenkammer-berlin/regelwerke{' '}
                <span className="text-accent" aria-hidden="true">
                  ↗
                </span>
              </a>
            </p>
          </Row>

          <Row label="Editorial content">
            <p className="text-muted">
              Responsible for journalistic and editorial content pursuant to
              Section 18(2) of the German State Media Treaty (MStV):
            </p>
            <p>
              Dorian Mandzukic
              <br />
              Karlsgartenstraße 18
              <br />
              12049 Berlin
              <br />
              Germany
            </p>
          </Row>

          <Row label="Copyright">
            <p className="max-w-2xl text-muted">
              © 2026 Dorian Mandzukic. The content and works published on this
              website are protected by German copyright law unless otherwise
              indicated.
            </p>
          </Row>
        </div>
      </main>

      <Footer />
    </>
  );
}
