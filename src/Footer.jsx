import { Check } from 'lucide-react'
import SubscribeForm from './SubscribeForm'

const POINTS = [
  'Only jobs with no required experience',
  'No spam. One email a week, at most',
  'Unsubscribe anytime with 1 click',
]

// Job alerts block for the job page: dark box on the left, form on the right
export default function AlertsCard({ defaultCategory = 'all' }) {
  return (
    <section id="alerts" className="wrap py-16">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-forest p-8 text-white sm:p-10 lg:col-span-5">
          <div>
            <h2 className="mb-4 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Never miss an entry-level role.
            </h2>
            <p className="mb-10 text-sm leading-relaxed text-white/75 sm:text-base">
              Get new jobs that don't require experience, delivered to your inbox once a week.
            </p>
          </div>

          <ul className="space-y-4 border-t border-line-dark pt-6">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-highlight text-ink">
                  <Check size={12} strokeWidth={3.5} />
                </span>
                <span className="text-sm font-medium text-white/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
          <h3 className="mb-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Sign up for job alerts
          </h3>
          <p className="mb-8 text-sm text-slate">
            Tell us the kind of job you want and your email. We'll do the rest.
          </p>
          <div className="max-w-xl">
            <SubscribeForm defaultCategory={defaultCategory} />
          </div>
        </div>
      </div>
    </section>
  )
}
