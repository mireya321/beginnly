// POST /api/stripe-webhook  (called by Stripe, not by the website)
// When a payment completes, makes the employer's job live.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getPlan } from '../src/lib/plans.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false } }
)

async function rawBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  let event
  try {
    const body = await rawBody(req)
    event = stripe.webhooks.constructEvent(
      body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (e) {
    console.error('bad signature', e.message)
    return res.status(400).send('Invalid signature')
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.payment_status === 'paid') {
      const jobId = session.metadata?.job_id
      const { data: job } = await supabase
        .from('jobs')
        .select('id, plan, status, stripe_session_id')
        .eq('id', jobId)
        .maybeSingle()

      const plan = getPlan(job?.plan)
      if (job && plan && job.status === 'draft') {
        const now = new Date()
        const { error } = await supabase
          .from('jobs')
          .update({
            status: 'live',
            is_active: true,
            featured: plan.featured,
            date_posted: now.toISOString(),
            expires_at: new Date(now.getTime() + plan.days * 86400000).toISOString(),
          })
          .eq('id', job.id)
        if (error) {
          console.error('could not publish job', error)
          return res.status(500).send('Could not publish')
        }
      }
    }
  }

  return res.status(200).json({ received: true })
}