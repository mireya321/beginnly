import { ArrowUpRight } from 'lucide-react'
import { toolsForJob } from '../lib/tools'
import { trackToolClick } from '../lib/track'

const LABEL = { sponsored: 'Sponsored', paid: 'Paid link' }

// "Tools to help build the skills this role has"
// Shows nothing when no tools match the job.
export default function ToolsBlock({ job }) {
  const tools = toolsForJob(job)
  if (!tools.length) return null

  return (
    <section className="card p-6" aria-label="Tools to help build the skills this role has">
      <h3 className="font-display text-xl font-extrabold leading-tight text-ink">
        Tools to help build the skills this role has
      </h3>
      <ul className="mt-4 divide-y divide-line">
        {tools.map((t) => {
          const labeled = LABEL[t.type]
          return (
            <li key={t.id} className="py-3 first:pt-0 last:pb-0">
              <a
                href={t.url}
                target="_blank"
                rel={labeled ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
                onClick={() => trackToolClick({ toolId: t.id, jobId: job.id, type: t.type })}
                className="group flex items-start justify-between gap-3"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink group-hover:text-primary">
                      {t.name}
                    </span>
                    {labeled && (
                      <span className="rounded-md bg-paper-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate">
                        {labeled}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate">{t.blurb}</span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="mt-1 shrink-0 text-slate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}