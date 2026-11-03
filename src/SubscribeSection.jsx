import { Link } from 'react-router-dom'
import { Banknote, GraduationCap, MapPin } from 'lucide-react'
import { formatPay, categoryLabel, levelLabel } from '../lib/format'
import { ago, daysOld, experienceNote } from '../lib/ui'
import Arrow from './Arrow'

// A text-only job card. The whole card opens the job page.
export default function JobRow({ job }) {
  const pay = formatPay(job)
  const age = daysOld(job.date_posted)
  const isNew = (age ?? 99) <= 3
  const remote = /remote/i.test(job.location || '')
  const note = experienceNote(job, levelLabel)

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-6 transition hover:shadow-lg"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-md bg-paper-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            {categoryLabel(job.category)}
          </span>
          {isNew && (
            <span className="rounded-full bg-highlight px-2.5 py-0.5 text-xs font-bold text-ink">
              New
            </span>
          )}
        </div>

        <h3 className="mb-3 line-clamp-2 font-display text-xl font-bold leading-snug text-ink transition group-hover:text-primary">
          {job.title}
        </h3>

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-slate">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              <span>{job.location}</span>
            </span>
          )}
          {pay && (
            <span className="flex items-center gap-1.5">
              <Banknote size={15} />
              <span>{pay}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <GraduationCap size={15} />
            <span>{note}</span>
          </span>
        </div>

        {remote ? (
          <div className="mb-5">
            <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 text-xs font-semibold text-slate">
              Remote
            </span>
          </div>
        ) : (
          <div className="mb-5 h-6" />
        )}
      </div>

      <div>
        <hr className="mb-4 border-line" />
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-xs font-medium text-slate">
            {job.company} • {ago(job.date_posted)}
          </span>
          <span className="btn btn-dark btn-sm shrink-0 group-hover:bg-forest-light">
            Apply
            <Arrow size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}
