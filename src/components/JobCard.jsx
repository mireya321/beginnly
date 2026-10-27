import { Bookmark, Box, Clock, MapPin } from 'lucide-react'

export default function JobCard({ job, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(job.id)}
      className={`w-full rounded-2xl border bg-white p-4 text-left transition ${
        selected ? 'border-brand' : 'border-line hover:border-gray-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Box size={30} className="text-brand" />
          <div>
            <p className="text-lg leading-tight">{job.title}</p>
            <p className="text-xs font-semibold">{job.company}</p>
          </div>
        </div>
        <Bookmark size={14} className="text-brand" />
      </div>

      <div className="my-3 border-t border-line" />

      <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f1f1] px-2.5 py-1 text-[11px] text-gray-600">
        <Clock size={11} />
        {job.type}
      </span>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          {job.locationType}
        </span>
        <span className="font-semibold">{job.pay}</span>
      </div>
    </button>
  )
}