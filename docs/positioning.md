# Positioning

Canonical source for what this site says and refuses to say.
Referenced by `CLAUDE.md`. Read before any significant content or design decision.

Status: draft 1 — 15 Aug 2026. Supersedes `LayerOff.ai Webpage Positioning.txt` (consultancy version), which is retired.

---

## 1. What this site is

The personal professional portfolio of Dorian Mandzukic: an architect who builds
computational and AI systems for architectural work.

It exists to let someone evaluating him — an employer, a partner, a practice, a
peer — understand in five minutes what he has built, what he was responsible for,
and how he thinks.

## 2. What this site is not

- Not a consultancy, agency, or studio page.
- Not a service catalogue. No services, pricing, packages, audits, or consultations.
- Not a product site. The projects shown are not for sale, download, or distribution.
- Not a lead funnel. No booking widget, no "book a call", no availability badge,
  no newsletter capture, no conversion CTA of any kind.

The only action the site asks for is: read, then email if you want to talk.

## 3. Audience

In priority order:

1. Hiring managers and practice principals evaluating him for a role.
2. Collaborators and specialist partners deciding whether to work with him.
3. Peers in computational design and AEC technology.
4. Anyone who receives the link second-hand from one of the above.

Nobody in this list is a buyer. Every design and copy decision follows from that.

## 4. Identity and brand architecture

**Primary identity:** Dorian Mandzukic — Architect · Computational Designer.
This is what appears in the header, the `<title>`, the meta description, the OG
tags, and the footer copyright.

**LayerOff:** demoted from brand to signature. It remains the domain and may
appear as a small editorial mark in the footer or as the favicon. It never
appears as a first-person plural ("we", "our team", "the studio"), never carries a
mission statement, and never fronts the site.

**Why:** an active AI brand reads as a company. A company reads as a competing
side business to a prospective employer, and as a vendor to a practice. Neither is
what the site is for. The work is the same either way; only the framing changes.

**Voice rule:** first person singular throughout. "I built", never "we deliver".
If a sentence would survive on an agency homepage, it does not belong here.

## 5. Positioning statement

Working draft for the homepage, directly under the hero:

> I am an architect with thirteen years of practice across HOAI phases 1–6, most
> recently as office director at Wiel Arets Architects and senior architect at
> Graft. I build computational and AI systems for the parts of that work I know
> from the inside: competition strategy, parametric design control, and building
> permit documentation.
>
> These are not products. They are instruments, built to test how far
> architectural judgment can be supported by software without being replaced by it.

The final sentence is the thesis of the site. Everything else supports it.

## 6. Fields of work

Replaces "services". Three labels, descriptive not transactional, no prices, no
deliverables list, no "get in touch to discuss":

- **Architecture** — HOAI 1–6, project leadership, permit and construction documentation.
- **Computational design** — Rhino, Grasshopper, parametric control, geometry as data.
- **Applied AI** — agent workflows, structured document processing, rule-based evaluation.

## 7. Project hierarchy

The site leads with hybrid architecture × AI work. Built architecture is present,
credited, and secondary — it establishes that the hybrid work comes from
practice rather than from outside it.

**Lead — hybrid work (own IP):**

| Project | One-line | Status label |
|---|---|---|
| CompAr | Turns competition briefs into validated design strategies | Graduation project, phases 1–5 implemented |
| Design Copilot | Parametric building control with rule-based design critique in Grasshopper | Working prototype in Grasshopper |
| Formwerk | Rule-based engine for German Bauantrag forms | Berlin pilot, three official forms |

**Secondary — built and delivered architecture (employer work):**

| Project | Office | Role |
|---|---|---|
| Sakanela Master, Tbilisi | Graft | Delivery and coordination |
| Baugemeinschaft Kurfürstenstraße 142, Berlin | June14 Meyer-Grohbrügge & Chermayeff | Delivery, consultant coordination |

Further architecture entries may be added from the portfolio PDFs, subject to §9.

## 8. Required structure per project page

Non-negotiable. A project page without these is not publishable.

