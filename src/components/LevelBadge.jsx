import { Info, ShieldCheck } from 'lucide-react'
import { levelLabel } from '../lib/format'

// Beginnly's experience badge.
// Verified (employer confirmed the level): solid dark badge with a shield.
// Not verified (level comes from the job's source): soft badge with an info icon.
// No level at all: nothing is shown.
export default function LevelBadge({ job, className = '' }) {
  if (!job.experience_level) return null
  const level = levelLabel(job.experience_level)
  const verified = job.source === 'employer'

  if (verified) {
    return (
      <span
        title="The employer confirmed this experience level"
        className={`inline-flex items-center gap-1 rounded-md bg-dark px-2 py-1 text-xs font-bold text-wash ${className}`}
      >
        <ShieldCheck size={12} className="text-brand" />
        Verified · {level}
      </span>
    )
  }

  return (
    <span
      title="This level comes from the job's source. Beginnly hasn't checked it against the description."
      className={`inline-flex items-center gap-1 rounded-md border border-dashed border-brand bg-wash px-2 py-1 text-xs font-bold text-dark ${className}`}
    >
      <Info size={12} />
      {level} · not verified
    </span>
  )
}
