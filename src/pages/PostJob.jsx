import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import Layout from '../components/Layout'
import { Field, inputClass, primaryBtn } from '../components/AuthShell'
import { useAuth } from '../lib/auth'
import { CATEGORIES, EXPERIENCE_LEVELS } from '../config'
import { PLANS } from '../lib/plans'
import {
  createDraft, updateJob, fetchMyJob, startCheckout,
  textToHtml, salaryText, levelValue, levelLabelFromValue,
} from '../lib/employer'

const LEVELS = EXPERIENCE_LEVELS.filter((l) => l.values.length)
const EMPTY = {
  title: '', location: '', category: 'company-direct', level: LEVELS[0].label,
  payMin: '', payMax: '', period: 'year', applyUrl: '', description: '', plan: 'standard',
}

export default function PostJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, employer } = useAuth()
  const [f, setF] = useState(EMPTY)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    if (!id) return
    fetchMyJob(id).then((j) => {
      if (!j) return navigate('/employer', { replace: true })
      setStatus(j.status)
      setF({
        title: j.title || '', location: j.location || '', category: j.category || 'company-direct',
        level: levelLabelFromValue(j.experience_level) || LEVELS[0].label,
        payMin: j.salary_min || '', payMax: j.salary_max || '',
        period: j.salary_text?.includes('/ hr') ? 'hour' : 'year',
        applyUrl: j.url || '', description: j.description_text || '', plan: j.plan || 'standard',
      })
      setLoading(false)
    }).catch((e) => { setError(e.message); setLoading(false) })
  }, [id, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (f.description.trim().length < 50) return setError('Add a longer description (at least 50 characters).')
    const min = f.payMin ? Number(f.payMin) : null
    const max = f.payMax ? Number(f.payMax) : null
    if (min && max && min > max) return setError('Minimum pay is higher than maximum pay.')
    setBusy(true)
    const fields = {
      title: f.title.trim(),
      company: employer?.company_name || '',
      location: f.location.trim(),
      category: f.category,
      experience_level: levelValue(f.level),
      salary_min: min, salary_max: max,
      salary_text: salaryText(min, max, f.period),
      url: f.applyUrl.trim(),
      description_text: f.description,
      description: textToHtml(f.description),
    }
    try {
      let jobId = id
      if (id) {
        await updateJob(id, fields)
      } else {
        const row = await createDraft({ ...fields, plan: f.plan, employer_id: user.id })
        jobId = row.id
      }
      if (status === 'live') return navigate('/employer')
      await startCheckout(jobId)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (loading) return <Layout><p className="p-16 text-center text-sm text-muted">Loading…</p></Layout>
  const isLive = status === 'live'

  return (
    <Layout>
      <section className="relative z-10 py-12">
        <div className="wrap max-w-3xl">
          <Link to="/employer" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-dark">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="text-2xl font-medium text-dark">{id ? 'Edit role' : 'Post a new role'}</h1>

          <form onSubmit={submit} className="mt-6 space-y-6">
            <div className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-sm">
              <Field label="Role title">
                <input required value={f.title} onChange={set('title')} className={inputClass} placeholder="Junior Marketing Coordinator" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location">
                  <input required value={f.location} onChange={set('location')} className={inputClass} placeholder="Austin, TX or Remote" />
                </Field>
                <Field label="Category">
                  <select value={f.category} onChange={set('category')} className={inputClass}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Experience level required" hint="Shown to candidates with a Verified badge.">
                <select value={f.level} onChange={set('level')} className={inputClass}>
                  {LEVELS.map((l) => <option key={l.label} value={l.label}>{l.label} ({l.hint})</option>)}
                </select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Pay from (USD)">
                  <input type="number" min="0" value={f.payMin} onChange={set('payMin')} className={inputClass} />
                </Field>
                <Field label="Pay to (USD)">
                  <input type="number" min="0" value={f.payMax} onChange={set('payMax')} className={inputClass} />
                </Field>
                <Field label="Per">
                  <select value={f.period} onChange={set('period')} className={inputClass}>
                    <option value="year">Year</option>
                    <option value="hour">Hour</option>
                  </select>
                </Field>
              </div>
              <Field label="Application link" hint="Candidates are sent to this page to apply.">
                <input type="url" required value={f.applyUrl} onChange={set('applyUrl')} className={inputClass} placeholder="https://yourcompany.com/careers/role" />
              </Field>
              <Field label="Description" hint="Blank line = new paragraph. Start lines with “-” for bullets.">
                <textarea required rows={10} value={f.description} onChange={set('description')} className={inputClass} />
              </Field>
            </div>

            {!id && (
              <div>
                <h2 className="mb-3 text-base font-bold text-dark">Choose a plan</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {PLANS.map((p) => (
                    <button type="button" key={p.id} onClick={() => setF((x) => ({ ...x, plan: p.id }))}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        f.plan === p.id ? 'border-dark bg-wash shadow-md' : 'border-line bg-white hover:border-brand'
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-muted">{p.name}</span>
                        {f.plan === p.id && <Check size={16} className="text-dark" />}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-dark">${p.price}</div>
                      <div className="mt-1 text-xs text-muted">{p.days} days{p.featured ? ' · pinned to top' : ''}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Working…' : id ? (isLive ? 'Save changes' : 'Save & continue to payment') : 'Continue to payment'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  )
}