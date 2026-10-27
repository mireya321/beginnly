import { useState, useEffect } from 'react'
import { Flame, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import FeaturedJobCard from '../components/FeaturedJobCard'
import JobCard from '../components/JobCard'
import JobDetail from '../components/JobDetail'
import { sampleJobs } from '../data/sampleJobs'

const emptyFilters = { keyword: '', category: '', remote: '' }

export default function JobBoard() {
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedId, setSelectedId] = useState(null)

  const jobs = sampleJobs.filter((j) => {
    const text = `${j.title} ${j.company}`.toLowerCase()
    if (filters.keyword && !text.includes(filters.keyword.toLowerCase())) return false
    if (filters.category && j.category !== filters.category) return false
    if (filters.remote && j.locationType !== filters.remote) return false
    return true
  })

  const selected = jobs.find((j) => j.id === selectedId)
  const featured = jobs.filter((j) => j.featured)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    document.body.style.overflow = selected && isMobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selected])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <section className="relative">
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-10 pb-8 pt-14">
          <h1 className="text-5xl font-semibold leading-tight">
            Find your next job.
          </h1>
          <p className="mt-2 text-xs italic">
            Fresh listings, updated every day.
          </p>
          <div className="mt-8">
            <SearchBar onSearch={setFilters} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-10 pb-16">
        {featured.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl">
              <Flame size={18} className="text-red-500" />
              Featured Jobs
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {featured.map((j) => (
                <FeaturedJobCard key={j.id} job={j} onSelect={setSelectedId} />
              ))}
            </div>
          </section>
        )}

        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">{jobs.length} job results</span>
          <button
            onClick={() => {
              setFilters(emptyFilters)
              setSelectedId(null)
            }}
            className="font-semibold"
          >
            Refresh
          </button>
        </div>

        <div
          className={`grid items-start gap-5 ${
            selected ? 'lg:grid-cols-[2fr_3fr]' : ''
          }`}
        >
          <div
            className={`grid gap-3 md:grid-cols-2 ${
              selected ? 'lg:grid-cols-1' : 'lg:grid-cols-3'
            }`}
          >
            {jobs.length === 0 && (
              <p className="col-span-full text-sm text-gray-500">
                No jobs match your search.
              </p>
            )}
            {jobs.map((j) => (
              <JobCard
                key={j.id}
                job={j}
                selected={selected?.id === j.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          {selected && (
            <div className="hidden lg:sticky lg:top-6 lg:block">
              <JobDetail job={selected} />
            </div>
          )}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <button
            aria-label="Close"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="sheet-up relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)]">
            <div className="sticky top-0 z-10 flex justify-center bg-white pb-1 pt-3">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
              <button
                aria-label="Close"
                onClick={() => setSelectedId(null)}
                className="absolute right-4 top-2 p-1"
              >
                <X size={18} />
              </button>
            </div>
            <JobDetail job={selected} bare />
          </div>
        </div>
      )}
    </div>
  )
}