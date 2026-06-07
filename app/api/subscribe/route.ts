import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const existing = await sanityClient.fetch(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email: email.toLowerCase() }
    )

    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed!' })
    }

    await sanityClient.create({
      _type: 'subscriber',
      email: email.toLowerCase().trim(),
      name: typeof name === 'string' ? name.trim() : '',
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "You're subscribed! Welcome to The IT Auditor's Notebook." })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }
}
