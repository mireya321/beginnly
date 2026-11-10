import { SITE_NAME, MAX_AGE_DAYS } from '../config'

export const SITE_URL = 'https://beginnly.com'

function setMeta(attr, name, content) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function plainText(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function shorten(text, max = 155) {
  if (text.length <= max) return text
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

// Sets the page title, description, link preview text, canonical link,
// and (for job pages) the Google for Jobs data.
export function setSeo({ title, description, path = '/', jsonLd = null }) {
  const url = SITE_URL + path
  const desc = shorten(description || '')

  document.title = title
  setMeta('name', 'description', desc)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', desc)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', SITE_NAME)
  setCanonical(url)

  const old = document.getElementById('seo-jsonld')
  if (old) old.remove()
  if (jsonLd) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.id = 'seo-jsonld'
    s.textContent = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    document.head.appendChild(s)
  }
}

export function clearJobData() {
  const old = document.getElementById('seo-jsonld')
  if (old) old.remove()
}

// Everything for one job page. Only uses facts we actually have.
export function jobSeo(job, html) {
  const where = job.location ? ` in ${job.location}` : ''
  const body = plainText(html)
  const description = shorten(
    `${job.title} at ${job.company}${where}. ${body}`.trim()
  )

  const seo = {
    title: `${job.title} at ${job.company} | ${SITE_NAME}`,
    description,
    path: `/jobs/${job.id}`,
    jsonLd: null,
  }

  // Google for Jobs data: US jobs with a real description and posting date only
  const posted = job.date_posted ? new Date(job.date_posted) : null
  if (!posted || !body || job.country !== 'US') return seo

  const data = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: html,
    datePosted: posted.toISOString(),
    validThrough: new Date(posted.getTime() + MAX_AGE_DAYS * 86400000).toISOString(),
    directApply: false,
    hiringOrganization: { '@type': 'Organization', name: job.company },
  }

  if (job.work_type === 'Remote') {
    data.jobLocationType = 'TELECOMMUTE'
    data.applicantLocationRequirements = { '@type': 'Country', name: 'US' }
  } else {
    const address = { '@type': 'PostalAddress', addressCountry: 'US' }
    if (job.state) address.addressRegion = job.state
    const city = (job.location || '').split(',')[0].trim()
    if (job.state && (job.location || '').includes(',') && city) {
      address.addressLocality = city
    }
    data.jobLocation = { '@type': 'Place', address }
  }

  seo.jsonLd = data
  return seo
}