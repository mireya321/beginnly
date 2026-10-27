import { Link } from 'react-router-dom'
import Logo from './Logo'
import { SITE_NAME } from '../config'

function Col({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm text-wash/70">{children}</ul>
    </div>
  )
}

// withCta adds the big closing headline row used on the landing page
export default function Footer({ withCta = false }) {
  const link = 'transition-colors hover:text-white'
  return (
    <footer
      className={`relative overflow-hidden border-t border-brand/20 bg-dark text-wash ${
        withCta ? '' : 'mt-16'
      }`}
    >
      <div className="wrap relative z-10 py-16">
        {withCta && (
          <div className="flex flex-col items-start justify-between gap-6 border-b border-brand/20 pb-16 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="t-display text-white">Start with a role that fits</h2>
              <p className="mt-4 text-base text-wash/70">
                Honest levels. Listings that expire. Less noise.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="rounded-xl bg-white px-6 py-4 text-sm font-semibold text-dark transition hover:bg-wash"
              >
                Browse jobs
              </Link>
              <a
                href="/#pricing"
                className="rounded-xl border border-brand/40 bg-brand/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand/20"
              >
                Post a job
              </a>
            </div>
          </div>
        )}

        <div className={`grid gap-8 md:grid-cols-4 ${withCta ? 'pt-16' : ''}`}>
          <div className="space-y-4">
            <Link to="/" className="group inline-block" aria-label="Home">
              <Logo tone="dark" />
            </Link>
            <p className="text-sm leading-relaxed text-wash/70">
              A cleaner job board for people starting out. Honest experience
              levels, listings that expire, less noise.
            </p>
          </div>

          <Col title="Job seekers">
            <li>
              <Link to="/jobs" className={link}>
                Browse all jobs
              </Link>
            </li>
            <li>
              <a href="/#how" className={link}>
                How it works
              </a>
            </li>
            <li>
              <a href="/#faq" className={link}>
                FAQ
              </a>
            </li>
          </Col>

          <Col title="Employers">
            <li>
              <a href="/#features" className={link}>
                Why post here
              </a>
            </li>
            <li>
              <a href="/#pricing" className={link}>
                Plans
              </a>
            </li>
          </Col>

          <Col title="Sources">
            <li>
              <a
                href="https://www.adzuna.com"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                Jobs by Adzuna
              </a>
            </li>
          </Col>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-brand/10 pt-8 text-xs text-wash/50 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="dot-grid h-24 opacity-30 [mask-image:linear-gradient(to_top,#000,transparent)]"
      />
    </footer>
  )
}