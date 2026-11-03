import { Check } from 'lucide-react'
import SubscribeForm from './SubscribeForm'

const POINTS = [
  'Only jobs with no required experience',
  'Free to join',
  'Unsubscribe anytime',
]

// Dark card on the left, form on the right
export default function SubscribeSection({ defaultCategory = 'all' }) {
  return (
    <section id="alerts" className="bg-paper-2 py-16">
      <div className="wrap grid gap-6 lg:grid-cols-[5fr_6fr]">
        <div className="rounded-[28px] bg-forest p-8 text-white md:p-12">
          <h2 className="t-h3 text-white">
            Never miss a true <span className="mark text-ink">entry-level</span> job.
          </h2>
          <p className="mt-5 text-lg text-white/70">
            Add your email and get new jobs that don't require experience, once a week.
          </p>
          <ul className="mt-8 divide-y divide-line-dark border-t border-line-dark">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 py-4">
                <Check size={18} className="text-highlight" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-8 md:p-10">
          <h3 className="t-h4 mb-6">Get new jobs every week</h3>
          <SubscribeForm defaultCategory={defaultCategory} />
        </div>
      </div>
    </section>
  )
}
