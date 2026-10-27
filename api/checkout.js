// POST /api/checkout  { jobId }  (Authorization: Bearer <supabase access token>)
// Creates a Stripe Checkout session for an employer's draft job.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getPlan } from '../src/lib/plans.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    // Tell the owner exactly which setting is missing (names only, never values)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const missing = [
      !process.env.STRIPE_SECRET_KEY && 'STRIPE_SECRET_KEY',
      !process.env.SUPABASE_SERVICE_KEY && 'SUPABASE_SERVICE_KEY',
      !supabaseUrl && 'VITE_SUPABASE_URL',
    ].filter(Boolean)
    if (missing.length)
      return res.status(500).json({ error: `Missing setting in Vercel: ${missing.join(', ')}` })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    })

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
    if (!token) return res.status(401).json({ error: 'Please log in again' })

    const { data: auth, error: authError } = await supabase.auth.getUser(token)
    if (authError || !auth?.user) return res.status(401).json({ error: 'Please log in again' })
    const user = auth.user

    const jobId = req.body?.jobId
    if (!jobId) return res.status(400).json({ error: 'Missing job' })

    const { data: job, error } = await supabase
      .from('jobs')
      .select('id, title, plan, status, employer_id')
      .eq('id', jobId)
      .maybeSingle()
    if (error || !job || job.employer_id !== user.id)
      return res.status(404).json({ error: 'Job not found' })
    if (job.status !== 'draft')
      return res.status(400).json({ error: 'This job is already paid for' })

    const plan = getPlan(job.plan)
    if (!plan) return res.status(400).json({ error: 'Unknown plan' })

    const origin =
      process.env.SITE_URL || req.headers.origin || `https://${req.headers.host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      managed_payments: { enabled: false },
      customer_email: user.email,
      client_reference_id: job.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: plan.price * 100,
            product_data: {
              name: `${plan.name} job listing`,
              description: `${job.title} · live for ${plan.days} days`,
            },
          },
        },
      ],
      metadata: { job_id: job.id, plan: plan.id },
      success_url: `${origin}/employer?paid=1`,
      cancel_url: `${origin}/employer?canceled=1`,
    })

    await supabase.from('jobs').update({ stripe_session_id: session.id }).eq('id', job.id)
    return res.status(200).json({ url: session.url })
  } catch (e) {
    console.error('checkout error', e)
    return res.status(500).json({ error: `Checkout failed: ${e.message}` })
  }
}
