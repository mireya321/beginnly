import { Check, Mail, Search, Sparkles } from 'lucide-react'
import SubscribeForm from './SubscribeForm'

const POINTS = [
  [Search, 'Only jobs with no required experience'],
  [Mail, 'One email a week, free'],
  [Sparkles, 'Unsubscribe anytime'],
]

// "Let's connect" style section: heading row, then a dark card and the form card
export default function SubscribeSection({ defaultCategory = 'all' }) {
  return (
    <section id="alerts" className="bg-paper-2 py-16 sm:py-20">
      <div className="wrap">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
          Job alerts
        </span>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="t-h3 sm:text-5xl">Never miss a job.</h2>
          <p className="max-w-md text-sm text-slate">
            Tell us the kind of job you want. Once a week, we'll email you new entry-level jobs
            that don't require experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="grid gap-6 md:col-span-1">
            {POINTS.map(([Icon, text], i) => (
              <div
                key={text}
                className={`flex min-h-[150px] flex-col justify-between rounded-3xl border border-line p-6 ${
                  i === 0 ? 'bg-highlight text-ink' : 'bg-forest-light text-white'
                }`}
              >
                <Icon size={24} className={i === 0 ? 'text-ink' : 'text-highlight'} />
                <p className="flex items-center gap-2 font-display text-xl font-bold leading-tight">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-line bg-white p-8 md:col-span-2 md:p-10">
            <h3 className="t-h4 mb-6">Get new jobs every week</h3>
            <div className="max-w-xl">
              <SubscribeForm defaultCategory={defaultCategory} />
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate">
              <Check size={14} className="text-primary" />
              We only use your email to send the weekly jobs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
