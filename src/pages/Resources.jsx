import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Search, Tag, X } from 'lucide-react'
import Layout from '../components/Layout'
import SubscribeSection from '../components/SubscribeSection'
import { SITE_NAME, FIELDS } from '../config'
import { setSeo } from '../lib/seo'
import { TOOLS } from '../lib/tools'
import { trackToolClick } from '../lib/track'

const BADGE = { free: 'Free', paid: 'Paid link', sponsored: 'Sponsored' }

// Picture tile colors, used when a resource has no image yet
const TILES = [
  'bg-highlight text-ink',
  'bg-forest text-highlight',
  'bg-paper-2 text-primary',
  'bg-primary/15 text-primary',
]

function tileFor(id) {
  let n = 0
  for (const ch of String(id)) n = (n * 31 + ch.charCodeAt(0)) % 997
  return TILES[n % TILES.length]
}

function Card({ tool }) {
  const fields = (tool.fields || []).filter((f) => f !== 'all')
  const [broken, setBroken] = useState(false)
  const showImage = tool.image && !broken

  return (
    <a
      href={tool.url}
      target="_blank"
      rel={tool.type === 'free' ? 'noopener noreferrer' : 'sponsored noopener noreferrer'}
      onClick={() => trackToolClick({ toolId: tool.id, jobId: null, type: tool.type })}
      className="group flex flex-col rounded-3xl border border-line bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Picture area: an image when the resource has one, a colored tile when not */}
      <div className="relative h-48 overflow-hidden rounded-2xl">
        {showImage ? (
          <img
            src={tool.image}
            alt=""
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${tileFor(tool.id)}`}>
            <span className="font-display text-7xl font-extrabold leading-none">
              {(tool.name || '?').trim().charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-lg bg-highlight px-3 py-1.5 text-xs font-bold text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          {BADGE[tool.type] || 'Free'}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
        <h3 className="font-display text-2xl font-extrabold leading-tight text-ink transition-colors group-hover:text-primary">
          {tool.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate">{tool.blurb}</p>

        {fields.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {fields.slice(0, 2).map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1.5 text-xs font-bold text-ink"
              >
                <Tag size={12} className="text-primary" />
                {f}
              </span>
            ))}
            {fields.length > 2 && (
              <span className="inline-flex items-center rounded-full bg-paper-2 px-3 py-1.5 text-xs font-bold text-slate">
                +{fields.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-sm font-extrabold text-primary">
          <span className="mt-4">Visit site</span>
          <ArrowUpRight
            size={18}
            className="mt-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </a>
  )
}

export default function Resources() {
  const [field, setField] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    setSeo({
      title: 'Free resources to build job skills | Beginnly',
      description:
        'Free courses and tools to learn the skills for your next job, from customer support and sales to data, software and healthcare.',
      path: '/resources',
    })
  }, [])

  // Only resources that are switched on and have a link
  const all = useMemo(() => TOOLS.filter((t) => t.enabled && t.url), [])

  // Pills: only fields that have at least one resource
  const pills = useMemo(
    () => FIELDS.filter((f) => all.some((t) => (t.fields || []).includes(f))),
    [all]
  )

  const shown = all.filter((t) => {
    const inField = !field || (t.fields || []).includes(field) || (t.fields || []).includes('all')
    const q = query.trim().toLowerCase()
    const inSearch = !q || `${t.name} ${t.blurb}`.toLowerCase().includes(q)
    return inField && inSearch
  })

  return (
    <Layout>
      <div className="wrap py-10 sm:py-14">
        {/* Hero */}
        <div className="mb-12">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary">
            Resources
          </span>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="t-display rise">
                Build the skills <br className="hidden sm:block" />
                for your <span className="mark inline-block px-3">next move.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm leading-relaxed text-slate sm:text-base">
                Courses, certifications and practice sites for the job fields on Beginnly. Anything
                paid or sponsored is always labeled.
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar and search */}
        <div className="mb-8 flex flex-col items-stretch justify-between gap-3 rounded-3xl bg-paper-2 p-2 lg:flex-row lg:items-center">
          <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {['', ...pills].map((f) => (
              <button
                key={f || 'all'}
                onClick={() => setField(f)}
                className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm transition ${
                  field === f
                    ? 'bg-ink font-bold text-white'
                    : 'font-semibold text-ink hover:bg-white'
                }`}
              >
                {f || 'All resources'}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-2xl border border-transparent bg-white py-3 pl-10 pr-9 text-sm font-medium text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        {shown.length === 0 ? (
          <div className="rounded-3xl border border-line bg-white py-16 text-center">
            <p className="text-sm font-semibold text-slate">No resources found for that search.</p>
            <button
              onClick={() => {
                setField('')
                setQuery('')
              }}
              className="btn btn-dark mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((t) => (
              <Card key={t.id} tool={t} />
            ))}
          </div>
        )}
      </div>

      <SubscribeSection />
    </Layout>
  )
}