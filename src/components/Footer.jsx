import { Link } from 'react-router-dom'
import { SITE_NAME } from '../config'

function Col({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-highlight">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm font-medium text-white/80">{children}</ul>
    </div>
  )
}

// Dark rounded footer card with the big wordmark
export default function Footer() {
  const link = 'transition-colors hover:text-white'
  return (
    <footer className="p-3">
      <div className="relative overflow-hidden rounded-3xl bg-forest text-white">
        <div className="wrap pt-14">
          <div className="grid gap-10 border-b border-line-dark pb-14 md:grid-cols-12">
            <p className="max-w-sm text-base font-medium text-white/90 md:col-span-5">
              Entry-level jobs that don't ask for experience. Built for your first job.
            </p>

            <div className="grid grid-cols-2 gap-6 md:col-span-7 md:grid-cols-3">
              <Col title="Menu">
                <li>
                  <Link to="/jobs" className={link}>
                    Open jobs
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={link}>
                    Contact us
                  </Link>
                </li>
              </Col>
              <Col title="Legal">
                <li>
                  <Link to="/privacy" className={link}>
                    Privacy policy
                  </Link>
                </li>
              </Col>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 py-6 text-[11px] font-medium uppercase tracking-wider text-white/60 sm:flex-row sm:items-center">
            <span>
              © {new Date().getFullYear()} {SITE_NAME} · All rights reserved
            </span>
            <Link to="/privacy" className={link}>
              Privacy policy
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="select-none overflow-hidden whitespace-nowrap text-center font-display font-extrabold leading-[0.8] tracking-tighter text-white"
          style={{ fontSize: 'clamp(72px, 19.5vw, 280px)', marginBottom: '-0.1em', paddingTop: '0.08em' }}
        >
          {SITE_NAME}
        </div>
      </div>
    </footer>
  )
}