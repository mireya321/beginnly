import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Arrow from './Arrow'

// The landing page. When your landing page moves to beginnly.com,
// change this one line and the whole site updates.
const HOME_URL = 'https://beginnly.framer.website/'

const pill = (active) =>
  `rounded-lg px-4 py-2 text-sm transition-colors ${
    active ? 'bg-highlight font-bold text-ink shadow-sm' : 'font-semibold text-slate hover:text-ink'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="wrap flex h-20 items-center justify-between gap-4">
        <a href={HOME_URL} aria-label="Beginnly home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 rounded-2xl bg-paper-2 p-1.5 md:flex">
          <a href={HOME_URL} className={pill(false)}>
            Home
          </a>
          <NavLink to="/jobs" end className={({ isActive }) => pill(isActive)}>
            Jobs
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => pill(isActive)}>
            Contact us
          </NavLink>
        </nav>

        <div className="hidden md:block">
          <a href="/jobs#alerts" className="btn btn-dark">
            Get job alerts
            <Arrow size={15} />
          </a>
        </div>

        <button
          className="rounded-xl p-2 text-ink hover:bg-paper-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <div className="wrap space-y-2 py-4">
            <a
              href={HOME_URL}
              className="block rounded-xl bg-paper-2 px-4 py-3 font-semibold"
            >
              Home
            </a>
            <Link
              to="/jobs"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-highlight px-4 py-3 font-bold"
            >
              Jobs
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-paper-2 px-4 py-3 font-semibold"
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}