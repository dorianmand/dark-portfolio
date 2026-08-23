export type FigureProps = {
  src: string;
  /** Description for screen readers. Not shown. */
  alt: string;
  /** Printed under the figure. Rendered as-is, so it carries its own numbering. */
  caption?: string;
};

/**
 * A full-width research figure.
 *
 * These are composed presentation boards, not photographs: they arrive with
 * their own background, spacing and hierarchy already designed. So the frame
 * adds nothing except a hairline rule for separation from the page — no card,
 * no shadow, no hover treatment, no colour overlay. The board runs the full
 * width of the column, which is wide enough to resolve its type, so there is
 * no expand affordance.
 */
export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="my-16 md:my-20">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full"
      />

      {caption && (
        <figcaption className="mt-4 text-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
