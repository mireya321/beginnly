import { Check } from 'lucide-react'
import SubscribeForm from './SubscribeForm'

const POINTS = [
  'Only jobs with no required experience',
  'One free email a week',
  'Unsubscribe anytime in 1 click',
]

// Job alerts section: dark panel on the left, white form card on the right.
// Used at the bottom of the board and the job page.
export default function SubscribeSection({ defaultCategory = 'all' }) {
  return (
    <section id="alerts" className="bg-paper-2 py-16 sm:py-24">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-3xl bg-forest p-8 text-white sm:p-12 lg:col-span-5">
            <h2 className="t-h4 text-white">
              Never miss an entry-level job.
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/75">
              Tell us the kind of job you want. Once a week, we'll email you new jobs that don't
              require experience.
            </p>

            <ul className="mt-10">
              {POINTS.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-4 border-t border-line-dark py-5 text-base font-medium"
                >
                  <Check size={18} className="shrink-0 text-highlight" strokeWidth={2.5} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-line bg-white p-8 sm:p-12 lg:col-span-7">
            <h3 className="mb-8 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Get new jobs every week
            </h3>
            <SubscribeForm defaultCategory={defaultCategory} />
          </div>
        </div>
      </div>
    </section>
  )
}