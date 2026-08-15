# Rebrand strategy — layeroff.ai

15 Aug 2026. Companion to `positioning.md` (what the site says) and
`content-purge.md` (what comes out). This document covers why, in what order, and
under what constraints.

---

## 1. The shift in one sentence

From a consultancy landing page selling AI workflow help to architecture offices,
to a personal portfolio proving that an architect of thirteen years builds the
computational and AI systems that architecture actually needs.

## 2. Why now

Three forces converge, and they point the same way.

**Employment.** U-Plan Engine starts 01.09.2026. A live consultancy page offering
AI services to architecture practices is a Nebentätigkeit in the eyes of an
employer whose product is a planning engine. The site must stop selling before
the contract starts.

**Contract.** Anlage 1 permits CompAr, Design Copilot and Formwerk to exist
publicly **only as portfolio display**. That removes every distribution channel
except this one — and simultaneously makes this one necessary. The site is now the
sole permitted home of three years of work.

**Material.** The application folder contains a curated four-project set with real
imagery, two finished project infographics in the correct visual language, and a
CV of substance. The rebrand is no longer blocked on content. It was, until
yesterday.

## 3. Brand architecture decision

| | Before | After |
|---|---|---|
| Fronts the site | LayerOff.ai | Dorian Mandzukic |
| Voice | "We help practices…" | "I built…" |
| LayerOff's role | The company | An editorial signature and the domain |
| What is offered | AI workflow audits, consultation | Nothing |

The domain stays. Rebuying and redirecting costs more than it returns, and
`layeroff.ai` reads fine as a personal mark once nothing on the page behaves like
a company. The signal that matters is not the URL — it is whether the page says
"we" and whether it asks for money.

**Residual risk:** the `.ai` domain plus three AI projects can still read as a
side business to a suspicious reader. Mitigated by the retrospective voice
(positioning §10), the absence of any offer, and by architecture work being
visibly present. Accepted, not eliminated.

## 4. What the site has to accomplish

One job: a hiring manager or practice principal, five minutes, no prior knowledge,
comes away able to say what Dorian has built, what he was responsible for, and how
he thinks about architecture and software.

Everything is measured against that. A section that does not serve it is cut.

## 5. Information architecture

```
/                    Index      hero · positioning · selected projects ·
                                fields of work · philosophy excerpt · short bio · contact
/projects            Projects   full list, hybrid first, architecture second
/projects/:slug      Project    metadata · my contribution · description · what it is not
/profile             Profile    CV in prose: practice, roles, qualifications
/philosophy          Philosophy the long-form argument
/contact             Contact    email, LinkedIn, Impressum
/writing             Writing    the two real articles (pending decision)
/writing/:slug       Article
```

Nine to eleven routes. Confirms the move to `react-router-dom` — already a
dependency, currently unused, and the hand-rolled `pathname` if-chain in `App.tsx`
forces a full page reload on every navigation.

## 6. Project set

**Hybrid — leads.** CompAr, Design Copilot, Formwerk. Own IP, Anlage 1 governed,
retrospective voice, no repository links.

**Architecture — secondary but present.** Sakanela Master (Graft, Tbilisi) and
Baugemeinschaft Kurfürstenstraße 142 (June14). These carry the credibility that
makes the hybrid work legible as architecture rather than software. Both need
office clearance before publication.

**Not on the site:** Sanitronics, SFZ Munich North-West, Planeco, and the other
permit sets in the application folder. They are professional documentation, they
belong to employers, and Bauantrag folders are not portfolio pieces. SFZ may
appear as a line in the Profile — 4,660 m², ~€105M, LP 3–5, permission granted —
without images or a project page.

**Dropped from the old site:** the naming tool (Synantics) and the presentation
GPT (Narrative Grid). Neither fits the BIM / AEC / computational / automation
focus. They stay on the CV. Reinstate only if the Projects page looks thin.

## 7. Visual system — the useful discovery

The brief proposed Space Grotesk + Inter on warm off-white. The repo turns out to
be light already (`--bg: 0 0% 96%`, `color-scheme: light`) with Instrument Serif +
Inter and centralised `@theme` tokens.

