import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSeo } from '../lib/seo';
import { useLang } from '../lib/language';

/**
 * Privacy notice, reached from the contact form's acknowledgment checkbox at
 * /privacy and /datenschutz.
 *
 * Controller identity and address match the Impressum exactly (Karlsgartenstraße
 * 18, 12049 Berlin) — the two must never drift apart. The contact-form and
 * processor sections describe what api/contact.ts actually does. Legal basis
 * is Art. 6(1)(b)/(f) GDPR, not consent — see the note on the form checkbox in
 * ContactForm.tsx for why that changes its wording.
 *
 * This is a practical draft, not a substitute for review by a German
 * data-protection professional.
 */

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

const link =
  'underline decoration-accent/50 underline-offset-4 transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

const COPY = {
  en: {
    title: 'Privacy',
    intro:
      'How data submitted through this website is handled. This site sets no analytics or advertising cookies.',
    controller: 'Controller',
    contactForm: 'Contact form',
    processors: 'Recipients and service providers',
    retention: 'Retention',
    rights: 'Your rights',
    authority: 'Right to lodge a complaint',
    controllerIntro:
      'The controller responsible for the processing of personal data on this website pursuant to Article 4(7) GDPR is:',
    formBody:
      'When you use the contact form, I process the information you provide, including your name if supplied, email address, subject and message. The message is sent by email to hello@layeroff.ai with your address set as the reply address, so a reply reaches you directly. Nothing entered in the form is written to a database or stored on this website.',
    formPurpose:
      'The processing is carried out solely to receive, review and respond to your inquiry. The legal basis is Article 6(1)(b) GDPR where your inquiry concerns steps prior to entering into a contract, and Article 6(1)(f) GDPR in all other cases. My legitimate interest is the effective handling of inquiries addressed to me.',
    formRequired:
      'You are not required to provide a name. However, an email address and message are required in order to respond to your inquiry.',
    processorsIntro:
      'To operate the contact form, data may be processed by service providers acting on my behalf:',
    processorVercel: 'Vercel Inc. — website hosting and serverless form processing.',
    processorResend: 'Resend Inc. — delivery of transactional email messages.',
    processorsNote:
      'These providers process data only as necessary to provide their services. Data may be transferred to countries outside the European Economic Area where this is necessary for the provision of the service. Where applicable, appropriate safeguards are used in accordance with Article 44 et seq. GDPR.',
    retentionBody:
      'Contact-form submissions are deleted no later than 12 months after the final communication, unless continued storage is necessary to establish, exercise or defend legal claims, or statutory retention obligations apply.',
    rightsIntro: 'Subject to the applicable legal requirements, you have the right to request:',
    rightsList: [
      'access to your personal data under Article 15 GDPR',
      'rectification of inaccurate personal data under Article 16 GDPR',
      'erasure of personal data under Article 17 GDPR',
      'restriction of processing under Article 18 GDPR',
      'data portability under Article 20 GDPR',
      'objection to processing based on Article 6(1)(f) GDPR under Article 21 GDPR',
    ],
    rightsContact:
      'To exercise your rights, contact: hello@layeroff.ai.',
    authorityBody: 'You have the right to lodge a complaint with a data protection supervisory authority. The authority responsible for me is:',
  },
  de: {
    title: 'Datenschutz',
    intro:
      'Wie mit Daten umgegangen wird, die über diese Website übermittelt werden. Diese Website setzt keine Analyse- oder Werbe-Cookies.',
    controller: 'Verantwortlicher',
    contactForm: 'Kontaktformular',
    processors: 'Empfänger und Dienstleister',
    retention: 'Speicherdauer',
    rights: 'Ihre Rechte',
    authority: 'Beschwerderecht bei einer Aufsichtsbehörde',
    controllerIntro:
      'Verantwortlicher für die Verarbeitung personenbezogener Daten auf dieser Website im Sinne von Art. 4 Nr. 7 DSGVO ist:',
    formBody:
      'Wenn Sie das Kontaktformular nutzen, verarbeite ich die von Ihnen übermittelten Angaben, insbesondere Ihren Namen, soweit angegeben, Ihre E-Mail-Adresse, den Betreff und Ihre Nachricht. Die Nachricht wird per E-Mail an hello@layeroff.ai gesendet, wobei Ihre Adresse als Antwortadresse gesetzt wird, damit eine Antwort Sie direkt erreicht. Die Eingaben werden nicht in einer Datenbank gespeichert.',
    formPurpose:
      'Die Verarbeitung erfolgt ausschließlich, um Ihre Anfrage entgegenzunehmen, zu prüfen und zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf den Abschluss eines Vertrags gerichtet ist oder vorvertraglichen Maßnahmen dient. In allen anderen Fällen erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der effektiven Bearbeitung an mich gerichteter Anfragen.',
    formRequired:
      'Die Angabe Ihres Namens ist freiwillig. E-Mail-Adresse und Nachricht sind erforderlich, um Ihre Anfrage beantworten zu können.',
    processorsIntro:
      'Für den Betrieb des Kontaktformulars können Daten durch weisungsgebundene Dienstleister verarbeitet werden:',
    processorVercel: 'Vercel Inc. — Hosting der Website und serverseitige Verarbeitung des Kontaktformulars.',
    processorResend: 'Resend Inc. — Versand der transaktionalen E-Mail-Nachrichten.',
    processorsNote:
      'Diese Dienstleister verarbeiten Daten nur, soweit dies für die Erbringung ihrer Leistungen erforderlich ist. Daten können in Länder außerhalb des Europäischen Wirtschaftsraums übermittelt werden, soweit dies für die Bereitstellung der Dienste erforderlich ist. Soweit erforderlich, werden geeignete Garantien gemäß Art. 44 ff. DSGVO eingesetzt.',
    retentionBody:
      'Anfragen über das Kontaktformular werden spätestens 12 Monate nach Abschluss der Kommunikation gelöscht, sofern keine weitere Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.',
    rightsIntro: 'Sie haben im Rahmen der gesetzlichen Vorgaben das Recht auf:',
    rightsList: [
      'Auskunft über die Sie betreffenden personenbezogenen Daten gemäß Art. 15 DSGVO',
      'Berichtigung unrichtiger personenbezogener Daten gemäß Art. 16 DSGVO',
      'Löschung Ihrer personenbezogenen Daten gemäß Art. 17 DSGVO',
      'Einschränkung der Verarbeitung gemäß Art. 18 DSGVO',
      'Datenübertragbarkeit gemäß Art. 20 DSGVO',
      'Widerspruch gegen eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gemäß Art. 21 DSGVO',
    ],
    rightsContact:
      'Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: hello@layeroff.ai.',
    authorityBody: 'Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Zuständig für mich ist:',
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
            <p>{c.controllerIntro}</p>
            <p>
              Dorian Mandzukic
              <br />
              Karlsgartenstraße 18
              <br />
              12049 Berlin
              <br />
              {lang === 'de' ? 'Deutschland' : 'Germany'}
            </p>
            <p>
              {lang === 'de' ? 'E-Mail' : 'Email'}:{' '}
              <a href="mailto:hello@layeroff.ai" className={link}>
                hello@layeroff.ai
              </a>
              <br />
              {lang === 'de' ? 'Telefon' : 'Telephone'}:{' '}
              <a href="tel:+4917641507345" className={link}>
                +49 176 41507345
              </a>
            </p>
          </Row>

          <Row label={c.contactForm}>
            <p>{c.formBody}</p>
            <p>{c.formPurpose}</p>
            <p>{c.formRequired}</p>
          </Row>

          <Row label={c.processors}>
            <p>{c.processorsIntro}</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>{c.processorVercel}</li>
              <li>{c.processorResend}</li>
            </ul>
            <p>{c.processorsNote}</p>
          </Row>

          <Row label={c.retention}>
            <p>{c.retentionBody}</p>
          </Row>

          <Row label={c.rights}>
            <p>{c.rightsIntro}</p>
            <ul className="list-disc space-y-1 pl-5">
              {c.rightsList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{c.rightsContact}</p>
          </Row>

          <Row label={c.authority}>
            <p>{c.authorityBody}</p>
            <p>
              {lang === 'de'
                ? 'Berliner Beauftragte für Datenschutz und Informationsfreiheit'
                : 'Berlin Commissioner for Data Protection and Freedom of Information'}
              <br />
              Alt-Moabit 59–61
              <br />
              10555 Berlin
              <br />
              {lang === 'de' ? 'Deutschland' : 'Germany'}
            </p>
            <p>
              {lang === 'de' ? 'E-Mail' : 'Email'}:{' '}
              <a href="mailto:mailbox@datenschutz-berlin.de" className={link}>
                mailbox@datenschutz-berlin.de
              </a>
              <br />
              {lang === 'de' ? 'Website' : 'Website'}:{' '}
              <a
                href="https://www.datenschutz-berlin.de"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                www.datenschutz-berlin.de
              </a>
            </p>
          </Row>
        </div>
      </main>

      <Footer />
    </>
  );
}
