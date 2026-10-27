import { EXPERIENCE_LEVELS, CATEGORIES } from '../config'

export function formatPay(job) {
  if (job.salary_text && job.salary_text.trim()) return job.salary_text.trim()
  const fmt = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')
  if (job.salary_min && job.salary_max)
    return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}`
  if (job.salary_min) return `From ${fmt(job.salary_min)}`
  if (job.salary_max) return `Up to ${fmt(job.salary_max)}`
  return null
}

export function formatDate(value) {
  if (!value) return 'No date'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Database text -> your public level name
export function levelLabel(dbValue) {
  const hit = EXPERIENCE_LEVELS.find((l) => l.values.includes(dbValue))
  return hit ? hit.label : dbValue
}

// Database category -> readable name
export function categoryLabel(dbValue) {
  const hit = CATEGORIES.find((c) => c.value === dbValue)
  return hit ? hit.label : dbValue || 'General'
}