import { Box } from 'lucide-react'

const pill = 'rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-black'

export default function FeaturedJobCard({ job, onSelect }) {
  return (
    <button
      onClick={() => onSelect(job.id)}
      className="flex h-44 w-64 shrink-0 flex-col justify-between rounded-2xl bg-[#3333e6] p-4 text-left text-white"
    >
      <div>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{job.title}</p>
        <p className="mt-0.5 text-xs">{job.company}</p>
        <div className="mt-2 flex gap-1.5">
          <span className={pill}>{job.type}</span>
          <span className={pill}>{job.locationType}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-sm font-semibold">{job.pay}</p>
        <Box size={22} className="text-white/80" />
      </div>
    </button>
  )
}