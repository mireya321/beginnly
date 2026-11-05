import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap, MapPin } from 'lucide-react'
import { formatPay, categoryLabel, levelLabel } from '../lib/format'
import { experienceNote, fieldOf } from '../lib/ui'

// Placeholder photo (Unsplash, free to use). To change it, replace this link
// with another photo link, or save your own photo as public/featured.jpg and
// use '/featured.jpg'.
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'

// The big dark "Featured role" card at the top of the board
export default function FeaturedJob({ job }) {
  const [broken, setBroken] = useState(false)
  if (!job) return null
  const pay = formatPay(job)
  const note = experienceNote(job, levelLabel)

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-forest shadow-sm transition hover:shadow-lg md:flex-row"
    >
      <div className="relative h-56 overflow-hidden bg-forest-light md:h-auto md:w-1/2">
        {!broken && (
          <img
            src={FEATURED_IMAGE}
            alt=""
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-4 top-4 max-w-[55%] truncate rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur-md">
          {job.company}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-highlight px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
          {fieldOf(job, categoryLabel(job.category))}
        </span>
      </div>

      <div className="flex flex-col justify-between p-6 text-white sm:p-8 md:w-1/2">
        <div>
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-highlight">
            Featured role
          </span>
          <h2 className="mb-4 line-clamp-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
            {job.title}
          </h2>
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/75">
            {job.location && (
              <span className="flex items-center">
                <MapPin size={14} className="mr-1 text-highlight" />
                {job.location}
              </span>
            )}
            <span className="flex items-center">
              <GraduationCap size={14} className="mr-1 text-highlight" />
              {note}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line-dark pt-4">
          <span className="text-lg font-bold text-white">{pay || job.company}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-highlight text-ink transition group-hover:scale-105">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  )
}