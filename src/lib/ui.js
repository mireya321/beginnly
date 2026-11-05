// Small helpers shared by the board and the job page

export function ago(v) {
  if (!v) return ''
  const days = Math.floor((Date.now() - new Date(v).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function daysOld(v) {
  if (!v) return null
  return Math.floor((Date.now() - new Date(v).getTime()) / 86400000)
}

export const longDate = (v) =>
  new Date(v).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const initialOf = (name) => (name || '?').trim().charAt(0).toUpperCase()

const ENTRY = 'Truly Entry Level'

// The short note about experience shown on cards and the job page.
// Jobs on the board have already been checked, so for entry-level jobs we can
// say what the posting allows. Uses the description when it is loaded.
export function experienceNote(job, levelLabel) {
  const level = job.experience_level
  if (level && level !== ENTRY) return levelLabel ? levelLabel(level) : level

  const text = String(job.description_text || job.description || '')
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()

  if (text) {
    if (/(coursework|course work|academic projects?|personal projects?|school projects?|class projects?|internships?)[^.]{0,60}(accepted|count|counts|considered|welcome|qualif)/.test(text) ||
        /(accepted|considered|welcome)[^.]{0,40}(coursework|projects|internship)/.test(text)) {
      return 'Coursework or projects accepted'
    }
    const m = text.match(/(\d{1,2})\s*\+?\s*(?:-|to)?\s*\d{0,2}\s*\+?\s*years?[^.]{0,80}(preferred|a plus|is a plus|nice to have|desired|bonus)/)
    if (m) return `${m[1]}+ yrs preferred`
  }
  return 'No experience listed'
}

// A short one-line summary for the top of the job page: the first sentence of
// thea// Small helpers shared by the board and the job page

export function ago(v) {
  if (!v) return ''
  const days = Math.floor((Date.now() - new Date(v).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function daysOld(v) {
  if (!v) return null
  return Math.floor((Date.now() - new Date(v).getTime()) / 86400000)
}

export const longDate = (v) =>
  new Date(v).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const initialOf = (name) => (name || '?').trim().charAt(0).toUpperCase()

export const ENTRY = 'Truly Entry Level'
export const NOT_LISTED = 'Years not listed'

// True only when the posting says entry level in words
export const isEntry = (job) => job.experience_level === ENTRY

// The field shown on cards and the job page. Older jobs without a field fall
// back to the old label that was passed in.
export const fieldOf = (job, fallback) => job.field || fallback

// The short note about experience shown on cards and the job page.
// Levels above entry are shown as they are. For the two entry tiers we look at
// the description to say what the posting allows.
export function experienceNote(job, levelLabel) {
  const level = job.experience_level
  const tier = level === ENTRY || level === NOT_LISTED
  if (level && !tier) return levelLabel ? levelLabel(level) : level

  const text = String(job.description_text || job.description || '')
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()

  if (text) {
    if (/(coursework|course work|academic projects?|personal projects?|school projects?|class projects?|internships?)[^.]{0,60}(accepted|count|counts|considered|welcome|qualif)/.test(text) ||
        /(accepted|considered|welcome)[^.]{0,40}(coursework|projects|internship)/.test(text)) {
      return 'Coursework or projects accepted'
    }
    const m = text.match(/(\d{1,2})\s*\+?\s*(?:-|to)?\s*\d{0,2}\s*\+?\s*years?[^.]{0,80}(preferred|a plus|is a plus|nice to have|desired|bonus)/)
    if (m) return `${m[1]}+ yrs preferred`
  }
  return level === ENTRY ? 'No experience required' : NOT_LISTED
}

// True when the note says something specific (not just the label again)
export const isSpecificNote = (note) =>
  note !== 'No experience required' && note !== NOT_LISTED

// A short one-line summary for the top of the job page: the first sentence of
// the description, only when it reads cleanly. Otherwise returns ''.
export function leadSentence(job) {
  const text = String(job.description_text || job.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&amp;|&#39;|&quot;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const m = text.match(/^(.{40,170}?[.!])(\s|$)/)
  if (!m) return ''
  const s = m[1].trim()
  if (/https?:|@|\d{4,}/.test(s)) return ''
  return s
} description, only when it reads cleanly. Otherwise returns ''.
export function leadSentence(job) {
  const text = String(job.description_text || job.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&amp;|&#39;|&quot;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const m = text.match(/^(.{40,170}?[.!])(\s|$)/)
  if (!m) return ''
  const s = m[1].trim()
  if (/https?:|@|\d{4,}/.test(s)) return ''
  return s
}