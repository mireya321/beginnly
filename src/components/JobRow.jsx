import { Link } from 'react-router-dom'
import { Banknote, BadgeCheck, GraduationCap, MapPin } from 'lucide-react'
import { formatPay, categoryLabel, levelLabel } from '../lib/format'
import { ago, daysOld, experienceNote } from '../lib/ui'
import Arrow from './Arrow'

// A text-only job card (no image). The whole card opens the job page.
export default function JobRow({ job }) {
  const pay = formatPay(job)
  const age = daysOld(job.date_posted)
  const isNew = (age ?? 99) <= 3
  const remote = /remote/i.test(job.location || '')
  const note = experienceNote(job, levelLabel)

  const chip =
    'inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1.5 text-xs font-bold text-ink'

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex flex-col justify-between rounded-3xl border border-line bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary">
            {categoryLabel(job.category)}
          </span>
          {isNew && (
            <span className="rounded-full bg-highlight px-3 py-1 text-xs font-extrabold text-ink">
              New
            </span>
          )}
        </div>

        <h3 className="mb-4 line-clamp-2 font-display text-2xl font-extrabold leading-tight text-ink transition-colors group-hover:text-primary">
          {job.title}
        </h3>

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{job.location}</span>
            </span>
          )}
          {pay && (
            <span className="flex items-center gap-1.5">
              <Banknote size={16} />
              <span>{pay}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <GraduationCap size={16} />
            <span>{note}</span>
          </span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className={chip}>
            <BadgeCheck size={14} className="text-primary" />
            Entry level
          </span>
          {remote && (
            <span className={chip}>
              <BadgeCheck size={14} className="text-primary" />
              Remote
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
        <div className="min-w-0">
          <div className="truncate text-base font-extrabold text-ink">{job.company}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate">
            Posted {ago(job.date_posted)}
          </div>
        </div>
        <span className="btn btn-dark shrink-0">
          Apply
          <Arrow size={15} />
        </span>
      </div>
    </Link>
  )
}