import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSeo } from '../lib/seo';
import { useLang } from '../lib/language';

/**
 * Privacy notice, reached from the contact form's consent checkbox at /privacy
 * and /datenschutz.
 *
 * The sections describing the contact form state what the code actually does
 * and are accurate. Everything a lawyer has to sign off — the controller's
 * details, retention periods, the statutory rights wording and the supervisory
 * authority — is marked PLACEHOLDER rather than invented. Dorian is Berlin
 * based, so this is GDPR territory and the wording is his to confirm.
 */

const PLACEHOLDER = 'PLACEHOLDER — to be confirmed';

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

const COPY = {
  en: {
    title: 'Privacy',
    intro:
      'How data submitted through this website is handled. This site sets no analytics or advertising cookies.',
    controller: 'Controller',
    contactForm: 'Contact form',
    processors: 'Processors',
    retention: 'Retention',
    rights: 'Your rights',
    authority: 'Supervisory authority',
    formBody:
      'The contact form transmits the name, email address, subject and message you enter. The message is sent by email to hello@layeroff.ai with your address set as the reply address, so a reply reaches you directly. Nothing entered in the form is written to a database or stored on this website.',
    formBasis:
      'The legal basis is your consent, given by ticking the box before sending (Art. 6(1)(a) GDPR). You may withdraw it at any time; withdrawal does not affect processing already carried out.',
    processorsBody:
      'The site is hosted by Vercel Inc. Form messages are delivered by Resend. Both receive the data necessary to serve the page and deliver the message.',
  },
  de: {
    title: 'Datenschutz',
    intro:
      'Wie mit Daten umgegangen wird, die über diese Website übermittelt werden. Diese Website setzt keine Analyse- oder Werbe-Cookies.',
    controller: 'Verantwortlicher',
    contactForm: 'Kontaktformular',
    processors: 'Auftragsverarbeiter',
    retention: 'Speicherdauer',
    rights: 'Ihre Rechte',
    authority: 'Aufsichtsbehörde',
    formBody:
      'Das Kontaktformular übermittelt den von Ihnen eingegebenen Namen, die E-Mail-Adresse, den Betreff und die Nachricht. Die Nachricht wird per E-Mail an hello@layeroff.ai gesendet, wobei Ihre Adresse als Antwortadresse gesetzt wird, damit eine Antwort Sie direkt erreicht. Die Eingaben werden nicht in einer Datenbank gespeichert.',
    formBasis:
      'Rechtsgrundlage ist Ihre Einwilligung, die Sie vor dem Senden durch Anklicken des Kontrollkästchens erteilen (Art. 6 Abs. 1 lit. a DSGVO). Sie können sie jederzeit widerrufen; die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.',
    processorsBody:
      'Die Website wird von Vercel Inc. gehostet. Formularnachrichten werden über Resend zugestellt. Beide erhalten die zur Auslieferung der Seite und der Nachricht erforderlichen Daten.',
  },
} as const;

export function PrivacyPage() {
  const lang = useLang();
  const c = COPY[lang];

  useSeo({ title: c.title, description: c.intro });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-52 lg:px-16">
        <h1 className="mb-5 text-5xl leading-[1.05] tracking-tight md:text-7xl">
          {c.title}
        </h1>

        <p className="mb-16 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {c.intro}
        </p>

        <div className="border-t border-stroke/15">
          <Row label={c.controller}>
            <p className="text-muted">{PLACEHOLDER}</p>
          </Row>

          <Row label={c.contactForm}>
            <p>{c.formBody}</p>
            <p>{c.formBasis}</p>
          </Row>

          <Row label={c.processors}>
            <p>{c.processorsBody}</p>
          </Row>

          <Row label={c.retention}>
            <p className="text-muted">{PLACEHOLDER}</p>
          </Row>

          <Row label={c.rights}>
            <p className="text-muted">{PLACEHOLDER}</p>
          </Row>

          <Row label={c.authority}>
            <p className="text-muted">{PLACEHOLDER}</p>
          </Row>
        </div>
      </main>

      <Footer />
    </>
  );
}
