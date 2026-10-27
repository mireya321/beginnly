import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import Layout from '../components/Layout'
import JobRow from '../components/JobRow'
import FilterPanel from '../components/FilterPanel'
import { MISSION, PAGE_SIZE } from '../config'
import { fetchJobs, fetchLiveCount, DEFAULT_FILTERS } from '../lib/jobs'

const PILLS = [
  ['All roles', ''],
  ['Customer support', 'Customer support'],
  ['Admin', 'Admin'],
  ['Accounting', 'Accounting'],
  ['Sales', 'Sales'],
  ['Teaching', 'Teaching'],
]

export default function Jobs() {
  // The homepage search sends people here as /jobs?q=their+words
  const [params] = useSearchParams()
  const initialQuery = params.get('q') || ''

  const [searchInput, setSearchInput] = useState(initialQuery)
  const [search, setSearch] = useState(initialQuery)
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [layout, setLayout] = useState('grid')
  const [page, setPage] = useState(0)
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [liveCount, setLiveCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Wait a moment after typing before searching
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(0)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    fetchLiveCount().then(setLiveCount).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchJobs({ search, ...filters, sort, page, pageSize: PAGE_SIZE })
      .then(({ jobs: rows, total: count, hasMore: more }) => {
        if (cancelled) return
        setJobs((prev) => (page === 0 ? rows : [...prev, ...rows]))
        setTotal(count)
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
    setFilters(DEFAULT_FILTERS)
    setPage(0)
  }

  const dirty =
    search !== '' || JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)

  return (
    <Layout>
      <div className="wrap pt-8">
        {/* Header banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-dark p-8 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-extrabold text-dark">
              Live Job Feed
              {liveCount !== null && ` · ${liveCount.toLocaleString()} listings`}
            </span>
            <h1 className="t-display mt-4">Honest levels. Less noise.</h1>
            <p className="mt-4 text-base text-slate-300">{MISSION}</p>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="mb-6 space-y-4 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search role title or company…"
                className="w-full rounded-xl border border-line bg-page py-3 pl-10 pr-10 text-sm text-dark outline-none focus:ring-2 focus:ring-brand"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <div className="flex items-center gap-1 self-start rounded-xl border border-line bg-page p-1 sm:self-auto">
              {[
                ['grid', LayoutGrid, 'Grid view'],
                ['list', List, 'List view'],
              ].map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setLayout(key)}
                  title={label}
                  aria-label={label}
                  className={`rounded-lg p-2 ${
                    layout === key ? 'bg-dark text-white' : 'text-muted'
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-soft pt-4 text-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PILLS.map(([label, value]) => (
                <button
                  key={label}
                  onClick={() => setSearchInput(value)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold transition-all ${
                    searchInput === value
                      ? 'bg-dark text-white'
                      : 'bg-page text-muted hover:bg-wash'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <span className="font-bold text-muted">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setPage(0)
                  }}
                  className="cursor-pointer bg-transparent font-bold text-dark outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="pay">Highest pay</option>
                </select>
              </label>

              <button
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                className="flex items-center gap-2 whitespace-nowrap font-bold text-dark"
              >
                <SlidersHorizontal size={16} />
                {filtersOpen ? 'Hide filters' : 'More filters'}
              </button>

              {dirty && (
                <button
                  onClick={reset}
                  className="whitespace-nowrap font-bold text-dark underline underline-offset-4"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {filtersOpen && (
            <div className="border-t border-soft pt-4">
              <FilterPanel filters={filters} onChange={changeFilters} />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Could not load jobs: {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 ? (
          <div className="space-y-4 rounded-3xl border border-dashed border-line bg-white p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wash text-dark">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-dark">No matching roles found</h3>
            <p className="mx-auto max-w-md text-sm text-muted">
              Try a broader search or fewer filters.
            </p>
            <button
              onClick={reset}
              className="rounded-xl bg-dark px-6 py-3 text-xs font-bold text-wash transition-colors hover:bg-brand hover:text-dark"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            className={
              layout === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {jobs.map((j) => (
              <JobRow key={j.id} job={j} layout={layout} />
            ))}
          </div>
        )}

        {loading && <p className="py-8 text-center text-muted">Loading…</p>}

        {!loading && hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="whitespace-nowrap rounded-xl border border-line bg-white px-6 py-3 text-sm font-bold text-dark shadow-sm transition-all hover:border-brand"
            >
              Load more roles
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}