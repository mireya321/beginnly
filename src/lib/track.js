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
