import { ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import { MISSION } from '../config'
import { sampleJobs } from '../data/sampleJobs'

export default function DesignPreview() {
  return (
    <Layout>
      <section className="wrap pb-20 pt-10">
        <nav className="flex items-center gap-2 text-sm text-muted">
          Home <ChevronRight size={14} />
          <span className="text-ink">Jobs</span>
        </nav>

        <div className="mt-10 grid gap-8 lg:mt-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <h1 className="text-5xl font-medium leading-none tracking-[-0.03em] md:text-6xl">
            Less noise
          </h1>
          <div>
            <p className="text-lg leading-snug text-muted md:text-[21px]">
              {MISSION}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              {sampleJobs.length} live listings
            </span>
          </div>
        </div>
      </section>
    </Layout>
  )
}