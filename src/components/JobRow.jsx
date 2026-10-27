import { Link } from 'react-router-dom'
import { Bookmark, DollarSign } from 'lucide-react'
import { formatPay, categoryLabel } from '../lib/format'
import { useSavedJobs } from '../lib/saved'
import LevelBadge from './LevelBadge'

function ago(v) {
  if (!v) return ''
  const days = Math.floor((Date.now() - new Date(v).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Logo({ job }) {
  const initial = (job.company || '?').trim().charAt(0).toUpperCase()
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-dark text-xl font-bold text-white shadow-sm">
      {initial}
    </div>
  )
}

function Pay({ pay }) {
  return pay ? (
    <div className="flex w-fit items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
      <DollarSign size={16} className="text-emerald-600" />
      <span>{pay.replace(/^\$/, '')}</span>
    </div>
  ) : (
    <div className="w-fit rounded-lg bg-soft px-3 py-1 text-sm font-medium text-muted">
      Pay not listed
    </div>
  )
}

function Save({ id, saved, toggle }) {
  const on = saved.includes(id)
  return (
    <button
      onClick={() => toggle(id)}
      aria-label={on ? 'Remove from saved' : 'Save job'}
      title={on ? 'Saved' : 'Save job'}
      className={`rounded-lg border p-2 ${
        on
          ? 'border-brand bg-wash text-dark'
          : 'border-line text-muted hover:text-dark'
      }`}
    >
      <Bookmark size={16} className={on ? 'fill-dark' : ''} />
    </button>
  )
}

const btnGhost =
  'whitespace-nowrap rounded-lg bg-soft px-4 py-2 text-sm font-bold text-dark transition-colors hover:bg-line'
const btnDark =
  'whitespace-nowrap rounded-lg bg-dark px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-dark-2'

function Actions({ job }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link to={`/jobs/${job.id}`} className={btnGhost}>
        View Role
      </Link>
      {job.url && (
        <a href={job.url} target="_blank" rel="noopener noreferrer" className={btnDark}>
          Apply
        </a>
      )}
    </div>
  )
}

// layout: 'grid' (card) or 'list' (row)
export default function JobRow({ job, layout = 'list' }) {
  const { saved, toggle } = useSavedJobs()
  const pay = formatPay(job)
  const posted = ago(job.date_posted)

  if (layout === 'grid') {
    return (
      <div className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition-all hover:border-brand hover:shadow-md">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Logo job={job} />
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Save id={job.id} saved={saved} toggle={toggle} />
              <LevelBadge job={job} />
            </div>
          </div>

          <Link to={`/jobs/${job.id}`}>
            <h3 className="mt-4 text-base font-bold leading-snug text-dark transition-colors group-hover:text-brand">
              {job.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-muted">
            {job.company}
            {job.location ? ` • ${job.location}` : ''}
          </p>

          <div className="mt-4">
            <Pay pay={pay} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded bg-soft px-3 py-1 text-xs font-medium text-muted">
              {categoryLabel(job.category)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2 border-t border-soft pt-4">
          <span className="font-mono text-xs text-muted">{posted}</span>
          <Actions job={job} />
        </div>
      </div>
    )
  }

  return (
    <div className="group flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm transition-all hover:border-brand hover:shadow-md md:flex-row md:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <Logo job={job} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/jobs/${job.id}`} className="min-w-0">
              <h3 className="truncate text-base font-bold text-dark transition-colors group-hover:text-brand">
                {job.title}
              </h3>
            </Link>
            <LevelBadge job={job} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {job.company}
            {job.location ? ` • ${job.location}` : ''}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Pay pay={pay} />
            <span className="rounded bg-soft px-3 py-1 text-xs font-medium text-muted">
              {categoryLabel(job.category)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-soft pt-4 md:border-0 md:pt-0">
        <span className="font-mono text-xs text-muted">{posted}</span>
        <div className="flex items-center gap-2">
          <Save id={job.id} saved={saved} toggle={toggle} />
          <Actions job={job} />
        </div>
      </div>
    </div>
  )
}