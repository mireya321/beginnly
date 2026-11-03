import { useState } from 'react'
import { Check } from 'lucide-react'
import Arrow from './Arrow'
import { subscribe, TRACK_OPTIONS } from '../lib/subscribe'

// The email + category form. Used on the board and on every job page.
// compact = email only (for the small lime card).
export default function SubscribeForm({ compact = false, defaultCategory = 'all' }) {
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState(defaultCategory)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const res = await subscribe(email, category)
    setBusy(false)
    if (res.ok) setDone(true)
    else setError(res.message)
  }

  if (done) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-white/70 p-4 text-ink">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Check size={14} strokeWidth={3} />
        </span>
        <div>
          <p className="font-semibold">You're on the list.</p>
          <p className="text-sm text-slate">
            We'll email you once a week with new entry-level jobs.
          </p>
        </div>
      </div>
    )
  }

  const field =
    'w-full rounded-2xl border border-line bg-paper-2 px-5 py-4 text-base text-ink outline-none transition placeholder:text-slate/70 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20'

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-ink">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={field}
        />
      </label>

      {!compact && (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">Job category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            {TRACK_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}

      <button type="submit" disabled={busy} className="btn btn-dark disabled:opacity-60">
        {busy ? 'Saving…' : 'Send me jobs'}
        <Arrow size={15} />
      </button>
      {!compact && <p className="text-xs text-slate">One email a week. Unsubscribe anytime.</p>}
    </form>
  )
}