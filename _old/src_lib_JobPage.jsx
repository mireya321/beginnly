import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  GraduationCap,
  LayoutGrid,
  MapPin,
  Share2,
} from 'lucide-react'
import Layout from '../components/Layout'
import JobRow from '../components/JobRow'
import ToolsBlock from '../components/ToolsBlock'
import AlertsCard from '../components/AlertsCard'
import Arrow from '../components/Arrow'
import { fetchJob, fetchSimilar } from '../lib/jobs'
import { formatPay, levelLabel, categoryLabel } from '../lib/format'
import { descriptionToHtml } from '../lib/description'
import { ago, experienceNote, initialOf, leadSentence } from '../lib/ui'
import { MAX_AGE_DAYS, SITE_NAME } from '../config'

// Same photo style as the featured card on the board (Unsplash, free to use)
const GLANCE_IMAGE =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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
        <div className="wrap py-28 text-center">
          {status === 'loading' && <p className="text-slate">Loading…</p>}
          {status === 'missing' && (
            <>
              <h1 className="t-h3">This job isn't available</h1>
              <p className="mt-4 text-slate">
                It may have been removed or the link may be wrong.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="t-h3">Something went wrong</h1>
              <p className="mt-4 text-slate">We couldn't load this job. Please try again.</p>
            </>
          )}
          {status !== 'loading' && (
            <Link to="/jobs" className="btn mt-8">
              Back to jobs
              <Arrow />
            </Link>
          )}
        </div>
      </Layout>
    )
  }

  const pay = formatPay(job)
  const posted = job.date_posted ? new Date(job.date_posted) : null
  const expires = posted ? new Date(posted.getTime() + MAX_AGE_DAYS * 86400000) : null
  const isOld = expires ? expires < new Date() : false
  const html = descriptionToHtml(job.description)
  const note = experienceNote(job, levelLabel)
  const lead = leadSentence(job)

  const glance = [
    [MapPin, 'Location', job.location],
    [Banknote, 'Pay', pay],
    [LayoutGrid, 'Category', categoryLabel(job.category)],
    [GraduationCap, 'Experience', note],
    [CalendarDays, 'Posted', posted ? ago(job.date_posted) : null],
  ].filter((r) => r[2])

  const applyHref = job.url || null

  return (
    <Layout>
      {/* Back link */}
      <div className="wrap pt-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate transition hover:text-ink"
        >
          <ArrowLeft size={16} />
          All jobs
        </Link>
      </div>

      {isOld && (
        <div className="wrap mt-6">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            This listing is more than {MAX_AGE_DAYS} days old and may no longer be open.
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="wrap py-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: title and description */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-paper-2 font-display text-xl font-extrabold text-primary">
                {initialOf(job.company)}
              </span>
              <span className="text-base font-bold text-ink">{job.company}</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {job.title}
            </h1>
            {lead && (
              <p className="mt-4 text-base font-medium leading-relaxed text-slate sm:text-lg">
                {lead}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {applyHref ? (
                <a href={applyHref} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  Apply for this job
                  <Arrow size={15} />
                </a>
              ) : (
                <span className="rounded-xl bg-paper-2 px-5 py-3 font-semibold text-slate">
                  Link unavailable
                </span>
              )}
              <button onClick={share} className="btn btn-light">
                {copied ? 'Link copied' : 'Share'}
                <span className="btn-arrow">
                  <Share2 size={14} />
                </span>
              </button>
            </div>

            <div className="mt-10 border-t border-line pt-10">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink">About the job</h2>
              {html ? (
                <div className="job-body" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-slate">
                  No description was provided. Use the Apply button to see the full posting.
                </p>
              )}
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-28">
            {/* At a glance */}
            <div className="space-y-6 rounded-3xl border border-line bg-forest p-6 text-white shadow-md sm:p-8">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-line-dark bg-forest-light">
                <img
                  src={GLANCE_IMAGE}
                  alt=""
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  className="h-full w-full object-cover opacity-90"
                />
              </div>

              <span className="block text-[11px] font-extrabold uppercase tracking-widest text-highlight">
                At a glance
              </span>

              <ul className="text-sm">
                {glance.map(([Icon, label, value], i) => (
                  <li
                    key={label}
                    className={`flex items-center justify-between gap-4 py-3.5 ${
                      i < glance.length - 1 ? 'border-b border-line-dark' : ''
                    } ${i === 0 ? 'pt-0' : ''} ${i === glance.length - 1 ? 'pb-0' : ''}`}
                  >
                    <span className="flex items-center gap-2 font-medium text-white/75">
                      <Icon size={16} className="text-highlight" />
                      {label}
                    </span>
                    <span className="text-right font-bold text-white">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply callout */}
            <div className="space-y-4 rounded-3xl border border-line bg-highlight p-6 text-ink sm:p-8">
              <h3 className="font-display text-2xl font-bold leading-snug">Ready to apply?</h3>
              <p className="text-sm font-medium leading-relaxed text-slate">
                You'll go to the company's own site to apply.
              </p>
              {applyHref && (
                <a
                  href={applyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark w-full justify-between"
                >
                  Apply for this job
                  <Arrow size={15} />
                </a>
              )}
            </div>

            <ToolsBlock job={job} />
          </div>
        </div>
      </div>

      <AlertsCard />

      {similar.length > 0 && (
        <section className="wrap py-16">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              More entry-level jobs
            </h2>
            <Link
              to="/jobs"
              className="flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-primary-hover"
            >
              View all jobs <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {similar.slice(0, 3).map((j) => (
              <JobRow key={j.id} job={j} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}
