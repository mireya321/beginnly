import { supabase } from './supabase'
import { EXPERIENCE_LEVELS } from '../config'

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Plain text from the form -> the simple HTML the site already displays.
// Blank line = new paragraph. Lines starting with "-" or "•" become bullets.
export function textToHtml(text) {
  const blocks = (text || '').replace(/\r/g, '').split(/\n{2,}/)
  return blocks
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
      if (lines.every((l) => /^[-•*]\s+/.test(l))) {
        return `<ul>${lines
          .map((l) => `<li>${escapeHtml(l.replace(/^[-•*]\s+/, ''))}</li>`)
          .join('')}</ul>`
      }
      return `<p>${lines.map(escapeHtml).join('<br>')}</p>`
    })
    .join('')
}

export function salaryText(min, max, period) {
  const fmt = (n) => `$${Number(n).toLocaleString('en-US')}`
  const unit = period === 'hour' ? '/ hr' : '/ yr'
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${unit}`
  if (min) return `From ${fmt(min)} ${unit}`
  if (max) return `Up to ${fmt(max)} ${unit}`
  return null
}

// The database stores the first value for each level (see config.js)
export const levelValue = (label) =>
  EXPERIENCE_LEVELS.find((l) => l.label === label)?.values[0] || null

export const levelLabelFromValue = (value) =>
  EXPERIENCE_LEVELS.find((l) => l.values.includes(value))?.label || ''

const MY_COLUMNS =
  'id, title, company, location, category, experience_level, salary_text, salary_min, salary_max, url, description_text, status, is_active, plan, featured, date_posted, expires_at, created_at'

export async function fetchMyJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select(MY_COLUMNS)
    .eq('source', 'employer')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchMyJob(id) {
  const { data, error } = await supabase
    .from('jobs')
    .select(MY_COLUMNS)
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createDraft(fields) {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...fields, source: 'employer', status: 'draft', is_active: false })
    .select('id')
    .single()
  if (error) throw error
  return data
}

export async function updateJob(id, fields) {
  const { error } = await supabase.from('jobs').update(fields).eq('id', id)
  if (error) throw error
}

export async function closeJob(id) {
  const { error } = await supabase.rpc('close_job', { p_id: id })
  if (error) throw error
}

// Asks our server for a Stripe Checkout link, then sends the employer there.
export async function startCheckout(jobId) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobId }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.url) throw new Error(body.error || 'Could not start checkout')
  window.location.href = body.url
}

// Display status for the dashboard
export function displayStatus(job) {
  if (job.status === 'draft') return { key: 'draft', label: 'Awaiting payment' }
  if (job.status === 'closed') return { key: 'closed', label: 'Closed' }
  if (job.expires_at && new Date(job.expires_at) < new Date())
    return { key: 'expired', label: 'Expired' }
  if (job.status === 'live' && job.is_active) return { key: 'live', label: 'Live' }
  return { key: 'closed', label: job.status || 'Unknown' }
}