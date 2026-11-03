import { SITE_NAME } from '../config'

// Beginnly logo: the half-circle mark (public/logo.png) plus the wordmark
export default function Logo({ tone = 'light' }) {
  const dark = tone === 'dark'
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src="/logo.png" alt="" width="44" height="23" className="h-[23px] w-auto" />
      <span
        className={`font-display text-[26px] font-extrabold leading-none tracking-tight ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {SITE_NAME}
      </span>
    </span>
  )
}