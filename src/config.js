export const SITE_NAME = 'Beginnly'

export const MISSION =
  "Beginnly is a cleaner job board. Every listing expires on time, can't be endlessly reposted, and is labeled with the experience it actually requires, so you spend less time sorting through noise and more time applying."

export const JOBS_TABLE = 'jobs'

// Listings older than this are hidden unless a visitor ticks "45 days +"
export const MAX_AGE_DAYS = 45

export const PAGE_SIZE = 20

// label = what visitors see
// values = the exact text stored in your database (empty = no jobs yet, hidden from the filter)
export const EXPERIENCE_LEVELS = [
  { label: 'Entry-level', hint: 'Posting says entry level', values: ['Truly Entry Level'] },
  { label: 'Years not listed', hint: 'No years of experience listed', values: ['Years not listed'] },
  // Kept so old job pages can still show a label, but hidden from the filter
  { label: 'Starter', hint: 'Up to 1 year', values: [], inFilter: false },
  { label: 'Early career', hint: '1-3 years', values: ['Some Experience (1-3 yrs)'], inFilter: false },
  { label: 'Mid-level', hint: '3-5 years', values: ['Mid Level (3-5 yrs)'], inFilter: false },
  { label: 'Senior', hint: '5-10 years', values: ['Senior (5+ yrs)'], inFilter: false },
  { label: 'Expert', hint: '10+ years', values: [], inFilter: false },
]
// The job fields shown on cards and used for the pills at the top of the board.
// Must match the text stored in the "field" column.
export const FIELDS = [
  'Customer support & retail',
  'Admin & office',
  'Sales',
  'Accounting & finance',
  'Legal & compliance',
  'Data & analytics',
  'Software & IT',
  'Cybersecurity',
  'Healthcare',
  'Marketing & content',
  'Design',
  'HR & recruiting',
  'Teaching & education',
  'Operations & strategy',
  'Trades & manufacturing',
  'Engineering & science',
  'Other',
]

// value = text in your database, label = what visitors see
export const CATEGORIES = [
  { value: 'accounting-finance-jobs', label: 'Accounting & Finance' },
  { value: 'admin-jobs', label: 'Admin' },
  { value: 'engineering-jobs', label: 'Engineering' },
  { value: 'graduate-jobs', label: 'Graduate' },
  { value: 'hr-jobs', label: 'HR' },
  { value: 'it-jobs', label: 'IT' },
  { value: 'legal-jobs', label: 'Legal' },
  { value: 'sales-jobs', label: 'Sales' },
  { value: 'social-work-jobs', label: 'Social Work' },
  { value: 'teaching-jobs', label: 'Teaching' },
  { value: 'healthcare-nursing-jobs', label: 'Healthcare & Nursing' },
  { value: 'energy-oil-gas-jobs', label: 'Energy' },
  { value: 'company-direct', label: 'Company direct' },
  { value: 'manufacturing-jobs', label: 'Manufacturing' },
  { value: 'trade-construction-jobs', label: 'Trades & Construction' },
  { value: 'logistics-warehouse-jobs', label: 'Logistics & Warehouse' },
]

// Hidden unless a visitor ticks them in the Category filter. Use [] to show everything.
export const HIDDEN_CATEGORIES = [
  'manufacturing-jobs',
  'trade-construction-jobs',
  'logistics-warehouse-jobs',
]