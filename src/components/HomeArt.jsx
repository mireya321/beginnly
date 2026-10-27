// Original line illustrations for the homepage cards.
// They only use your existing theme colors (CSS variables from index.css).

const brand = 'var(--color-brand)'
const wash = 'var(--color-wash)'
const line = 'var(--color-line)'
const ink = 'var(--color-ink)'

function Dots({ x, y, cols, rows, gap = 12 }) {
  const out = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push(
        <circle key={`${r}-${c}`} cx={x + c * gap} cy={y + r * gap} r="1.6" fill={line} />
      )
    }
  }
  return <g>{out}</g>
}

// Honest levels: a ladder of labeled steps, one selected
export function LevelsArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" role="img" aria-label="A ladder of experience levels with one selected">
      <Dots x={14} y={14} cols={5} rows={3} />
      <rect x="52" y="22" width="120" height="26" rx="13" fill="#fff" stroke={line} />
      <rect x="64" y="31" width="52" height="8" rx="4" fill={line} />
      <rect x="40" y="58" width="150" height="30" rx="15" fill={wash} stroke={brand} strokeWidth="1.5" />
      <circle cx="58" cy="73" r="8" fill={brand} />
      <path d="M54 73l3 3 6-6" stroke="#031d22" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="74" y="69" width="78" height="8" rx="4" fill={brand} opacity="0.35" />
      <rect x="64" y="98" width="130" height="26" rx="13" fill="#fff" stroke={line} />
      <rect x="76" y="107" width="44" height="8" rx="4" fill={line} />
      <Dots x={176} y={104} cols={4} rows={3} />
    </svg>
  )
}

// Listings expire: a ring that runs out
export function ExpiryArt() {
  const cx = 120
  const cy = 72
  const r = 44
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" role="img" aria-label="A countdown ring">
      <Dots x={186} y={14} cols={4} rows={3} />
      <Dots x={14} y={104} cols={4} rows={3} />
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={line} strokeWidth="10" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={brand}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${c * 0.72} ${c}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <path d={`M${cx} ${cy - 18}v18l12 8`} stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="150" y="108" width="52" height="22" rx="11" fill={wash} stroke={brand} strokeWidth="1.2" />
      <rect x="160" y="116" width="32" height="6" rx="3" fill={brand} opacity="0.5" />
    </svg>
  )
}

// Verified employers: a job card with a badge
export function VerifiedArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" role="img" aria-label="A job card with a verified badge">
      <Dots x={16} y={16} cols={4} rows={3} />
      <rect x="48" y="26" width="144" height="98" rx="20" fill="#fff" stroke={line} />
      <rect x="64" y="42" width="30" height="30" rx="10" fill={wash} />
      <rect x="104" y="46" width="62" height="8" rx="4" fill={ink} opacity="0.8" />
      <rect x="104" y="62" width="40" height="7" rx="3.5" fill={line} />
      <rect x="64" y="86" width="44" height="18" rx="9" fill={wash} />
      <rect x="114" y="86" width="36" height="18" rx="9" fill={wash} />
      <g transform="translate(168 18)">
        <path d="M24 2l20 7v14c0 14-9 24-20 28C13 47 4 37 4 23V9z" fill={brand} />
        <path d="M14 26l7 7 13-14" stroke="#031d22" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}