import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, CheckCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { primaryBtn } from '../components/AuthShell'
import { useAuth } from '../lib/auth'
import { CATEGORIES } from '../config'
import { getPlan } from '../lib/plans'
import { fetchMyJobs, closeJob, startCheckout, displayStatus } from '../lib/employer'

const PILL = {
  live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-soft text-muted border-line',
  expired: 'bg-soft text-muted border-line',
}

const catLabel = (v) => CATEGORIES.find((c) => c.value === v)?.label || 'Company direct'
const daysLeft = (j) =>
  j.expires_at ? Math.max(0, Math.ceil((new Date(j.expires_at) - Date.now()) / 86400000)) : null

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="text-xs font-bold uppercase text-muted">{label}</div>
      <div className="mt-2 text-2xl font-bold text-dark">{value}</div>
    </div>
  )
}

export default function Employer() {
  const { employer, signOut } = useAuth()
  const [params] = useSearchParams()
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    fetchMyJobs().then(setJobs).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  // After paying, the webhook can take a few seconds: refresh until live
  useEffect(() => {
    if (!params.get('paid')) return
    const t = [2000, 5000, 10000].map((ms) => setTimeout(load, ms))
    return () => t.forEach(clearTimeout)
  }, [params, load])

  const act = async (id, fn) => {
    setBusyId(id)
    setError('')
    try {
      await fn()
      load()
    } catch (e) {
      setError(e.message)
    }
    setBusyId(null)
  }

  const rows = jobs || []
  const live = rows.filter((j) => displayStatus(j).key === 'live')
  const waiting = rows.filter((j) => j.status === 'draft')
  const soonest = live.map(daysLeft).filter((d) => d !== null).sort((a, b) => a - b)[0]

  return (
    <Layout>
      <section className="relative z-10 py-12">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-dark">Employer dashboard</h1>
              <p className="mt-1 text-sm text-muted">{employer?.company_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={signOut} className="whitespace-nowrap rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-dark hover:bg-soft">
                Log out
              </button>
              <Link to="/employer/post" className={primaryBtn}>
                <Plus size={16} /> Post new role
              </Link>
            </div>
          </div>

          {params.get('paid') && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
              <CheckCircle2 size={18} /> Payment received. Your listing goes live in a few seconds.
            </div>
          )}
          {params.get('canceled') && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              Checkout was canceled. Your role is saved below; pay to publish it.
            </div>
          )}
          {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total listings" value={rows.length} />
            <Stat label="Live now" value={live.length} />
            <Stat label="Awaiting payment" value={waiting.length} />
            <Stat label="Next expiry" value={soonest === undefined ? '—' : `${soonest} days`} />
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <div className="border-b border-soft p-6">
              <h2 className="text-base font-bold text-dark">Your listings</h2>
            </div>
            {jobs === null ? (
              <p className="p-8 text-sm text-muted">Loading…</p>
            ) : rows.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-muted">You have not posted a role yet.</p>
                <Link to="/employer/post" className={`${primaryBtn} mt-4`}>Post your first role</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-page text-xs uppercase text-muted">
                    <tr>
                      <th className="px-6 py-3 font-bold">Role</th>
                      <th className="px-6 py-3 font-bold">Category</th>
                      <th className="px-6 py-3 font-bold">Plan</th>
                      <th className="px-6 py-3 font-bold">Days left</th>
                      <th className="px-6 py-3 font-bold">Status</th>
                      <th className="px-6 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft">
                    {rows.map((j) => {
                      const st = displayStatus(j)
                      const left = st.key === 'live' ? daysLeft(j) : null
                      return (
                        <tr key={j.id}>
                          <td className="px-6 py-4 font-bold text-dark">{j.title}</td>
                          <td className="px-6 py-4 text-muted">{catLabel(j.category)}</td>
                          <td className="px-6 py-4 text-muted">{getPlan(j.plan)?.name || '—'}</td>
                          <td className="px-6 py-4 font-mono text-xs text-muted">{left ?? '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${PILL[st.key]}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-bold">
                            {st.key === 'live' && (
                              <Link to={`/jobs/${j.id}`} className="mr-4 text-muted hover:text-dark">View</Link>
                            )}
                            {st.key !== 'closed' && st.key !== 'expired' && (
                              <Link to={`/employer/post/${j.id}`} className="mr-4 text-indigo-600 hover:underline">Edit</Link>
                            )}
                            {st.key === 'draft' && (
                              <button disabled={busyId === j.id} onClick={() => act(j.id, () => startCheckout(j.id))}
                                className="mr-4 text-emerald-700 hover:underline">
                                Pay &amp; publish
                              </button>
                            )}
                            {st.key !== 'closed' && st.key !== 'expired' && (
                              <button disabled={busyId === j.id}
                                onClick={() => window.confirm('Close this listing? This cannot be undone.') && act(j.id, () => closeJob(j.id))}
                                className="text-rose-600 hover:underline">
                                Close
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}