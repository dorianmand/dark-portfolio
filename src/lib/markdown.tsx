import type { ReactNode } from 'react';
import { Figure } from '../components/Figure';
import { ImageGrid, type GridImage } from '../components/ImageGrid';

/**
 * A narrow Markdown renderer, scoped to the syntax used in content/.
 * Headings, paragraphs, lists, tables, fenced code, images and inline emphasis.
 * Deliberately not a general-purpose parser — see CLAUDE.md, "Technical workflow".
 */

export type Frontmatter = Record<string, string>;

export function parseFrontmatter(raw: string): {
  data: Frontmatter;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    // A value may be quoted so it can contain a colon — "Title: Subtitle".
    const value = line
      .slice(sep + 1)
      .trim()
      .replace(/^(["'])([\s\S]*)\1$/, '$2');
    if (key) data[key] = value;
  }

  return { data, body: match[2] };
}

const CONFIRM = /\{\{CONFIRM:([\s\S]*?)\}\}/g;

/**
 * Exported so short one-off strings outside the body pipeline (e.g. a
 * project's `summary` frontmatter) can carry an inline `[text](url)` link or
 * emphasis without pulling in the full block-level renderMarkdown parser.
 */
export function inline(text: string, keyPrefix: string): ReactNode[] {
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${i++}`;

    if (token.startsWith('**')) {
      out.push(
        <strong key={key} className="font-medium text-text-primary">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('`')) {
      out.push(
        <code
          key={key}
          className="rounded bg-stroke/[0.06] px-1.5 py-0.5 text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      out.push(
        <a
          key={key}
          href={linkMatch?.[2] ?? '#'}
          className="underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          {linkMatch?.[1]}
        </a>,
      );
    } else {
      out.push(
        <em key={key} className="font-display italic">
          {token.slice(1, -1)}
        </em>,
      );
    }

    last = match.index + token.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

export function renderMarkdown(body: string): ReactNode[] {
  const lines = body.split(/\r?\n/);
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const flushParagraph = (buffer: string[]) => {
    if (!buffer.length) return;
    // A line ending in two spaces is a Markdown hard break. It is kept as a
    // newline here so the paragraph can render it as <br>; every other line
    // soft-wraps into the one before it.
    const text = buffer
      .map((entry) => (/ {2,}$/.test(entry) ? `${entry.trim()}\n` : entry.trim()))
      .join(' ')
      .replace(/\n /g, '\n')
      .trim();
    buffer.length = 0;
    if (!text) return;

    const confirmMatch = text.match(/^\{\{CONFIRM:([\s\S]*)\}\}$/);
    if (confirmMatch) {
      // Editorial notes are a working aid, never public. They render during
      // development and are stripped from production builds entirely.
      if (!import.meta.env.DEV) return;

      out.push(
        <p
          key={`k${key++}`}
          className="my-6 border-l-2 border-accent/60 bg-accent/[0.06] px-5 py-3 text-sm text-muted"
        >
          <span className="mr-2 text-xs uppercase tracking-[0.2em] text-accent">
            To confirm
          </span>
          {confirmMatch[1].trim()}
        </p>,
      );
      return;
    }

    const cleaned = text.replace(CONFIRM, '');
    const parts = cleaned.split('\n');

    out.push(
      <p key={`k${key++}`} className="mb-6 leading-relaxed text-muted">
        {parts.map((part, n) => (
          <span key={n}>
            {n > 0 && <br />}
            {inline(part, `k${key}-${n}`)}
          </span>
        ))}
      </p>,
    );
  };

  const paragraph: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code
    if (line.trimStart().startsWith('```')) {
      flushParagraph(paragraph);
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <pre
          key={`k${key++}`}
          className="mb-8 overflow-x-auto border border-stroke/15 bg-stroke/[0.03] p-5 text-sm leading-relaxed text-muted"
        >
          <code>{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // ::figure /images/x.webp | alt text | Caption text
    // A full-width research figure: alt and caption are separate, and the
    // board opens in a lightbox because it carries type too small for a
    // body-width column.
    const figure = line.trim().match(/^::figure\s+(.+)$/);
    if (figure) {
      flushParagraph(paragraph);
      const [src, alt, caption] = figure[1].split('|').map((part) => part.trim());
      out.push(
        <Figure key={`k${key++}`} src={src} alt={alt ?? ''} caption={caption} />,
      );
      i++;
      continue;
    }

    // ::video /media/file.mp4 | /images/poster.jpg | caption
    const video = line.trim().match(/^::video\s+(.+)$/);
    if (video) {
      flushParagraph(paragraph);
      const [src, poster, caption] = video[1].split('|').map((s) => s.trim());
      out.push(
        <figure key={`k${key++}`} className="my-12">
          <video
            src={src}
            poster={poster || undefined}
            controls
            preload="none"
            playsInline
            className="w-full bg-stroke/[0.04]"
          />
          {caption && (
            <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
          )}
        </figure>,
      );
      i++;
      continue;
    }

    // Images: a run of consecutive image lines becomes a two-column grid with
    // a lightbox. A single image stays full width. Blank lines between images
    // do not break the run.
    const imageAt = (n: number) =>
      lines[n]?.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/) ?? null;

    if (imageAt(i)) {
      flushParagraph(paragraph);
      const run: GridImage[] = [];
      let j = i;

      while (j < lines.length) {
        const m = imageAt(j);
        if (m) {
          run.push({ alt: m[1], src: m[2] });
          j++;
        } else if (!lines[j].trim() && imageAt(j + 1)) {
          j++;
        } else {
          break;
        }
      }

      if (run.length === 1) {
        const only = run[0];
        out.push(
          <figure key={`k${key++}`} className="my-12">
            <img
              src={only.src}
              alt={only.alt}
              loading="lazy"
              className="w-full"
            />
            {only.alt && (
              <figcaption className="mt-3 text-sm text-muted">
                {only.alt}
              </figcaption>
            )}
          </figure>,
        );
      } else {
        out.push(<ImageGrid key={`k${key++}`} images={run} />);
      }

      i = j;
      continue;
    }

    // Table
    if (
      line.trim().startsWith('|') &&
      lines[i + 1]?.trim().match(/^\|[\s:|-]+\|$/)
    ) {
      flushParagraph(paragraph);
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      out.push(
        <div key={`k${key++}`} className="mb-10 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {head.map((cell, c) => (
                  <th
                    key={c}
                    className="border-b border-stroke/30 py-3 pr-6 text-xs font-normal uppercase tracking-[0.15em] text-muted"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="border-b border-stroke/12 py-3 pr-6 align-top text-muted"
                    >
                      {inline(cell, `t${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Blockquote — used for pull quotes such as the north star statement.
    if (line.trimStart().startsWith('>')) {
      flushParagraph(paragraph);
      const quote: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('>')) {
        quote.push(lines[i].trimStart().replace(/^>\s?/, ''));
        i++;
      }
      out.push(
        <blockquote
          key={`k${key++}`}
          className="my-10 border-l-2 border-accent/50 pl-6 text-lg leading-relaxed tracking-tight text-text-primary md:text-xl"
        >
          {inline(quote.join(' ').trim(), `q${key}`)}
        </blockquote>,
      );
      continue;
    }

    // Headings
    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flushParagraph(paragraph);
      const Tag = heading[1].length === 2 ? 'h2' : 'h3';
      out.push(
        <Tag
          key={`k${key++}`}
          className={
            Tag === 'h2'
              ? 'mb-5 mt-16 text-2xl tracking-tight text-text-primary md:text-3xl'
              : 'mb-4 mt-10 text-lg tracking-tight text-text-primary md:text-xl'
          }
        >
          {heading[2]}
        </Tag>,
      );
      i++;
      continue;
    }

    // Lists
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (bullet || numbered) {
      flushParagraph(paragraph);
      const ordered = Boolean(numbered);
      const items: string[] = [];
      while (i < lines.length) {
        const m = ordered
          ? lines[i].match(/^\s*\d+\.\s+(.*)$/)
          : lines[i].match(/^\s*[-*]\s+(.*)$/);
        if (m) {
          items.push(m[1]);
          i++;
        } else if (lines[i].match(/^\s{2,}\S/) && items.length) {
          items[items.length - 1] += ' ' + lines[i].trim();
          i++;
        } else {
          break;
        }
      }
      const ListTag = ordered ? 'ol' : 'ul';
      out.push(
        <ListTag
          key={`k${key++}`}
          className={`mb-8 space-y-2 pl-5 text-muted ${
            ordered ? 'list-decimal' : 'list-disc'
          } marker:text-muted/40`}
        >
          {items.map((item, n) => (
            <li key={n} className="leading-relaxed">
              {inline(item, `l${key}-${n}`)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    if (!line.trim()) {
      flushParagraph(paragraph);
      i++;
      continue;
    }

    // Only the leading indent is dropped — a trailing double space is a hard
    // break and has to survive as far as flushParagraph.
    paragraph.push(line.replace(/^\s+/, ''));
    i++;
  }

  flushParagraph(paragraph);
  return out;
}
