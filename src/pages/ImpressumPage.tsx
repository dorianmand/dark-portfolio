import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

/**
 * § 5 DDG requires a ladungsfähige Anschrift — a real, servable postal address,
 * not a P.O. box. Address and telephone confirmed by Dorian, 15 Aug 2026.
 */
const CONTENT = {
  name: 'Dorian Mandzukic',
  street: 'Karlsgartenstraße 18',
  city: '12049 Berlin',
  country: 'Deutschland',
  email: 'hello@layeroff.ai',
  phone: '+49 176 41507345',
  profession: 'Architekt',
  professionState: 'verliehen in der Bundesrepublik Deutschland',
  chamber: 'Architektenkammer Berlin',
  chamberNumber: '19862',
  regulations: 'Architekten- und Baukammergesetz Berlin (ABKG)',
  regulationsUrl: 'https://www.ak-berlin.de',
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-stroke/12 py-4">
      <dt className="text-xs uppercase tracking-[0.15em] text-muted/70">
        {label}
      </dt>
      <dd className="mt-1 text-base leading-relaxed text-text-primary">
        {children}
      </dd>
    </div>
  );
}

export function ImpressumPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[760px] px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <h1 className="mb-6 text-4xl leading-[1.1] tracking-tight md:text-5xl">
          Impressum
        </h1>

        <p className="mb-14 text-base leading-relaxed text-muted">
          Angaben gemäß § 5 DDG.
        </p>

        <dl className="border-t border-stroke/20">
          <Row label="Verantwortlich für den Inhalt">
            {CONTENT.name}
            <br />
            {CONTENT.street}
            <br />
            {CONTENT.city}
            <br />
            {CONTENT.country}
          </Row>

          <Row label="Kontakt">
            <a
              href={`mailto:${CONTENT.email}`}
              className="underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {CONTENT.email}
            </a>
            <br />
            <a
              href={`tel:${CONTENT.phone.replace(/\s/g, '')}`}
              className="underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {CONTENT.phone}
            </a>
          </Row>

          <Row label="Berufsbezeichnung">
            {CONTENT.profession}, {CONTENT.professionState}
          </Row>

          <Row label="Zuständige Kammer">
            {CONTENT.chamber}
            <br />
            Mitgliedsnummer {CONTENT.chamberNumber}
            <br />
            <a
              href={CONTENT.regulationsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {CONTENT.regulationsUrl.replace('https://', '')} ↗
            </a>
          </Row>

          <Row label="Berufsrechtliche Regelungen">
            {CONTENT.regulations}
          </Row>
        </dl>

        <div className="mt-16 space-y-6 border-t border-stroke/20 pt-10 text-sm leading-relaxed text-muted">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted/70">
              Urheberrecht
            </p>
            <p>
              © 2026 Dorian Mandzukic. Alle Inhalte dieser Website — Texte,
              Zeichnungen, Diagramme, Fotografien und Quellcode — sind
              urheberrechtlich geschützt. Projekte, die in Zusammenarbeit mit
              Büros entstanden sind, werden auf der jeweiligen Projektseite
              entsprechend gekennzeichnet; die Rechte an diesen Arbeiten liegen
              bei den jeweiligen Urhebern. Beiträge im Bereich „News“ fassen
              fremde Veröffentlichungen zusammen und verweisen jeweils auf die
              Originalquelle.
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted/70">
              Stand
            </p>
            <p>August 2026</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
