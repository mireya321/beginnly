import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Info,
  ShieldCheck,
  Share2,
} from 'lucide-react'
import Layout from '../components/Layout'
import JobRow from '../components/JobRow'
import LevelBadge from '../components/LevelBadge'
import { fetchJob, fetchSimilar } from '../lib/jobs'
import { formatPay, levelLabel, categoryLabel } from '../lib/format'
import { descriptionToHtml } from '../lib/description'
import { MAX_AGE_DAYS, SITE_NAME } from '../config'

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const longDate = (v) =>
  new Date(v).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function JobPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | missing | error
  const [similar, setSimilar] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setJob(null)
    setSimilar([])

    if (!UUID.test(id)) {
      setStatus('missing')
      return
    }

    fetchJob(id)
      .then((row) => {
        if (cancelled) return
        if (!row || !row.is_active) {
          setStatus('missing')
          return
        }
        setJob(row)
        setStatus('ready')
        fetchSimilar(row)
          .then((r) => !cancelled && setSimilar(r))
          .catch(() => {})
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    document.title = job
      ? `${job.title} at ${job.company} | ${SITE_NAME}`
      : SITE_NAME
  }, [job])

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // sharing was cancelled
    }
  }

  if (status !== 'ready') {
    return (
      <Layout>
        <div className="wrap py-24 text-center">
          {status === 'loading' && <p className="text-muted">Loading…</p>}
          {status === 'missing' && (
            <>
              <h1 className="t-section text-dark">This job isn't available</h1>
              <p className="mt-4 text-muted">
                It may have been removed or the link may be wrong.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="t-section text-dark">Something went wrong</h1>
              <p className="mt-4 text-muted">
                We couldn't load this job. Please try again.
              </p>
            </>
          )}
          {status !== 'loading' && (
            <Link
              to="/jobs"
              className="mt-8 inline-block whitespace-nowrap rounded-xl bg-dark px-6 py-3 text-xs font-bold text-white"
            >
              Back to Job Board
            </Link>
          )}
        </div>
      </Layout>
    )
  }

  const pay = formatPay(job)
  const level = job.experience_level ? levelLabel(job.experience_level) : null
  const verified = job.source === 'employer'
  const posted = job.date_posted ? new Date(job.date_posted) : null
  const expires = posted
    ? new Date(posted.getTime() + MAX_AGE_DAYS * 86400000)
    : null
  const isOld = expires ? expires < new Date() : false
  const html = descriptionToHtml(job.description)
  const isAdzuna = (job.source || '').toLowerCase().includes('adzuna')
  const initial = (job.company || '?').trim().charAt(0).toUpperCase()

  const facts = [
    ['Pay', pay || 'Not listed'],
    ['Location', job.location || 'Not listed'],
    ['Category', categoryLabel(job.category)],
    ['Posted', posted ? longDate(posted) : 'Not listed'],
    ['Expires', expires ? longDate(expires) : 'Not listed'],
    ['Source', verified ? 'Posted by the employer' : job.source || 'Public job feed'],
  ]

  return (
    <Layout>
      <div className="wrap pt-8">
        <Link
          to="/jobs"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-muted shadow-sm transition-colors hover:text-dark"
        >
          <ArrowLeft size={14} />
          <span className="whitespace-nowrap">Back to Job Board</span>
        </Link>

        {isOld && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            This listing is more than {MAX_AGE_DAYS} days old and may no longer be open.
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Main column */}
          <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-dark text-2xl font-bold text-white shadow-md">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-snug text-dark md:text-2xl">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted">
                    {job.company}
                    {job.location ? ` • ${job.location}` : ''}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {pay && (
                      <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {pay}
                      </span>
                    )}
                    <span className="rounded-md bg-wash px-3 py-1 text-xs font-bold text-dark">
                      {categoryLabel(job.category)}
                    </span>
                    <LevelBadge job={job} />
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 md:items-end">
                <span className="whitespace-nowrap font-mono text-xs text-muted">
                  {posted ? `Posted ${longDate(posted)}` : 'Posting date not listed'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={share}
                    title="Share job"
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-line bg-page px-4 py-2 text-sm font-bold text-dark transition-colors hover:bg-wash"
                  >
                    <Share2 size={14} />
                    {copied ? 'Link copied' : 'Share'}
                  </button>
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap rounded-xl bg-dark px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-dark-2"
                    >
                      Apply Now
                    </a>
                  ) : (
                    <span className="cursor-not-allowed whitespace-nowrap rounded-xl bg-soft px-5 py-2 text-sm font-bold text-muted">
                      Link unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <h2 className="mb-4 text-sm font-bold text-dark">Role description</h2>
              {html ? (
                <div className="job-body" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-muted">
                  No description was provided. See the full posting using the Apply button.
                </p>
              )}
            </div>
          </div>

          {/* Side column */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-dark">Listing details</h3>
              <div className="grid grid-cols-2 gap-2">
                {facts.map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl border border-brand/30 bg-wash/40 p-4"
                  >
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                      {label}
                    </span>
                    <span className="mt-1 block break-words text-sm font-bold text-dark">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">
                Listings on {SITE_NAME} stop showing {MAX_AGE_DAYS} days after their posted date.
              </p>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-dark">Experience level</h3>
              <div className="flex items-start gap-4 rounded-xl border border-brand/30 bg-wash/40 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark text-brand">
                  {verified ? <ShieldCheck size={20} /> : <Info size={20} />}
                </span>
                <div className="min-w-0 space-y-2">
                  <LevelBadge job={job} />
                  <p className="text-sm font-bold text-dark">
                    {verified
                      ? 'Experience level verified'
                      : level
                      ? 'Experience level not verified'
                      : 'Experience level not listed'}
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    {verified
                      ? 'The employer confirmed this role’s experience level when posting it on Beginnly.'
                      : level
                      ? 'This level comes from the job’s source. Beginnly hasn’t checked it against the description, so read the requirements before you apply.'
                      : 'The source didn’t include an experience level for this job.'}
                  </p>
                </div>
              </div>
            </div>

            {isAdzuna && (
              <p className="text-center text-xs text-muted">
                <a
                  href="https://www.adzuna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Jobs by Adzuna
                </a>
              </p>
            )}
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="t-section mb-6 text-dark">Similar roles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.slice(0, 3).map((j) => (
                <JobRow key={j.id} job={j} layout="grid" />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}