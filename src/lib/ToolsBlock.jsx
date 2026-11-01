import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Arrow from './Arrow'

const pill = (active) =>
  `rounded-lg px-5 py-2 text-base transition-colors ${
    active ? 'bg-white text-ink shadow-sm' : 'text-ink/80 hover:text-ink'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="wrap flex h-[84px] items-center justify-between gap-4">
        <Link to="/jobs" aria-label="Beginnly jobs" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-xl bg-paper-2 p-1.5 md:flex">
          <NavLink to="/jobs" end className={({ isActive }) => pill(isActive)}>
            Jobs
          </NavLink>
          <a href="/jobs#alerts" className={pill(false)}>
            Job alerts
          </a>
        </nav>

        <div className="hidden md:block">
          <a href="/jobs#alerts" className="btn">
            Get job alerts
            <Arrow />
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
            <Link
              to="/jobs"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-paper-2 px-4 py-3 font-semibold"
            >
              Jobs
            </Link>
            <a
              href="/jobs#alerts"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-highlight px-4 py-3 text-center font-semibold"
            >
              Get job alerts
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
