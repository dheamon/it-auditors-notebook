import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Log for now; replace with email provider (Resend, SendGrid) when ready
    console.log('Contact form submission:', { name, email, subject, message: message.slice(0, 100) })

    // TODO: Integrate Resend or SendGrid
    // await resend.emails.send({ from: '...', to: '...', subject: `Contact: ${subject}`, text: `...` })

    return NextResponse.json({ message: 'Message sent successfully.' })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
