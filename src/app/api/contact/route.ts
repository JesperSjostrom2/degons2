import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { SITE_URL } from '@/lib/site-config'

/* Everything the client sees on failure is this one string. Resend error
   messages (unverified domain, quota, malformed address) describe our
   infrastructure and belong in the server log, not in an anonymous caller's
   response body. */
const GENERIC_ERROR = 'Could not send message. Please try again.'

/* Mirrored by the maxLength attributes in ContactSection.tsx — keep in sync. */
const FIELD_LIMITS = {
  name: 100,
  email: 254,
  projectType: 100,
  budget: 100,
  message: 5000,
} as const

/* Pragmatic shape check, not RFC 5322 — the value only has to be sane enough
   to sit in a replyTo header. Resend rejects anything it can't deliver to. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MAX_BODY_BYTES = 10_000

/* Best-effort abuse damper, not a guarantee: the map lives per serverless
   instance and resets on every cold start. Good enough to stop casual loops
   from burning the Resend quota; if real abuse shows up, move to a shared
   store (e.g. Upstash). */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const rateLimitHits = new Map<string, number[]>()

const isRateLimited = (key: string) => {
  const now = Date.now()

  for (const [existingKey, hits] of rateLimitHits) {
    const fresh = hits.filter((time) => now - time < RATE_LIMIT_WINDOW_MS)
    if (fresh.length === 0) {
      rateLimitHits.delete(existingKey)
    } else {
      rateLimitHits.set(existingKey, fresh)
    }
  }

  const hits = rateLimitHits.get(key) ?? []
  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  hits.push(now)
  rateLimitHits.set(key, hits)
  return false
}

/* Reject only a *mismatched* Origin, never a missing one — some privacy tools
   strip the header, and non-browser clients never send it. This is CSRF-style
   hygiene, not authentication. */
const isDisallowedOrigin = (originHeader: string | null) => {
  if (!originHeader) {
    return false
  }

  try {
    const { hostname } = new URL(originHeader)
    const siteHost = new URL(SITE_URL).hostname

    return (
      hostname !== siteHost &&
      hostname !== siteHost.replace(/^www\./, '') &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    )
  } catch {
    return true
  }
}

const readField = (value: unknown, limit: number) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > limit ? null : trimmed
}

export async function POST(request: Request) {
  /* No silent fallbacks: a missing address must fail loudly instead of
     quietly routing production mail to a personal inbox or Resend's shared
     sandbox sender. */
  const contactEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!process.env.RESEND_API_KEY || !contactEmail || !fromEmail) {
    console.error(
      '[Contact API] Missing env config',
      {
        hasApiKey: Boolean(process.env.RESEND_API_KEY),
        hasToEmail: Boolean(contactEmail),
        hasFromEmail: Boolean(fromEmail),
      },
    )
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 })
  }

  if (isDisallowedOrigin(request.headers.get('origin'))) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 })
  }

  const clientKey = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many messages in a short time. Please wait a few minutes and try again.' },
      { status: 429 },
    )
  }

  try {
    const rawBody = await request.text()
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 413 })
    }

    const body: unknown = JSON.parse(rawBody)
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
    }

    const fields = body as Record<string, unknown>

    /* Honeypot: humans never see the `company` input. A filled value gets a
       fake success so bots have nothing to iterate against. */
    if (typeof fields.company === 'string' && fields.company.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const name = readField(fields.name, FIELD_LIMITS.name)
    const email = readField(fields.email, FIELD_LIMITS.email)
    const projectType = readField(fields.projectType, FIELD_LIMITS.projectType)
    const budget = readField(fields.budget ?? '', FIELD_LIMITS.budget)
    const message = readField(fields.message, FIELD_LIMITS.message)

    if (!name || !email || !projectType || !message || budget === null) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject: `Project inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType}`,
        `Budget / timeline: ${budget || 'Not specified'}`,
        '',
        message,
      ].join('\n'),
    })

    if (result.error) {
      console.error('[Contact API] Resend send failed', result.error)
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: result.data?.id })
  } catch (error) {
    console.error('[Contact API] Unexpected send error', error)
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 })
  }
}
