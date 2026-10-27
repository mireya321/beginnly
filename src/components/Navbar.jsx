import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../lib/auth'

const ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Job Board' },
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  useLocation() // re-render on route change so the active pill updates

  const pill = (active) =>
    `rounded-xl px-4 py-2 text-xs font-bold transition-all ${
      active
        ? 'bg-dark text-white shadow-sm'
        : 'text-dark/70 hover:bg-lilac/50 hover:text-dark'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-dark/10 bg-page/90 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="Home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-brand/30 bg-wash/60 p-1 lg:flex">
          {ITEMS.map((it) =>
            it.to ? (
              <NavLink
                key={it.label}
                to={it.to}
                end={it.end}
                className={({ isActive }) => pill(isActive)}
              >
                {it.label}
              </NavLink>
            ) : (
              <a key={it.label} href={it.href} className={pill(false)}>
                {it.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to={user ? '/employer' : '/login'}
            className="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold text-dark hover:bg-lilac/50"
          >
            {user ? 'Dashboard' : 'Log in'}
          </Link>
          <Link
            to={user ? '/employer/post' : '/signup'}
            className="whitespace-nowrap rounded-xl border border-brand/40 bg-lilac px-4 py-2 text-xs font-bold text-dark shadow-sm transition-all hover:bg-brand"
          >
            + Post a job
          </Link>
        </div>

        <button
          className="rounded-xl p-2 text-dark hover:bg-wash lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-b border-line bg-white lg:hidden">
          <div className="wrap space-y-2 py-4">
            {ITEMS.map((it) =>
              it.to ? (
                <Link
                  key={it.label}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-page px-4 py-3 text-xs font-bold text-dark"
                >
                  {it.label}
                </Link>
              ) : (
                <a
                  key={it.label}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-page px-4 py-3 text-xs font-bold text-dark"
                >
                  {it.label}
                </a>
              )
            )}
            <Link
              to={user ? '/employer' : '/login'}
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-page px-4 py-3 text-xs font-bold text-dark"
            >
              {user ? 'Dashboard' : 'Log in'}
            </Link>
            <Link
              to={user ? '/employer/post' : '/signup'}
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-lilac px-4 py-3 text-center text-xs font-bold text-dark"
            >
              + Post a job
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}