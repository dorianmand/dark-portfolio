import { useId, useRef, useState } from 'react';
import { useT } from '../lib/i18n';
import { useLang, LocalizedLink as Link } from '../lib/language';

/**
 * Contact form, posting to /api/contact.
 *
 * Deliberately small: four fields, a consent checkbox and a send button. The
 * email address stays visible underneath as a plain mailto, so the form is
 * never the only way through — if JavaScript fails or the endpoint is down,
 * there is still an address to write to.
 *
 * Entered content is never cleared on failure. Losing a written message to a
 * transient network error is the worst thing a form like this can do.
 */

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL = 'hello@layeroff.ai';
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

const FIELD =
  'mt-2 w-full border-b border-stroke/25 bg-transparent pb-2 text-base text-text-primary outline-none transition-colors placeholder:text-muted/50 focus:border-accent/70 focus-visible:outline-none';

const LABEL = 'block text-xs uppercase tracking-[0.2em] text-muted';

export function ContactForm() {
  const t = useT();
  const lang = useLang();
  const id = useId();

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  const errorId = `${id}-error`;
  const privacyHref = lang === 'de' ? '/datenschutz' : '/privacy';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? '').trim(),
      subject: String(data.get('subject') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      consent: data.get('consent') === 'on',
      // Honeypot. Hidden from sight and from assistive tech; only bots fill it.
      company: String(data.get('company') ?? ''),
    };

    // Validate here as well as on the server, so the first correction happens
    // without a round trip.
    const next: Record<string, string> = {};
    if (!isEmail(payload.email)) next.email = t('form.errorEmail');
    if (!payload.message) next.message = t('form.errorMessage');
    if (!payload.consent) next.consent = t('form.errorConsent');

    setFieldErrors(next);

    if (Object.keys(next).length) {
      setStatus('error');
      setError(null);

      // Focus by name, not by [aria-invalid]: that attribute only appears once
      // React has re-rendered with the new errors, which has not happened yet
      // at this point. Field order matches the visual order so focus lands on
      // the first problem, not an arbitrary one.
      const first = ['email', 'message', 'consent'].find((field) => next[field]);
      if (first) {
        form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      }
      return;
    }

    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('sent');
        form.reset();
        return;
      }

      const { error: code } = await response.json().catch(() => ({ error: '' }));
      setStatus('error');
      setError(code === 'rate_limited' ? t('form.errorRate') : t('form.errorSend'));
    } catch {
      setStatus('error');
      setError(t('form.errorSend'));
    }
  }

  if (status === 'sent') {
    return (
      <div className="max-w-xl">
        <p
          role="status"
          className="border-l border-accent/50 pl-4 text-base leading-relaxed text-text-primary"
        >
          {t('form.success')}
        </p>

        <MailFallback label={t('form.fallback')} />
      </div>
    );
  }

  const invalid = (field: string) => Boolean(fieldErrors[field]);

  /** Ties a field to its message so screen readers announce the reason, not just "invalid". */
  const describedBy = (field: string) =>
    invalid(field) ? `${id}-${field}-error` : undefined;

  return (
    <div className="max-w-xl">
      <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
        {/* Honeypot. Off-screen rather than display:none — some bots skip
            hidden inputs — and hidden from assistive tech so nobody using a
            screen reader is asked to fill it in. */}
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor={`${id}-name`} className={LABEL}>
            {t('form.name')}{' '}
            <span className="text-muted/60 normal-case tracking-normal">
              ({t('form.optional')})
            </span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor={`${id}-email`} className={LABEL}>
            {t('form.email')}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={invalid('email') || undefined}
            aria-describedby={describedBy('email')}
            className={FIELD}
          />
          <FieldError id={`${id}-email-error`} message={fieldErrors.email} />
        </div>

        <div>
          <label htmlFor={`${id}-subject`} className={LABEL}>
            {t('form.subject')}{' '}
            <span className="text-muted/60 normal-case tracking-normal">
              ({t('form.optional')})
            </span>
          </label>
          <input id={`${id}-subject`} name="subject" type="text" className={FIELD} />
        </div>

        <div>
          <label htmlFor={`${id}-message`} className={LABEL}>
            {t('form.message')}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            required
            aria-invalid={invalid('message') || undefined}
            aria-describedby={describedBy('message')}
            className={`${FIELD} resize-y`}
          />
          <FieldError id={`${id}-message-error`} message={fieldErrors.message} />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id={`${id}-consent`}
              name="consent"
              type="checkbox"
              required
              aria-invalid={invalid('consent') || undefined}
              aria-describedby={describedBy('consent')}
              className="mt-1 h-4 w-4 shrink-0 accent-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <label
              htmlFor={`${id}-consent`}
              className="text-sm leading-relaxed text-muted"
            >
              {t('form.consent')}{' '}
              <Link
                to={privacyHref}
                className="underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {t('form.consentLink')}
              </Link>
            </label>
          </div>
          <FieldError id={`${id}-consent-error`} message={fieldErrors.consent} />
        </div>

        {/* Submission-level failure, announced when it appears. */}
        <div aria-live="polite">
          {error && (
            <p id={errorId} className="border-l border-accent/60 pl-4 text-sm leading-relaxed text-text-primary">
              <span className="block text-xs uppercase tracking-[0.2em] text-muted">
                {t('form.errorHeading')}
              </span>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="text-sm uppercase tracking-[0.2em] text-text-primary underline underline-offset-8 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50"
        >
          {status === 'sending' ? t('form.sending') : t('form.send')}
        </button>
      </form>

      <MailFallback label={t('form.fallback')} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-text-primary">
      {message}
    </p>
  );
}

/** The address stays visible whether or not the form works. */
function MailFallback({ label }: { label: string }) {
  return (
    <p className="mt-10 text-sm text-muted">
      {label}{' '}
      <a
        href={`mailto:${EMAIL}`}
        className="text-text-primary underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {EMAIL}
      </a>
    </p>
  );
}
