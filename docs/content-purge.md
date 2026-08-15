# Content purge — proposal

Every item below was verified by reading the file in the repo at
`dm-portfolio-2026` (renamed from `02 dark-portfolio`) on 15 Aug 2026. Nothing here is inferred.

The repo currently ships fabricated content to a live domain. Tier 1 is an
accuracy liability and should be removed regardless of whether the rebuild
proceeds.

---

## Tier 1 — Accuracy liabilities (remove now)

Live claims that are untrue.

### 1.1 `src/data/articles.ts` — fabricated article metadata

```ts
date: 'Jun 7, 2026',
read: '4 min read',
image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?...',
```

These three values are hardcoded onto **every** article, including the two real
ones. Every article on the site therefore displays the same invented publication
date, the same invented reading time, and the same stock photograph.

**Fix:** read `date` from YAML frontmatter in each `.md`; compute `read` from word
count; drop `image` entirely (no stock photography — §9 of positioning).

### 1.2 `src/data/content.ts` — `projects` array

Four entries titled *Automotive Motion*, *Urban Architecture*, *Human Perspective*,
*Brand Identity*, each an Unsplash URL. These render in the "Selected Work"
section under the heading "A selection of projects I've worked on". He has not
worked on any of them.

**Fix:** delete the array. Replace with the real project set from positioning §7.

### 1.3 `src/data/content.ts` — `journals` array

Five entries with invented titles and dates: *Manual Test Article*, *The
architecture of tiny digital moments*, *Designing systems that feel quietly
alive*, *A founder's field notes on creative velocity*, *How motion can make
interfaces more human*.

**Note:** this array is **dead code**. `Journal.tsx` imports from
`data/articles.ts`, not from here. It renders nowhere.

**Fix:** delete outright. No replacement.

### 1.4 `src/data/content.ts` — `explorations` array

Six Unsplash URLs presented as "Loose studies, experiments, and visual sparks
collected between client launches." Not his images, and there were no client
launches.

**Fix:** delete. See Tier 2.3 for the section itself.

### 1.5 `src/data/content.ts` — `hlsSource`

```ts
export const hlsSource = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
```

A Mux demo stream. Also **dead code** — no component imports it. `hls.js` remains
in `package.json` solely for this.

**Fix:** delete the export and drop `hls.js` from dependencies.

### 1.6 `src/components/Footer.tsx` — dead social links

```ts
{ name: 'LinkedIn', url: '#' },
{ name: 'GitHub',   url: '#' },
```

Both link to `#`. LinkedIn is the single most likely click from a hiring manager
and it goes nowhere. GitHub must not be linked at all for the three Anlage 1
projects (positioning §10).

**Fix:** real LinkedIn URL; remove GitHub.

**Net result of Tier 1:** `src/data/content.ts` is deleted in full.

---

## Tier 2 — Positioning contradictions (remove during rebuild)

Content that is accurate about the *old* positioning and wrong about the new one.

### 2.1 `src/components/Stats.tsx` — the retired consultancy pitch

Despite the filename, this is not a stats section. It is the About section, and
it carries the old positioning verbatim:

> "Layer_off helps architecture offices move from AI curiosity to controlled,
> useful workflows."
> "We work with practices that are cautious, curious or unsure where to begin…"

This is exactly the text the repositioning exists to delete: agency first person
plural, prospect-segmentation language, service framing. It also contains an
empty display heading —

```tsx
<div className="font-display text-4xl italic text-black md:text-6xl>
</div>
```

— which renders as blank vertical space on every visit.

**Fix:** delete the component. Replace with `Profile` (short first-person bio) per
positioning §5.

### 2.2 `src/components/Hero.tsx` — studio framing and CTA pair

Three problems:

- `const roles = ['Creative', 'Design', 'AI', 'Research'];` rendered as
  "*{role}* studio in Berlin." — **studio** is agency framing; the rotating word
  is decoration with no informational content.
- "Layer_off explores the invisible intelligence behind structures, systems and
  everyday workflows." — brand-as-subject, and vague.
- Two CTA buttons, "See Works" and "Reach out" → `hello@layeroff.ai`. A
  conversion pair on a page that is not converting anything.

**Fix:** name and role as text, not a logo image; positioning statement in place
of the tagline; no button pair. One quiet contact link in the footer only.

### 2.3 `src/components/Explorations.tsx` — delete entirely

A `min-h-[300vh]` section with a GSAP `ScrollTrigger` pin and scrubbed parallax
on rotated cards. Three separate items from the rejected list in positioning §12
(scroll hijacking, pinned parallax, stock photography), and the section has no
slot in the new IA.

**Fix:** delete the component and its route in `App.tsx`. Drop the
`ScrollTrigger` registration.

### 2.4 `src/components/Footer.tsx` — availability signal and headline

