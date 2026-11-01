// ─────────────────────────────────────────────────────────────────────────────
// TOOLS SHOWN ON EACH JOB PAGE
// This is the one file you edit to add, change or remove tools.
// To add a tool, copy one block below, paste it at the end of the TOOLS list
// (before the final  ]  ), and change the words.
//
//   id        a short unique name with no spaces (used to count clicks)
//   name      what people see
//   blurb     one short line under the name
//   url       the link people go to (must start with https://)
//   type      'free'      -> no label
//             'paid'      -> shows "Paid link" (use for affiliate links)
//             'sponsored' -> shows "Sponsored" (use when a company pays you
//                            to be listed)
//   tracks    which kinds of jobs it shows on. Pick from the TRACKS names
//             below, or 'all' to show on every job.
//   enabled   true = visible, false = hidden
// ─────────────────────────────────────────────────────────────────────────────

// How a job is matched to a track: words in the job title.
// If nothing in the title matches, the job's category is tried next.
export const TRACKS = {
  data: /\b(data|analyst|analytics|business intelligence|bi\b|sql|research)\b/i,
  software: /\b(software|developer|engineer|engineering|frontend|front-end|backend|web|qa|it support|help desk|technician)\b/i,
  marketing: /\b(marketing|content|social media|seo|brand|communications|copywriter|growth)\b/i,
  sales: /\b(sales|account executive|business development|bdr|sdr|outreach)\b/i,
  support: /\b(customer (support|service|success)|support specialist|call center|client (service|support))\b/i,
  admin: /\b(admin|administrative|assistant|receptionist|coordinator|office|scheduler|clerk)\b/i,
  finance: /\b(account|accounting|bookkeep|finance|financial|payroll|billing|collections|audit|tax)\b/i,
  design: /\b(design|designer|ux|ui\b|graphic|creative|video)\b/i,
  hr: /\b(hr\b|human resources|recruit|talent|people operations)\b/i,
  operations: /\b(operations|logistics|supply chain|warehouse|procurement|project)\b/i,
  teaching: /\b(teach|teacher|tutor|instruction|education|curriculum|training)\b/i,
}

// Backup match by the job's category, used when the title matches no track
export const CATEGORY_TRACKS = {
  'customer support': ['support'],
  admin: ['admin'],
  accounting: ['finance'],
  sales: ['sales'],
  teaching: ['teaching'],
}

export const TOOLS = [
  // ── Free starter resources (real, free sites; edit or remove any you like)
  {
    id: 'sqlbolt',
    name: 'SQLBolt',
    blurb: 'Short, free lessons that teach SQL by doing.',
    url: 'https://sqlbolt.com',
    type: 'free',
    tracks: ['data', 'software', 'finance'],
    enabled: true,
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    blurb: 'Free coding courses and projects for your portfolio.',
    url: 'https://www.freecodecamp.org',
    type: 'free',
    tracks: ['software', 'data', 'design'],
    enabled: true,
  },
  {
    id: 'hubspot-academy',
    name: 'HubSpot Academy',
    blurb: 'Free courses and certificates in marketing, sales and service.',
    url: 'https://academy.hubspot.com',
    type: 'free',
    tracks: ['marketing', 'sales', 'support'],
    enabled: true,
  },

  // ── Examples to copy. They stay hidden until you set enabled: true
  // and replace the url with your own link.
  {
    id: 'example-paid',
    name: 'Example course',
    blurb: 'One line about what this teaches.',
    url: '',
    type: 'paid',
    tracks: ['data'],
    enabled: false,
  },
  {
    id: 'example-sponsored',
    name: 'Example sponsor',
    blurb: 'One line about the sponsor.',
    url: '',
    type: 'sponsored',
    tracks: ['all'],
    enabled: false,
  },
]

const MAX_SHOWN = 4

function tracksFor(job) {
  const title = job.title || ''
  const found = Object.keys(TRACKS).filter((t) => TRACKS[t].test(title))
  if (found.length) return found
  const cat = String(job.category || '').toLowerCase()
  return CATEGORY_TRACKS[cat] || []
}

// Returns the tools to show for a job: sponsored first, then paid, then free
export function toolsForJob(job) {
  const mine = tracksFor(job)
  const rank = { sponsored: 0, paid: 1, free: 2 }
  return TOOLS.filter(
    (t) =>
      t.enabled &&
      t.url &&
      (t.tracks.includes('all') || t.tracks.some((x) => mine.includes(x)))
  )
    .sort((a, b) => rank[a.type] - rank[b.type])
    .slice(0, MAX_SHOWN)
}
