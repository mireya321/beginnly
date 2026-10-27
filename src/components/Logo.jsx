import { SITE_NAME } from '../config'

// Original mark: dark tile with three rising bars
export default function Logo({ tone = 'light', subtitle = true }) {
  const dark = tone === 'dark'
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${
          dark ? 'bg-gradient-to-tr from-brand via-lilac to-wash' : 'bg-dark'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="10" width="3.5" height="7" rx="1.75" fill={dark ? '#031d22' : '#D1D4FA'} />
          <rect x="8.25" y="6" width="3.5" height="11" rx="1.75" fill={dark ? '#031d22' : '#979DF0'} />
          <rect x="13.5" y="2" width="3.5" height="15" rx="1.75" fill={dark ? '#031d22' : '#E0E2FF'} />
        </svg>
      </span>
      <span className="flex flex-col text-left">
        <span
          className={`text-base font-semibold leading-none tracking-tight ${
            dark ? 'text-white' : 'text-dark'
          }`}
        >
          {SITE_NAME}
        </span>
        {subtitle && (
          <span
            className={`mt-1 font-mono text-[10px] leading-none ${
              dark ? 'text-wash/60' : 'text-muted'
            }`}
          >
            Honest experience levels
          </span>
        )}
      </span>
    </span>
  )
}