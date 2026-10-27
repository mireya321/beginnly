function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="mt-1 text-xs">{value}</p>
    </div>
  )
}

export default function JobDetail({ job, bare = false }) {
  if (!job) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-sm text-gray-500">
        No jobs match your search.
      </div>
    )
  }

  const applyClass =
    'rounded-full bg-brand text-center text-xs font-medium text-white'

  return (
    <div className={bare ? 'p-5' : 'rounded-2xl border border-line bg-white p-6'}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light leading-tight lg:text-3xl">{job.title}</h2>
          <p className="mt-1 text-sm">{job.company}</p>
        </div>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${applyClass} px-8 py-2.5`}
        >
          Apply
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-y-4 rounded-xl border border-line p-4 sm:grid-cols-3">
        <Info label="Location" value={job.location} />
        <Info label="Pay" value={job.pay} />
        <Info label="Type" value={job.locationType} />
        <Info label="Availability" value={job.type} />
        <Info label="Experience" value={job.experience} />
        <Info label="Job Openings" value={job.openings} />
      </div>

      <p className="mt-8 border-b border-line pb-2 text-xs text-gray-400">
        Job Description
      </p>
      <div className="mt-4 space-y-3 text-xs leading-relaxed">
        {job.description.split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${applyClass} mt-8 block py-2.5`}
      >
        Apply
      </a>
      <p className="mt-2 text-center text-[10px] text-gray-500">
        Applications open in a new tab. Pop-ups must be enabled.
      </p>
    </div>
  )
}