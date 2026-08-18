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
