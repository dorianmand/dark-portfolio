# Content

Everything on this page that is text comes from this folder. Nothing else.
If you want something to appear on layeroff.ai, it goes here — and if it is
not here, it is not on the site.

```
content/
├─ projects/    → the Work section and every /projects/<slug> page
└─ articles/    → the Research section and every /news/<slug> page
```

Images do **not** live here. They live in `public/images/` — see *Images* below.

---

## Rules that apply to both folders

**The filename is the URL.** `content/projects/formwerk.md` becomes
`/projects/formwerk`. Use lowercase, hyphens, no spaces, no umlauts.

**Files starting with `_` are ignored.** That is how `_TEMPLATE.md` can sit in
the folder without becoming a page. Use the same trick to park a draft:
rename it `_my-draft.md` and it disappears from the site until you drop
the underscore.

**Drop a file in, and it appears.** There is no list to register it in, no
index to update. Adding the file is the whole operation. Deleting the file
removes the page.

**Frontmatter is the block between the two `---` lines at the top.** It is
`key: value`, one per line, no quotes needed. Any field you leave blank is
simply left out of the page rather than shown empty.

---

## content/projects/

Copy `_TEMPLATE.md`, rename it, fill it in.

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown as the page heading |
| `slug` | yes | The URL. Match the filename |
| `group` | yes | Grouping label on the Work section |
| `order` | yes | Sort position, lowest first. Missing → 99 |
| `year` | – | Metadata block, bottom of the page |
| `location` | – | Metadata block |
| `type` | – | Metadata block |
| `status` | – | Metadata block. Be honest: "Prototype", not "Released" |
| `role` | – | Metadata block. Your contribution must always be identifiable |
| `team` | – | Metadata block. Never imply sole authorship of shared work |
| `tools` | – | Metadata block. Comma-separated |
| `employer` | – | Held but not displayed in the metadata block |
| `cover` | – | Card image, e.g. `/images/compar-cover.jpg` |
| `tags` | – | Comma-separated. Drives the filter on the Work index (`/projects`) |
| `summary` | – | One line, shown on the card |
| `demoUrl` | – | Only if a live demo genuinely exists |
| `demoNote` | – | Caveat shown next to the demo link |

The metadata rows render in this fixed order: Year, Location, Type, Status,
Role, Team, Tools.

## content/articles/

Copy `_TEMPLATE.md`, rename it, fill it in.

| Field | Required | Notes |
|---|---|---|
| `title` | – | Falls back to the first `# heading` in the body. Wrap in quotes if it contains a colon |
| `subtitle` | – | One line under the title |
| `source` | – | Where it was originally published. Always credit it |
| `sourceUrl` | – | Link to the original. Must resolve — check it |
| `date` | – | Year or full date |
| `tags` | – | Comma-separated |

Two kinds of entry belong here, and it is worth keeping them apart in your
head: **reference library** — external research you did not write, credited to
its publisher; and **independent research** — your own writing. Anything from
the first kind must carry `source` and a working `sourceUrl`, or it should not
be published at all.

**What does not belong here.** Commentary on other architects' built projects —
the ArchDaily-style write-up of someone else's building. It reads as content
volume rather than position, it puts other people's work on a page that exists
to show yours, and none of it survives the question *why is this here?*
Research on this site means industry research into AI and computational
practice: surveys, reports, primary sources on how the profession actually
works. Chaos and Architizer, not project features.

---

## Body syntax

The renderer is deliberately narrow. This is the complete list of what works:

```
## Heading                      section heading
### Heading                     sub-heading

Plain paragraph text.           blank line between paragraphs

**bold**   `code`   *italic*
[link text](https://…)

- bullet
1. numbered

> quoted line

| Column | Column |         table — the |---|---| separator row is required
|---|---|
| cell   | cell   |

```code fence```

![alt text](/images/compar-01.jpg)
```

**Images have one behaviour worth knowing.** A single image line renders full
width with its alt text as a caption underneath. Two or more image lines in a
row render as a two-per-row grid that opens a lightbox on click. A blank line
between them does not break the run — only a line of text does. So:

```
![Site diagram](/images/compar-01.jpg)     → one full-width figure

![Massing study](/images/compar-02.jpg)    → a 2-column grid,
![Circulation](/images/compar-03.jpg)        click to enlarge
![Programme](/images/compar-04.jpg)
```

**Research figures.** A `::figure` line renders a full-width board at the wider
column measure (up to 1100px, while body text stays at 760px), with a separate
caption and alt text, and a click-to-expand lightbox. Use it for designed
boards and diagrams that carry small type — not for photographs, which the
plain `![alt](src)` form handles.

```
::figure /images/diagram.webp | Alt text for screen readers | Figure 01. The caption printed underneath.
```

Export boards as WebP at roughly twice the display width — 2200px or more —
since the embedded type is small. Keep the board's own background; do not add
a frame, shadow or overlay, because the board already carries its own.

Video, rarely needed:

```
::video /media/walkthrough.mp4 | /images/synantics-poster.jpg | Caption text
```

### Marking something unverified

```
{{CONFIRM: check the completion year against the contract}}
```

This renders only in local development and never on the live site. Use it
anywhere you are not certain of a fact rather than guessing — a number, a
date, a credit, a status. It is the safety valve that keeps unverified claims
off a page your employers may send to clients.

---

## Images

Images stay in `public/images/`, flat, named after the project:

```
public/images/
├─ compar-cover.jpg      the card image
├─ compar-01.jpg         body images, numbered upward
├─ compar-02.jpg
└─ synantics-cover.jpg
```

Reference them from Markdown as `/images/compar-01.jpg` — leading slash, no
`public` in the path.

Rules: lowercase, hyphens, `.jpg` for photographs and renders, `.png` only
where transparency is needed. Resize before adding — nothing on this site
needs to be wider than 2000px, and large files are the fastest way to make a
premium-looking page feel slow.

Always write real alt text. `![](…)` produces an image with no caption and no
description for anyone using a screen reader.

---

## Adding a new project, start to finish

1. Put the images in `public/images/` as `<slug>-cover.jpg`, `<slug>-01.jpg`, …
2. Copy `content/projects/_TEMPLATE.md` to `content/projects/<slug>.md`.
3. Fill in the frontmatter. Set `order` to where it should sit among the others.
4. Write the body. Mark anything unverified with `{{CONFIRM: …}}`.
5. `npm run build` — if it succeeds, the page exists at `/projects/<slug>`.

Adding an article is the same without step 1.