1. **Metadata block** — year, location, type, status, role, team size, tools.
   Every field either factual or omitted. Never "various", never "ongoing" as a hedge.
2. **My contribution** — an explicit paragraph naming what he personally did, in
   the first person, distinguished from what the office or the team did.
3. **Neutral description** — what the project is and what problem it addresses.
4. **What it is not** — for the hybrid projects only. Formwerk's own infographic
   already does this ("Formwerk ist / Formwerk ist nicht"); carry that pattern
   across all three. It is the single strongest anti-overclaiming device available.

## 9. Accuracy rules

These override every aesthetic and narrative consideration.

- Never invent a date, employer, qualification, award, credit, metric, or client name.
- Anything not confirmed by Dorian is either omitted or rendered as a visibly
  marked placeholder — never as plausible-looking filler.
- Employer projects require the office's clearance before publication. Until
  cleared, they do not go live. Offices to ask: Graft, June14 Meyer-Grohbrügge &
  Chermayeff.
- Status labels must be ones he would defend unprompted in an interview. A
  prototype is called a prototype. A pilot is called a pilot.
- Article dates and reading times come from the article, never from a default.
- No stock photography anywhere on the site. If there is no real image, there is
  no image.

## 10. Constraint from the U-Plan contract

> **Internal only. Never publish, paraphrase, or allude to any of this on the
> website.** No contract, employer, or clause is ever named in public copy, in
> frontmatter, in comments that ship, or in commit messages. This section exists
> so the retrospective voice below is applied consistently — the reasoning stays
> here, only the resulting tone reaches the site.


Anlage 1 of the U-Plan Engine employment contract permits CompAr, Design Copilot,
and Formwerk to be shown **for portfolio display only**. It prohibits repository
publication, download, distribution, and anything functionally competing with the
U-Plan Planning Engine.

Consequences for the site:

- No GitHub links, no repository badges, no "view source", no demo builds, no
  downloadable files for these three projects.
- No language that offers the projects for use, licensing, trial, or purchase.
- Every hybrid project is written **retrospectively** — what was built, what it
  does, what was learned — never as a capability on offer.

This constraint is not a limitation to be worked around. It is the reason the
retrospective voice is correct anyway.

## 11. Voice

- First person for bio, philosophy, and "My contribution". Neutral editorial for
  project descriptions.
- No hype adjectives: revolutionary, cutting-edge, seamless, powerful, innovative,
  game-changing, next-generation.
- No marketing verbs: leverage, empower, unlock, transform, supercharge, elevate.
- No em-dash-driven suspense, no rhetorical questions, no "But here's the thing".
- German terms stay German where they are terms of art (Bauantrag, Leistungsphase,
  GRZ, Auslobung). Explain once, in a clause, then use freely.
- Sentence length varies. Paragraphs are short. Nothing is padded to fill a grid.

## 12. Visual direction

- Ground: warm off-white / light stone. Text: deep ink / charcoal. Secondary: slate.
  One restrained accent, used sparingly and never as a gradient.
- Generous whitespace, editorial grid, slow and controlled motion.
- Typography: clean grotesk display + readable sans body. Inter is already the body
  face and stays.
- **Reference implementation:** the existing Formwerk and Design Copilot project
  infographics. Warm cream ground, gold hairline accent, serif display,
  numbered section grid. That aesthetic is already his, already executed, and
  already correct. Match it rather than inventing a new one.

**Explicitly rejected:** dark tech-startup aesthetic, gradients of any kind, glass
and blur effects, glowing borders, AI-generated architectural imagery, stock
photography, scroll hijacking, pinned parallax sections, loading screens that gate
content, animated availability indicators.

## 13. Test for any proposed addition

Ask in order:

1. Does it help someone evaluating Dorian for work? If no, cut it.
2. Is every factual claim in it verified? If no, mark it or cut it.
3. Would it read as an offer rather than a record? If yes, rewrite it.
4. Does it survive being read by U-Plan's managing director? If no, rewrite it.
