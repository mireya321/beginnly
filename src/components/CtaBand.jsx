import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CtaBand() {
  return (
    <section className="cta-gradient mt-10">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-48 pt-24 text-center md:pb-64 md:pt-32">
        <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-[44px] md:leading-tight">
          Less noise. Honest levels.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted md:text-xl">
          Browse listings that expire on time and say exactly how much
          experience they ask for.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/jobs"
            className="flex items-center gap-2 rounded-xl bg-ink px-6 py-4 font-medium text-white"
          >
            Browse jobs <ArrowRight size={16} />
          </Link>
          <Link
            to="/employers/post"
            className="rounded-xl border border-line bg-white px-6 py-4 font-medium shadow-sm"
          >
            Post a job
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted">
          Or{' '}
          <Link
            to="/experience-levels"
            className="text-ink underline underline-offset-4"
          >
            see how experience levels work
          </Link>
          .
        </p>
      </div>
    </section>
  )
}