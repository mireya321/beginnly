import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Layout from '../components/Layout'
import JobRow from '../components/JobRow'
import FilterPanel from '../components/FilterPanel'
import SubscribeForm from '../components/SubscribeForm'
import SubscribeSection from '../components/SubscribeSection'
import FeaturedJob from '../components/FeaturedJob'
import Arrow from '../components/Arrow'
import { PAGE_SIZE, SITE_NAME } from '../config'
import { fetchJobs, DEFAULT_FILTERS } from '../lib/jobs'

// The board opens on entry-level jobs only
const START_FILTERS = { ...DEFAULT_FILTERS, levels: ['Entry-level'] }

const PILLS = [
  ['All roles', ''],
  ['Customer support', 'Customer support'],
  ['Admin', 'Admin'],
  ['Accounting', 'Accounting'],
  ['Sales', 'Sales'],
  ['Teaching', 'Teaching'],
]

export default function Jobs() {
  const [params] = useSearchParams()
  const initialQuery = params.get('q') || ''

  const [searchInput, setSearchInput] = useState(initialQuery)
  const [search, setSearch] = useState(initialQuery)
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState(START_FILTERS)
  const [page, setPage] = useState(0)
  const [jobs, setJobs] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    document.title = `${SITE_NAME} | Entry-level jobs that don't ask for experience`
  }, [])

  // Wait a moment after typing before searching
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(0)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchJobs({ search, ...filters, sort, page, pageSize: PAGE_SIZE })
      .then(({ jobs: rows, hasMore: more }) => {
        if (cancelled) return
        setJobs((prev) => (page === 0 ? rows : [...prev, ...rows]))
        setHasMore(more)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Something went wrong')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [search, filters, sort, page])

  function changeFilters(patch) {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(0)
  }

  function reset() {
    setSearchInput('')
    setSearch('')
    setFilters(START_FILTERS)
    setPage(0)
  }

  const dirty =
    search !== '' || JSON.stringify(filters) !== JSON.stringify(START_FILTERS)

  const showFeatured = !dirty && page === 0 && jobs.length > 0
  const gridJobs = showFeatured ? jobs.slice(1) : jobs

  return (
    <Layout>
      <div className="wrap py-10 sm:py-14">
        {/* Hero */}
        <div className="mb-12">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary">
            Open roles
          </span>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="t-display rise">
                Entry-level jobs <br className="hidden sm:block" />
                that don't ask for <span className="mark inline-block px-3">experience.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm leading-relaxed text-slate sm:text-base">
                Every job here is left out if it requires years of professional experience.
                Degrees, coursework and projects are fine. Don't see your role yet? Get new jobs
                in your inbox each week.
              </p>
            </div>
          </div>
        </div>

        {/* Filter chips and search */}
        <div className="mb-4 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PILLS.map(([label, value]) => (
              <button
                key={label}
                onClick={() => setSearchInput(value)}
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm transition ${
                  searchInput === value
                    ? 'border-forest bg-forest font-bold text-white'
                    : 'border-line bg-white font-semibold text-ink hover:border-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search roles..."
              className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-end gap-5 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-slate">Sort</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setPage(0)
              }}
              className="cursor-pointer bg-transparent font-bold text-ink outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="pay">Highest pay</option>
            </select>
          </label>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="flex items-center gap-2 whitespace-nowrap font-bold text-ink"
          >
            <SlidersHorizontal size={14} />
            {filtersOpen ? 'Hide filters' : 'More filters'}
          </button>
          {dirty && (
            <button
              onClick={reset}
              className="whitespace-nowrap font-bold text-primary underline underline-offset-4"
            >
              Reset
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="-mt-6 mb-10 rounded-2xl border border-line p-4">
            <FilterPanel filters={filters} onChange={changeFilters} />
          </div>
        )}

        {/* Featured role and email card */}
        {showFeatured && (
          <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <FeaturedJob job={jobs[0]} />
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-line bg-highlight p-6 text-ink sm:p-8 lg:col-span-4">
              <div>
                <h3 className="mb-2 font-display text-2xl font-bold leading-snug">
                  Get new jobs every week.
                </h3>
                <p className="mb-6 text-xs font-medium leading-relaxed text-slate sm:text-sm">
                  Add your email. We'll send you new entry-level jobs once a week.
                </p>
              </div>
              <SubscribeForm compact />
            </div>
          </div>
        )}

        {/* Job cards */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Could not load jobs: {error}
          </div>
        )}

        {loading && page === 0 && <p className="py-10 text-center text-slate">Loading…</p>}

        {!loading && !error && jobs.length === 0 ? (
          <div className="rounded-3xl border border-line bg-white py-16 text-center">
            <p className="text-sm font-semibold text-slate">
              No open positions found matching your search.
            </p>
            <button onClick={reset} className="btn btn-dark mt-6">
              Clear filters
              <Arrow size={15} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {gridJobs.map((j) => (
              <JobRow key={j.id} job={j} />
            ))}
          </div>
        )}

        {loading && page > 0 && <p className="py-8 text-center text-slate">Loading…</p>}

        {!loading && hasMore && (
          <div className="mt-10 text-center">
            <button onClick={() => setPage((p) => p + 1)} className="btn btn-light">
              Load more jobs
              <Arrow size={15} />
            </button>
          </div>
        )}

        {/* "Don't see your role yet?" banner */}
        <div className="relative mt-16 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-line bg-forest p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="mb-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
              Don't see your role yet?
            </h2>
            <p className="text-xs leading-relaxed text-white/75 sm:text-sm">
              Add your email once. We'll send you new entry-level jobs every week, so you don't
              have to keep checking.
            </p>
          </div>
          <a href="#alerts" className="btn btn-lime shrink-0">
            Get weekly job emails
            <Arrow size={15} />
          </a>
        </div>
      </div>

      <SubscribeSection />
    </Layout>
  )
}