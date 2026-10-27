// Dotted "halftone" line art for the landing page feature cards.
// Original shapes in the Beginnly palette.

export const HalftoneSphere = () => (
  <svg viewBox="0 0 200 200" className="mx-auto h-32 w-32 text-brand" aria-hidden="true">
    <defs>
      <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#979DF0" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#D1D4FA" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#E0E2FF" stopOpacity="0.2" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#sphereGrad)" />
    {Array.from({ length: 14 }).map((_, i) => (
      <ellipse
        key={i}
        cx="100"
        cy="100"
        rx={75 - i * 5}
        ry={20 + i * 4}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2, 6"
        className="animate-spin-slow"
        style={{ animationDuration: `${40 + i * 4}s` }}
      />
    ))}
  </svg>
)

export const HalftoneShield = () => (
  <svg viewBox="0 0 200 200" className="mx-auto h-32 w-32" aria-hidden="true">
    <path
      d="M100 20 L160 50 V110 C160 150 100 180 100 180 C100 180 40 150 40 110 V50 Z"
      fill="#E0E2FF"
      stroke="#979DF0"
      strokeWidth="2"
    />
    <path
      d="M100 35 L145 60 V105 C145 135 100 160 100 160 C100 160 55 135 55 105 V60 Z"
      fill="none"
      stroke="#979DF0"
      strokeWidth="1.5"
      strokeDasharray="4, 4"
    />
    <path
      d="M85 100 L95 110 L120 85"
      fill="none"
      stroke="#031D22"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const HalftoneConcentric = () => (
  <svg viewBox="0 0 200 200" className="mx-auto h-32 w-32" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <circle
        key={i}
        cx="100"
        cy="100"
        r={15 + i * 10}
        fill="none"
        stroke="#979DF0"
        strokeWidth={1 + i * 0.4}
        strokeDasharray={`${3 + i * 2}, ${4 + i}`}
        opacity={0.35 + i * 0.08}
      />
    ))}
    <circle cx="100" cy="100" r="8" fill="#031D22" />
  </svg>
)