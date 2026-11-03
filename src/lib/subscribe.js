import { supabase } from './supabase'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Saves an email for the weekly job email.
// Returns { ok: true } or { ok: false, message }
export async function subscribe(email, category) {
  const clean = String(email || '').trim().toLowerCase()
  if (!EMAIL.test(clean)) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }
  const { error } = await supabase.from('subscribers').insert({
    email: clean,
    category: category || 'all',
  })
  // 23505 = this email is already on the list. Treat that as success.
  if (error && error.code !== '23505') {
    return { ok: false, message: 'Something went wrong. Please try again.' }
  }
  return { ok: true }
}

export async function unsubscribe(token) {
  const { data, error } = await supabase.rpc('unsubscribe_by_token', { p_token: token })
  if (error) return false
  return data === true
}

// What people can pick for their weekly email. The values match the TRACKS
// in tools.js, so the weekly email can match jobs by title.
export const TRACK_OPTIONS = [
  ['all', 'All categories'],
  ['data', 'Data & analytics'],
  ['software', 'Software & IT'],
  ['marketing', 'Marketing & content'],
  ['sales', 'Sales'],
  ['support', 'Customer support'],
  ['admin', 'Admin & office'],
  ['finance', 'Finance & accounting'],
  ['design', 'Design'],
  ['hr', 'HR & recruiting'],
  ['operations', 'Operations'],
  ['teaching', 'Teaching & training'],
]