- `"Let's build something alive."` — agency copy.
- `"Available for projects"` beside a pulsing green dot. This is a
  freelance-availability badge. On a site whose author starts full-time
  employment on 01.09.2026, it is both wrong and, given Anlage 1, unhelpful.
- Hidden marquee reading `"BUILDING THE FUTURE • "` ×20 — already
  `className="hidden"`, so dead markup plus a running GSAP tween on an invisible
  element.

**Fix:** delete all three. Footer becomes: name, one email address, LinkedIn,
Impressum if required, LayerOff signature mark.

### 2.5 `src/components/LoadingScreen.tsx` — the gate

Cycles the words `['Better', 'workflows', 'with AI']` — a consultancy tagline —
behind a 2.7-second counter that blocks all content on first visit.

A hiring manager with a stack of portfolios does not wait 2.7 seconds. The
`?skipIntro=1` escape exists but nobody arrives with it.

**Fix:** delete the component. If an intro is wanted later, it must be
non-blocking.

### 2.6 `src/components/Journal.tsx` — decision required

Currently "Recent news", sourced from the two real `.md` articles. The content is
genuine; the framing ("News") is corporate and the section sits **above**
Selected Work in `App.tsx`, so the first thing a visitor meets after the hero is
a news feed.

**Options:**
- (a) Delete. Two articles do not sustain a section.
- (b) Keep as **Writing**, moved below projects, with honest dates from
  frontmatter.

Recommend (b) — it supports the "how he thinks" job of the site — conditional on
fixing 1.1 first.

---

## Tier 3 — Aesthetic contradictions (`src/index.css`)

All four are explicitly rejected in positioning §12.

| Line | Item | Action |
|---|---|---|
| `.accent-gradient` | `linear-gradient(90deg, #FFD700, #FF8C00)` gold gradient | delete |
| `.accent-gradient-reverse` | reverse of the above | delete |
| `.gradient-border` | animated blue gradient border, `gradient-shift 6s infinite` | delete |
| `.halftone` | dot-screen overlay, applied over project images at 20% multiply | delete |
| `::selection` | `rgba(137,170,204,.35)` blue | retune to the new accent |
| `@keyframes gradient-shift` | drives the deleted border | delete |

`gradient-border` is used in five places (Hero ×2, SelectedWorks, Explorations,
Journal). Removing the class requires touching each.

**Keep:** the `@theme` token block and the `:root` HSL variables. The palette
change is a value edit here — `--bg`, `--text`, `--muted`, `--stroke`, `--accent`
— not a rebuild. The ground is already light (`--bg: 0 0% 96%`,
`color-scheme: light`), so this is a warmth and accent adjustment, not an
inversion.

---

## Tier 4 — Hygiene

### 4.1 `package.json` — every dependency pinned to `"latest"`

All 13 dependencies and both devDependencies. A fresh `npm install` can pull a
breaking major and fail the Vercel build with no code change on his side.

**Fix:** pin to the versions currently in `yarn.lock` / `package-lock.json`.
While there: drop `hls.js` (1.5) and `tailwindcss-animate` if unused after the
purge.

### 4.2 `index.html` — no metadata

```html
<title>Layer_off</title>
```

That is the entire head beyond charset, viewport, and favicon. No description, no
Open Graph, no Twitter card, no canonical. A link pasted into LinkedIn or a
recruiter's Slack renders as a bare URL with no preview.

**Fix:** title `Dorian Mandzukic — Architect · Computational Designer`;
meta description; OG title/description/image/url; `lang="en"`.

### 4.3 `src/components/Navbar.tsx`

- `const [active, setActive] = useState('Home')` — `'Home'` is not in
  `links = ['News', 'Work', 'About']`, so no item is ever highlighted on load.
- Nav labels are the old IA. New: Index · Projects · Profile · Philosophy · Contact.
- `go()` sets `window.location.href` when off-route, forcing a full page reload.
  Blocks the "slow, controlled" requirement across a multi-page IA.

**Fix:** rebuild against `react-router-dom`, already a dependency and currently
unused.

### 4.4 `README.md`

> "# Dark Portfolio Landing Page … single-page portfolio landing page."

Describes neither the current site (which is light) nor the target (which is
multi-page).

**Fix:** rewrite after the rebuild.

### 4.5 Stray directories

`dm-portfolio-2026/dark-portfolio/` exists as a nested subdirectory alongside
`src/`. Contents not audited. Likely a duplicate scaffold from an earlier
generation — confirm before deleting.

---

## Execution order

1. Tier 1 — accuracy. Standalone commit, deployable today.
2. `docs/positioning.md` in place, old `LayerOff.ai Webpage Positioning.txt` retired.
3. Tier 4.1 and 4.2 — pin dependencies, add metadata. Low risk, high return.
4. Tier 2 + 3 with the rebuild, once the project set and images are confirmed.
5. Tier 4.3 routing, once the IA is final.

Steps 1–3 are independent of every open design decision and can proceed now.
