import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

/**
 * Contact form endpoint.
 *
 * Everything arrives at hello@layeroff.ai with Reply-To set to the visitor, so
 * answering is a plain reply. Nothing is stored: the message is passed to
 * Resend and forgotten.
 *
 * Note that vercel.json rewrites every path to index.html for the SPA router —
 * the pattern there excludes /api/, otherwise this file is never reached and
 * the form silently receives the HTML shell instead.
 */

const TO = 'hello@layeroff.ai';

/**
 * Resend will only send from a verified domain. Until layeroff.ai is verified
 * in the Resend dashboard, their shared onboarding sender works for testing.
 */
const FROM = process.env.CONTACT_FROM ?? 'LayerOff <onboarding@resend.dev>';

const LIMITS = { name: 120, email: 200, subject: 200, message: 5000 };

/** Requests per IP per window. Deliberately generous — this stops floods, not people. */
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };

/**
 * In-memory rate limiting.
 *
 * Serverless instances are recycled and run in parallel, so this is a speed
 * bump rather than a guarantee — a determined flood spread across cold starts
 * gets through. It is enough for a portfolio contact form, and it costs no
 * infrastructure. If real spam arrives, move this to Vercel KV before reaching
 * for a CAPTCHA.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound across a warm instance's life.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE.max;
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

/** Header injection guard: a newline in a header would let a sender add their own. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) ?? {};
  const name = singleLine(String(body.name ?? ''));
  const email = singleLine(String(body.email ?? ''));
  const subject = singleLine(String(body.subject ?? ''));
  const message = String(body.message ?? '').trim();
  const consent = body.consent === true;
  const honeypot = String(body.company ?? '').trim();

  // Honeypot: a real visitor never sees this field, so anything in it is a bot.
  // Answer 200 so the bot cannot tell it was caught and retune.
  if (honeypot) return res.status(200).json({ ok: true });

  if (!email || !isEmail(email)) return res.status(400).json({ error: 'invalid_email' });
  if (!message) return res.status(400).json({ error: 'missing_message' });
  if (!consent) return res.status(400).json({ error: 'consent_required' });

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return res.status(400).json({ error: 'too_long' });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded ?? '')
    .split(',')[0]
    .trim();
  if (ip && rateLimited(ip)) return res.status(429).json({ error: 'rate_limited' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set — contact form cannot send.');
    return res.status(500).json({ error: 'not_configured' });
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: subject || `Website message from ${name || email}`,
      text: [
        `Name:    ${name || '—'}`,
        `Email:   ${email}`,
        `Subject: ${subject || '—'}`,
        '',
        message,
      ].join('\n'),
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(name) || '&mdash;'}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Subject:</strong> ${escapeHtml(subject) || '&mdash;'}</p>`,
        `<hr />`,
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      ].join(''),
    });

    if (error) {
      console.error('Resend rejected the message:', error);
      return res.status(502).json({ error: 'send_failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (cause) {
    console.error('Contact form failed:', cause);
    return res.status(502).json({ error: 'send_failed' });
  }
}