But the stronger reference is not in the repo at all. The **Formwerk** and
**Design Copilot** infographics are already the finished article: warm cream
ground, gold hairline rules, serif display over sans body, numbered section grid,
generous margins, zero gradients. That is the site's design system, already
executed by him, already proven at document scale.

**Decision:** derive the site's visual language from those two boards rather than
inventing one. Instrument Serif stays as display — it is closer to those boards
than Space Grotesk. Inter stays as body. The palette becomes cream ground, ink
text, slate secondary, single gold hairline accent used only for rules and
numerals.

This collapses the visual work from a rebuild to a token edit plus the deletion of
six CSS classes.

## 8. Build sequence

**Phase 0 — accuracy.** Tier 1 of the purge. Removes fabricated dates, invented
project titles, stock imagery, and dead links from a live site. Independent of
every open decision. Deployable today.

**Phase 1 — foundations.** `docs/positioning.md` committed; old positioning file
retired; dependencies pinned; `index.html` metadata written. Low risk.

**Phase 2 — routing and shell.** `react-router-dom`, the five-route skeleton,
navbar rebuilt, `LoadingScreen` and `Explorations` deleted.

**Phase 3 — visual system.** Token values from the infographic palette; gradient,
halftone and glass classes removed; type scale set.

**Phase 4 — content.** Project pages written against the §8 template in
positioning. Hybrid three first — their infographics supply both text and
structure. Architecture two after clearance.

**Phase 5 — images.** Export from the application folder, compress, convert to
WebP with fallbacks. Currently `public/` holds only `favicon.png` and a 894 KB
`logo.png`.

**Phase 6 — Profile, Philosophy, Writing.** The long-form text. Slowest phase,
because it is the part only he can write.

Phases 0 and 1 can run now. Phase 4 gates on clearance. Phase 6 gates on him.

## 9. Risk register

| # | Risk | Severity | Handling |
|---|---|---|---|
| 1 | Employer clearance refused for Sakanela or Kurfürstenstraße | High | Ask both offices in week 1. If refused, architecture presence falls back to text-only credits in Profile. |
| 2 | `.ai` domain + AI projects read as competing business | Medium | Retrospective voice, no offer surface, no repository links, architecture visible. Accepted risk. |
| 3 | Fabricated content stays live while the rebuild runs | High | Phase 0 removes it independently. Do not bundle it into the rebuild. |
| 4 | Status overclaiming on project pages | Medium | "What it is not" block mandatory on every hybrid project, per Formwerk's own pattern. |
| 5 | `"latest"` dependencies break the Vercel build mid-rebuild | Medium | Pin in Phase 1, before any structural change. |
| 6 | Site stalls in Phase 6 because long-form text is unwritten | Medium | Ship Phases 0–5 with Profile as a short factual bio. Philosophy can arrive later; an empty Philosophy route does not ship. |
| 7 | Global CLAUDE.md's one-action-per-response rule makes a hundreds-of-decisions build unworkable | Low | Project CLAUDE.md governs inside this repo; global rules govern elsewhere. Pending his confirmation. |

## 10. Open decisions

1. **Writing section** — delete, or keep as *Writing* below projects with honest
   frontmatter dates? (Recommend: keep.)
2. **Architecture project count** — the two in the application folder, or more
   pulled from the 124 MB portfolio PDF?
3. **Impressum** — required for a German-hosted personal site with a business-ish
   domain. Confirm whether one already exists.
4. **Contact form** — the current mailto composer in `Footer.tsx`, or a plain
   `mailto:` link? (Recommend: plain link. The composer adds no value and a broken
   form on a portfolio is worse than no form.)
5. **`hello@layeroff.ai` vs a personal address** — the former is a company
   address for a site that is no longer a company.
6. **Go-live date** — before 01.09.2026 is strongly preferable, so the consultancy
   version is not live on day one of the employment.

## 11. What this does not change

The CV defects found in the application folder — the misspelled contact email
(`dorian.manzukic@`, missing the *d*), the German-language skills block in the
English CV, the HOAI range stated as 1–6 / 1–8 / 1–9 across three documents, and
the Aukett + Heese entry claiming coordination eight months after the employment
ended — are separate from the site and should be fixed first. They are in
circulation now.
