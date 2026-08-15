type TagFilterProps = {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
  label?: string;
};

export function TagFilter({ tags, active, onChange, label = 'Filter' }: TagFilterProps) {
  if (!tags.length) return null;

  return (
    <div className="mb-12">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">{label}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={active === null}
          className={`text-sm transition-colors ${
            active === null
              ? 'text-text-primary underline underline-offset-8'
              : 'text-muted hover:text-text-primary'
          }`}
        >
          All
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(active === tag ? null : tag)}
            aria-pressed={active === tag}
            className={`text-sm transition-colors ${
              active === tag
                ? 'text-text-primary underline underline-offset-8'
                : 'text-muted hover:text-text-primary'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Inline, non-interactive tag list for cards and article headers. */
export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {tags.map((tag) => (
        <li
          key={tag}
          className="text-xs uppercase tracking-[0.15em] text-muted/70"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
