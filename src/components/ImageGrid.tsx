import { useCallback, useEffect, useState } from 'react';

export type GridImage = { src: string; alt: string };

/**
 * Two-column image grid with a click-to-enlarge lightbox.
 * Used for runs of consecutive images in project Markdown — see lib/markdown.tsx.
 */
export function ImageGrid({ images }: { images: GridImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);

  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null
          ? null
          : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  if (!images.length) return null;

  const active = open === null ? null : images[open];

  return (
    <>
      <ul className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge: ${image.alt || 'image'}`}
              className="group block w-full text-left"
            >
              <span className="block">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full"
                />
              </span>

              {image.alt && (
                <span className="mt-2 block text-sm leading-relaxed text-muted">
                  {image.alt}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt || 'Enlarged image'}
          className="fixed inset-0 z-[100] flex flex-col bg-bg/97 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-start justify-between px-6 py-5 md:px-10">
            <p className="max-w-3xl pr-6 text-sm leading-relaxed text-muted">
              {active.alt}
              <span className="ml-3 text-muted/50">
                {(open ?? 0) + 1} / {images.length}
              </span>
            </p>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="shrink-0 text-sm uppercase tracking-[0.2em] text-muted transition-colors hover:text-text-primary"
            >
              Close ✕
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center px-4 pb-8 md:px-10"
            onClick={(event) => event.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="shrink-0 px-3 py-6 text-2xl text-muted transition-colors hover:text-text-primary"
              >
                ←
              </button>
            )}

            <img
              src={active.src}
              alt={active.alt}
              className="max-h-full min-h-0 w-auto max-w-full object-contain"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="shrink-0 px-3 py-6 text-2xl text-muted transition-colors hover:text-text-primary"
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
