import { supabase } from './supabase'
import {
  JOBS_TABLE,
  MAX_AGE_DAYS,
  EXPERIENCE_LEVELS,
  HIDDEN_CATEGORIES,
} from '../config'

export const DEFAULT_FILTERS = {
  levels: [],
  categories: [],
  fields: [],
  workTypes: [],
  state: '',
  usOnly: false,
  location: '',
  minPay: 0,
  payListedOnly: false,
  includeOlder: false,
  includeNoDate: false,
  includeNoLevel: false,
}

const CARD_COLUMNS =
  'id, title, company, location, salary_text, salary_min, salary_max, url, source, category, field, work_type, state, country, annual_min, experience_level, date_posted'

function sinceDate() {
  return new Date(Date.now() - MAX_AGE_DAYS * 86400000).toISOString()
}

const quote = (v) => `"${v}"`
const cleanText = (v) => String(v || '').trim().replace(/[%,()"]/g, ' ')

function applyFilters(q, f) {
  const since = sinceDate()
  q = q.eq('is_active', true)

  // Dates: recent jobs always show; older and undated only when chosen
  const dateParts = [`date_posted.gte.${since}`]
  if (f.includeOlder) dateParts.push(`date_posted.lt.${since}`)
  if (f.includeNoDate) dateParts.push('date_posted.is.null')
  q = q.or(dateParts.join(','))

  // Experience level
  const dbValues = EXPERIENCE_LEVELS.filter((l) =>
    f.levels.includes(l.label)
  ).flatMap((l) => l.values)

  if (dbValues.length) {
    if (f.includeNoLevel) {
      q = q.or(
        `experience_level.in.(${dbValues.map(quote).join(',')}),experience_level.is.null`
      )
    } else {
      q = q.in('experience_level', dbValues)
    }
  } else if (!f.includeNoLevel) {
    q = q.not('experience_level', 'is', null)
  }

  // Job field
  if (f.fields && f.fields.length) {
    q = q.in('field', f.fields)
  }

  // Remote / hybrid / onsite
  if (f.workTypes && f.workTypes.length) {
    q = q.in('work_type', f.workTypes)
  }

  // Location: US only, a state, or words in the location text
  if (f.usOnly) q = q.eq('country', 'US')
  if (f.state) q = q.eq('state', f.state)
  const place = cleanText(f.location)
  if (place) q = q.ilike('location', `%${place}%`)

  // Pay (yearly). Jobs with no pay listed are hidden when either is used.
  if (f.minPay > 0) {
    q = q.gte('annual_min', f.minPay)
  } else if (f.payListedOnly) {
    q = q.not('annual_min', 'is', null)
  }

  // Category
  if (f.categories.length) {
    q = q.in('category', f.categories)
  } else if (HIDDEN_CATEGORIES.length) {
    q = q.not('category', 'in', `(${HIDDEN_CATEGORIES.join(',')})`)
  }

  // Search
  const term = cleanText(f.search)
  if (term) q = q.or(`title.ilike.%${term}%,company.ilike.%${term}%`)

  return q
}

export async function fetchJobs({ sort, page, pageSize, ...filters }) {
  let q = supabase
    .from(JOBS_TABLE)
    .select(CARD_COLUMNS, { count: 'estimated' })
  q = applyFilters(q, { ...DEFAULT_FILTERS, ...filters })
  if (sort !== 'oldest' && sort !== 'pay') q = q.order('featured', { ascending: false })
  if (sort === 'oldest') {
    q = q.order('date_posted', { ascending: true, nullsFirst: false })
  } else if (sort === 'pay') {
    q = q.order('salary_max', { ascending: false, nullsFirst: false })
  } else {
    q = q.order('date_posted', { ascending: false, nullsFirst: false })
  }
  q = q.order('id')

  const from = page * pageSize
  q = q.range(from, from + pageSize - 1)

  const { data, error, count } = await q
  if (error) throw error
  return {
    jobs: data ?? [],
    total: count ?? 0,
    hasMore: (data?.length ?? 0) === pageSize,
  }
}

export async function fetchLiveCount() {
  let q = supabase
    .from(JOBS_TABLE)
    .select('id', { count: 'estimated', head: true })
  q = applyFilters(q, DEFAULT_FILTERS)
  const { count, error } = await q
  if (error) throw error
  return count ?? 0
}

export async function fetchJob(id) {
  const { data, error } = await supabase
    .from(JOBS_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

// More jobs from the same field (or the same category, for older jobs without a field)
export async function fetchSimilar(job, limit = 3) {
  if (!job.field && !job.category) return []
  let q = supabase
    .from(JOBS_TABLE)
    .select(CARD_COLUMNS)
    .eq('is_active', true)
    .neq('id', job.id)
    .gte('date_posted', sinceDate())
    .not('experience_level', 'is', null)
  q = job.field ? q.eq('field', job.field) : q.eq('category', job.category)
  if (job.experience_level) q = q.eq('experience_level', job.experience_level)
  const { data, error } = await q
    .order('date_posted', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}