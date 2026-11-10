// Builds https://beginnly.com/sitemap.xml from the live jobs in Supabase.
// Google reads this to find every job page.
const SITE = 'https://beginnly.com'
const MAX_AGE_DAYS = 45
const PAGE_SIZE = 1000

const STATIC_PAGES = ['/jobs', '/resources', '/contact', '/privacy']

function urlTag(path, lastmod) {
  return (
    '  <url>\n' +
    `    <loc>${SITE}${path}</loc>\n` +
    (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
    '  </url>\n'
  )
}

async function fetchJobIds() {
  const base = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!base || !key) return []

  const since = new Date(Date.now() - MAX_AGE_DAYS * 86400000).toISOString()
  const rows = []

  for (let page = 0; page < 40; page++) {
    const from = page * PAGE_SIZE
    const url =
      `${base}/rest/v1/jobs?select=id,date_posted` +
      `&is_active=eq.true` +
      `&date_posted=gte.${encodeURIComponent(since)}` +
      `&experience_level=not.is.null` +
      `&order=date_posted.desc,id.asc`

    const r = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Range-Unit': 'items',
        Range: `${from}-${from + PAGE_SIZE - 1}`,
      },
    })
    if (!r.ok) break
    const batch = await r.json()
    rows.push(...batch)
    if (batch.length < PAGE_SIZE) break
  }
  return rows
}

export default async function handler(req, res) {
  let jobs = []
  try {
    jobs = await fetchJobIds()
  } catch {
    jobs = []
  }

  const today = new Date().toISOString().slice(0, 10)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for (const p of STATIC_PAGES) xml += urlTag(p, today)
  for (const j of jobs) {
    const d = j.date_posted ? String(j.date_posted).slice(0, 10) : undefined
    xml += urlTag(`/jobs/${j.id}`, d)
  }
  xml += '</urlset>\n'

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}