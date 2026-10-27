import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import Layout from '../components/Layout'
import JobRow from '../components/JobRow'
import {
  HalftoneSphere,
  HalftoneShield,
  HalftoneConcentric,
} from '../components/Halftone'
import { MAX_AGE_DAYS, MISSION } from '../config'
import { PLANS } from '../lib/plans'
import { fetchJobs, fetchLiveCount, DEFAULT_FILTERS } from '../lib/jobs'

// Plans and prices live in src/lib/plans.js

const FAQ = [
  {
    q: 'How do listings expire?',
    a: `A listing stops showing ${MAX_AGE_DAYS} days after its posted date. Older listings are hidden by default, and you can bring them back with the filters.`,
  },
  {
    q: 'Where do the jobs come from?',
    a: 'From employers who post directly and from public job feeds, including Adzuna, Greenhouse company boards, and USAJOBS. Some feeds only share a short preview, so those listings link out to the full posting.',
  },
  {
    q: 'What does the experience badge mean?',
    a: 'A dark “Verified” badge means the employer confirmed the level when posting. A light “not verified” badge means the level comes from the job’s source and Beginnly has not checked it against the description.',
  },
  {
    q: 'How do I post a job?',
    a: 'Create an employer account, write your listing, pick a plan and pay by card. It goes live as soon as the payment clears.',
  },
]

function Tag({ children }) {
  return (
    <span className="rounded-full bg-wash px-3 py-1 text-xs font-bold text-dark">
      {children}
    </span>
  )
}

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [liveCount, setLiveCount] = useState(null)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    fetchLiveCount().then(setLiveCount).catch(() => {})
    fetchJobs({ search: '', ...DEFAULT_FILTERS, sort: 'newest', page: 0, pageSize: 2 })
      .then(({ jobs: rows }) => setJobs(rows))
      .catch(() => {})
  }, [])

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pb-16 pt-16">
        <div className="wrap relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/50 bg-wash px-4 py-2 text-xs font-bold text-dark shadow-sm">
            <Sparkles size={14} />
            <span>A cleaner job board for people starting out</span>
          </div>

          <h1 className="t-display mx-auto max-w-3xl text-dark">
            Find work that matches where you are
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {MISSION}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="flex items-center gap-2 rounded-xl bg-dark px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-dark-2"
            >
              <span>Explore Open Roles</span>
              <ArrowRight size={16} className="text-lilac" />
            </Link>
            <Link
              to="/signup"
              className="rounded-xl border border-brand/50 bg-wash px-6 py-4 text-sm font-bold text-dark shadow-sm transition-all hover:bg-lilac"
            >
              Post a Role
            </Link>
          </div>

          {/* Live board mockup */}
          <div className="relative mx-auto mt-16 max-w-5xl rounded-3xl border border-brand/40 bg-gradient-to-b from-brand/20 to-wash/30 p-4 shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl border border-line bg-white p-6 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-soft pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-xs text-muted">Live board</span>
                </div>
                <div className="rounded-lg bg-wash px-3 py-1 text-xs font-bold text-dark">
                  {liveCount === null ? '…' : liveCount.toLocaleString()} live listings
                </div>
              </div>

              <div className="grid gap-4 pt-6 md:grid-cols-2">
                {jobs.map((j) => (
                  <JobRow key={j.id} job={j} layout="grid" />
                ))}
                {jobs.length === 0 && (
                  <p className="col-span-full py-8 text-center text-xs text-muted">
                    Loading the newest roles…
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-y border-line bg-white py-16">
        <div className="wrap">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Tag>Core Features</Tag>
            <h2 className="t-section mt-4 text-dark">A job board that stays tidy</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                art: <HalftoneSphere />,
                title: 'Experience levels, in plain words',
                text: 'Every listing shows the level it asks for, from Entry-level up to Expert, so you can skip roles that are out of reach.',
              },
              {
                art: <HalftoneConcentric />,
                title: 'Listings expire',
                text: `Roles stop showing after ${MAX_AGE_DAYS} days, so the board is not full of stale postings.`,
              },
              {
                art: <HalftoneShield />,
                title: 'Verified or labeled honestly',
                text: 'Employer-posted roles carry a Verified badge. Roles from outside feeds say plainly that their level is not verified.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-line bg-page p-6 text-center"
              >
                {f.art}
                <h3 className="mt-4 text-base font-bold text-dark">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-16">
        <div className="wrap max-w-5xl text-center">
          <Tag>Pricing Plans</Tag>
          <h2 className="t-section mt-4 text-dark">Plans for employers</h2>
          <p className="mt-2 text-sm text-muted">
            Always free for job seekers. Employers pay once per listing.
          </p>

          <div className="mt-8 grid gap-6 text-left md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-2xl border p-6 ${
                  p.popular
                    ? 'border-slate-800 bg-dark text-white shadow-xl'
                    : 'border-line bg-white shadow-sm'
                }`}
              >
                {p.popular && (
                  <span className="absolute right-4 top-4 rounded bg-brand px-2 py-1 text-[10px] font-bold text-dark">
                    POPULAR
                  </span>
                )}
                <span
                  className={`text-xs font-bold uppercase ${
                    p.popular ? 'text-lilac' : 'text-muted'
                  }`}
                >
                  {p.name}
                </span>
                <div className="mt-2 text-3xl font-bold">
                  ${p.price}
                  <span className={`ml-1 text-sm font-medium ${p.popular ? 'text-wash/70' : 'text-muted'}`}>
                    / {p.days} days
                  </span>
                </div>
                <ul
                  className={`mt-4 space-y-2 text-xs ${
                    p.popular ? 'text-slate-300' : 'text-muted'
                  }`}
                >
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <Check size={14} className="mt-0.5 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-xs font-bold ${
                    p.popular ? 'bg-lilac text-dark' : 'bg-soft text-dark hover:bg-wash'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 border-t border-line bg-white py-16">
        <div className="wrap max-w-3xl">
          <div className="mb-12 text-center">
            <Tag>FAQ</Tag>
            <h2 className="t-section mt-4 text-dark">Questions, answered</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl border border-line bg-page">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                  aria-expanded={faqOpen === i}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left text-sm font-bold text-dark"
                >
                  <span>{f.q}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-line bg-white font-medium text-muted">
                    {faqOpen === i ? '−' : '+'}
                  </span>
                </button>
                {faqOpen === i && (
                  <div className="border-t border-soft px-6 pb-6 pt-4 text-sm leading-relaxed text-muted">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}