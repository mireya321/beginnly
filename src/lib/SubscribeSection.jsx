import { Link } from 'react-router-dom'
import { Banknote, GraduationCap, MapPin } from 'lucide-react'
import { formatPay, categoryLabel, levelLabel } from '../lib/format'
import { ago, daysOld, experienceNote } from '../lib/ui'
import Arrow from './Arrow'

// A text-only job card. The whole card opens the job page.
export default function JobRow({ job }) {
  const pay = formatPay(job)
  const posted = ago(job.date_posted)
  const isNew = (daysOld(job.date_posted) ?? 99) <= 3
  const remote = /remote/i.test(job.location || '')
  const note = experienceNote(job, levelLabel)

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex flex-col justify-between rounded-[20px] border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_32px_-16px_rgba(14,32,25,0.25)]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-md bg-paper-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">
            {categoryLabel(job.category)}
          </span>
          {isNew && (
            <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold text-ink">
              New
            </span>
          )}
        </div>

        <h3 className="mt-3 text-2xl leading-tight text-ink">{job.title}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[15px] text-slate">
          {job.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} />
              {job.location}
            </span>
          )}
          {pay && (
            <span className="inline-flex items-center gap-1.5">
              <Banknote size={16} />
              {pay}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap size={16} />
            {note}
          </span>
        </div>

        {remote && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold text-ink">
              Remote
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{job.company}</p>
          <p className="text-xs text-slate">{posted}</p>
        </div>
        <span className="btn btn-dark shrink-0">
          Apply
          <Arrow />
        </span>
      </div>
    </Link>
  )
}
