import { Link } from 'react-router-dom'
import { SITE_NAME } from '../config'

function Col({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-highlight">{title}</p>
      <ul className="mt-4 space-y-2 text-[15px] text-white/90">{children}</ul>
    </div>
  )
}

export default function Footer() {
  const link = 'transition-colors hover:text-highlight'
  return (
    <footer className="relative overflow-hidden bg-forest text-white">
      <div className="wrap pt-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <p className="text-lg leading-snug text-white/90">
              Entry-level jobs that don't ask for experience. Built for your first job.
            </p>
          </div>
          <div className="flex gap-16">
            <Col title="Menu">
              <li>
                <Link to="/jobs" className={link}>
                  Jobs
                </Link>
              </li>
              <li>
                <a href="/jobs#alerts" className={link}>
                  Job alerts
                </a>
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

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-line-dark pt-6 text-xs uppercase tracking-wider text-white/60 sm:flex-row">
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
        style={{ fontSize: 'clamp(72px, 19vw, 300px)', marginBottom: '-0.12em', paddingTop: '0.1em' }}
      >
        {SITE_NAME}
      </div>
    </footer>
  )
}
