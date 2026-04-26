import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const contactEmail = process.env.CONTACT_TO_EMAIL || 'jespersjostrom2@gmail.com'
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

interface ContactRequestBody {
  name?: string
  email?: string
  projectType?: string
  budget?: string
  message?: string
}

export async function POST(request: Request) {
  console.log('[Contact API] POST /api/contact received')

  if (!process.env.RESEND_API_KEY) {
    console.error('[Contact API] RESEND_API_KEY is missing')
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 })
  }

  try {
    const body = (await request.json()) as ContactRequestBody
    const name = body.name?.trim()
    const email = body.email?.trim()
    const projectType = body.projectType?.trim()
    const budget = body.budget?.trim()
    const message = body.message?.trim()

    console.log('[Contact API] Parsed contact state', {
      name,
      email,
      projectType,
      hasBudget: Boolean(budget),
      messageLength: message?.length || 0,
      contactEmail,
    })

    if (!name || !email || !projectType || !message) {
      console.warn('[Contact API] Validation failed')
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    console.log('[Contact API] Sending email via Resend')

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
      return NextResponse.json(
        { error: result.error.message || 'Could not send message. Please try again.' },
        { status: 500 },
      )
    }

    console.log('[Contact API] Email sent successfully', { id: result.data?.id })

    return NextResponse.json({ ok: true, id: result.data?.id })
  } catch (error) {
    console.error('[Contact API] Unexpected send error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected contact form error.' },
      { status: 500 },
    )
  }
}
