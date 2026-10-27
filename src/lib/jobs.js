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
  includeOlder: false,
  includeNoDate: false,
  includeNoLevel: false,
}

function sinceDate() {
  return new Date(Date.now() - MAX_AGE_DAYS * 86400000).toISOString()
}

const quote = (v) => `"${v}"`

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

  // Category
  if (f.categories.length) {
    q = q.in('category', f.categories)
  } else if (HIDDEN_CATEGORIES.length) {
    q = q.not('category', 'in', `(${HIDDEN_CATEGORIES.join(',')})`)
  }

  // Search
  const term = (f.search || '').trim().replace(/[%,()"]/g, ' ')
  if (term) q = q.or(`title.ilike.%${term}%,company.ilike.%${term}%`)

  return q
}

export async function fetchJobs({ sort, page, pageSize, ...filters }) {
  let q = supabase
    .from(JOBS_TABLE)
    .select(
      'id, title, company, location, salary_text, salary_min, salary_max, url, source, category, experience_level, date_posted',
            { count: 'estimated' }
    )
  q = applyFilters(q, filters)
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

export async function fetchSimilar(job, limit = 3) {
  if (!job.category) return []
  let q = supabase
    .from(JOBS_TABLE)
    .select(
      'id, title, company, location, salary_text, salary_min, salary_max, url, source, category, experience_level, date_posted'
    )
    .eq('is_active', true)
    .eq('category', job.category)
    .neq('id', job.id)
    .gte('date_posted', sinceDate())
    .not('experience_level', 'is', null)
  if (job.experience_level) q = q.eq('experience_level', job.experience_level)
  const { data, error } = await q
    .order('date_posted', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}