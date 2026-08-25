import { useLang, type Lang } from './language';

/**
 * Interface strings only — menu items, buttons, section labels, metadata
 * headings. Everything here is standard interface German with one right
 * answer, and several entries are lifted directly from Dorian's own German
 * frontmatter in content/*.de.md (Jahr, Ort, Typ, Status, Rolle, Team,
 * Tools, Quelle), so they match the translated pages exactly.
 *
 * What is deliberately NOT here: the hero copy, the profile biography, the
 * fields-of-work descriptions, the contact line, page intros, the research
 * entry descriptions and the Impressum body. Those are Dorian's own
 * first-person voice and his legal text — they wait for his translation
 * rather than being invented here. Any key with no `de` value falls back to
 * English automatically, so an untranslated string reads in English instead
 * of breaking.
 */
type Entry = { en: string; de?: string };

const STRINGS = {
  'nav.portfolio': { en: 'Portfolio', de: 'Portfolio' },
  'nav.work': { en: 'Work', de: 'Arbeiten' },
  'nav.profile': { en: 'Profile', de: 'Profil' },
  'nav.research': { en: 'Research', de: 'Forschung' },
  'nav.contact': { en: 'Contact', de: 'Kontakt' },

  'common.allProjects': { en: 'All projects', de: 'Alle Projekte' },
  'common.fullProfile': { en: 'Full profile', de: 'Vollständiges Profil' },
  'common.backIndex': { en: '← Index', de: '← Übersicht' },
  'common.backProjects': { en: '← Projects', de: '← Projekte' },
  'common.backResearch': { en: '← Research', de: '← Forschung' },
  'common.readMyNotes': { en: 'Read my notes', de: 'Meine Notizen lesen' },
  'common.readSource': { en: 'Read original source', de: 'Originalquelle lesen' },
  'common.sourceUnverified': {
    en: '(source to be verified)',
    de: '(Quelle wird noch geprüft)',
  },
  'common.openDemo': { en: 'Open the demo', de: 'Demo öffnen' },
  'common.readMore': { en: 'Read more', de: 'Mehr lesen' },
  'common.filterBy': { en: 'Filter by', de: 'Filtern nach' },
  'common.all': { en: 'All', de: 'Alle' },
  'common.nextProject': { en: 'Next project', de: 'Nächstes Projekt' },

  'label.selectedWork': { en: 'Selected work', de: 'Ausgewählte Arbeiten' },
  'label.fieldsOfWork': { en: 'Fields of work', de: 'Arbeitsfelder' },
  'label.profile': { en: 'Profile', de: 'Profil' },
  'label.research': { en: 'Research', de: 'Forschung' },
  'label.contact': { en: 'Contact', de: 'Kontakt' },
  'label.project': { en: 'Project', de: 'Projekt' },
  'label.practice': { en: 'Practice', de: 'Praxis' },

  // Lifted from Dorian's own frontmatter labels in content/*.de.md.
  'meta.year': { en: 'Year', de: 'Jahr' },
  'meta.location': { en: 'Location', de: 'Ort' },
  'meta.type': { en: 'Type', de: 'Typ' },
  'meta.status': { en: 'Status', de: 'Status' },
  'meta.role': { en: 'Role', de: 'Rolle' },
  'meta.team': { en: 'Team', de: 'Team' },
  'meta.tools': { en: 'Tools', de: 'Tools' },

  'page.work': { en: 'Work', de: 'Arbeiten' },
  'page.research': { en: 'Research', de: 'Forschung' },
  'page.profile': { en: 'Profile', de: 'Profil' },

  'article.source': { en: 'Source', de: 'Quelle' },

  'viewer.close': { en: 'Close', de: 'Schließen' },
  'viewer.previous': { en: 'Previous image', de: 'Vorheriges Bild' },
  'viewer.next': { en: 'Next image', de: 'Nächstes Bild' },
  'viewer.enlarge': { en: 'Enlarge', de: 'Vergrößern' },

  'error.pageNotFound': { en: 'Page not found', de: 'Seite nicht gefunden' },
  'error.backToIndex': { en: 'Back to the index', de: 'Zurück zur Startseite' },
  'error.projectNotFound': { en: 'Project not found', de: 'Projekt nicht gefunden' },
  'error.articleNotFound': { en: 'Article not found', de: 'Beitrag nicht gefunden' },
  'error.allResearch': { en: 'All research', de: 'Alle Forschungsbeiträge' },

  'lang.toGerman': { en: 'Switch to German', de: 'Auf Deutsch wechseln' },
  'lang.toEnglish': { en: 'Switch to English', de: 'Auf Englisch wechseln' },
  'lang.change': { en: 'Change language', de: 'Sprache wechseln' },

  // Contact form. Interface strings rather than Dorian's voice, so they are
  // translated here — an untranslated form label would read as broken.
  'form.name': { en: 'Name', de: 'Name' },
  'form.email': { en: 'Email', de: 'E-Mail' },
  'form.subject': { en: 'Subject', de: 'Betreff' },
  'form.message': { en: 'Message', de: 'Nachricht' },
  'form.optional': { en: 'optional', de: 'optional' },
  'form.required': { en: 'required', de: 'erforderlich' },
  'form.send': { en: 'Send message', de: 'Nachricht senden' },
  'form.sending': { en: 'Sending…', de: 'Wird gesendet…' },
  /*
   * Acknowledgment, not consent. The legal basis for the contact form is
   * Art. 6(1)(b)/(f) GDPR (pre-contractual steps / legitimate interest in
   * answering inquiries addressed to me) — see PrivacyPage.tsx — so the
   * checkbox must not say "I agree" or "I consent", which would imply
   * Art. 6(1)(a) is the basis and create a contradictory second mechanism.
   * Rendered as: {prefix} [privacy policy link] {suffix}
   */
  'form.consent': { en: 'I have read the', de: 'Ich habe die' },
  'form.consentLink': { en: 'privacy policy', de: 'Datenschutzerklärung' },
  'form.consentSuffix': { en: '.', de: ' gelesen.' },
  'form.success': {
    en: 'Thank you — your message has been sent. I will reply to the address you gave.',
    de: 'Danke — Ihre Nachricht wurde gesendet. Ich antworte an die angegebene Adresse.',
  },
  'form.errorEmail': {
    en: 'Please enter a valid email address.',
    de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  },
  'form.errorMessage': {
    en: 'Please enter a message.',
    de: 'Bitte geben Sie eine Nachricht ein.',
  },
  'form.errorAcknowledge': {
    en: 'Please confirm you have read the privacy policy to send your message.',
    de: 'Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben, um Ihre Nachricht zu senden.',
  },
  'form.errorRate': {
    en: 'Too many messages sent from this connection. Please try again later.',
    de: 'Zu viele Nachrichten von dieser Verbindung. Bitte versuchen Sie es später erneut.',
  },
  'form.errorSend': {
    en: 'The message could not be sent. Please try again, or write directly to hello@layeroff.ai.',
    de: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie direkt an hello@layeroff.ai.',
  },
  'form.errorHeading': { en: 'Message not sent', de: 'Nachricht nicht gesendet' },
  'form.fallback': {
    en: 'Or write directly to',
    de: 'Oder schreiben Sie direkt an',
  },
} satisfies Record<string, Entry>;

export type StringKey = keyof typeof STRINGS;

export function translate(key: StringKey, lang: Lang) {
  const entry: Entry = STRINGS[key];
  return (lang === 'de' && entry.de) || entry.en;
}

/** `const t = useT(); t('nav.work')` — resolves against the current language. */
export function useT() {
  const lang = useLang();
  return (key: StringKey) => translate(key, lang);
}
