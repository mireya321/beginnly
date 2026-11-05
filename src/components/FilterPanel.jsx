import { useState } from 'react'
import { Check, ChevronUp } from 'lucide-react'
import { EXPERIENCE_LEVELS, FIELDS, MAX_AGE_DAYS } from '../config'
import { DEFAULT_FILTERS } from '../lib/jobs'

const WORK_TYPES = ['Remote', 'Hybrid', 'Onsite']

const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
]

const PAY_STEPS = [
  [0, 'Any pay'],
  [30000, '$30,000+ a year'],
  [40000, '$40,000+ a year'],
  [50000, '$50,000+ a year'],
  [60000, '$60,000+ a year'],
  [80000, '$80,000+ a year'],
  [100000, '$100,000+ a year'],
]

const field =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-[15px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

function Box({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-white peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
        {checked && <Check size={13} className="text-white" />}
      </span>
      <span className="text-[15px]">{label}</span>
      {hint && <span className="ml-auto text-xs text-muted">{hint}</span>}
    </label>
  )
}

function Group({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm text-muted"
      >
        {title}
        <ChevronUp
          size={16}
          className={`transition ${open ? '' : 'rotate-180'}`}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

// `defaults` = what the board starts with (used by "Clear filters")
export default function FilterPanel({ filters, onChange, defaults = DEFAULT_FILTERS }) {
  function toggleList(key, value) {
    const list = filters[key] || []
    onChange({
      [key]: list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value],
    })
  }

  const levels = EXPERIENCE_LEVELS.filter((l) => l.values.length > 0)
  const isDefault = JSON.stringify(filters) === JSON.stringify(defaults)

  return (
    <div>
      <Group title="Work type">
        {WORK_TYPES.map((w) => (
          <Box
            key={w}
            checked={(filters.workTypes || []).includes(w)}
            onChange={() => toggleList('workTypes', w)}
            label={w}
          />
        ))}
        <p className="mt-1 text-xs text-muted">
          Some postings don't say. Those show up when no work type is ticked.
        </p>
      </Group>

      <Group title="Location">
        <Box
          checked={filters.usOnly}
          onChange={() => onChange({ usOnly: !filters.usOnly })}
          label="US jobs only"
        />
        <div className="mt-2 space-y-2">
          <select
            value={filters.state || ''}
            onChange={(e) => onChange({ state: e.target.value })}
            className={field}
            aria-label="State"
          >
            <option value="">Any state</option>
            {STATES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <input
            value={filters.location || ''}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="City or place, e.g. Austin"
            className={field}
            aria-label="City or place"
          />
        </div>
      </Group>

      <Group title="Pay">
        <select
          value={filters.minPay || 0}
          onChange={(e) => onChange({ minPay: Number(e.target.value) })}
          className={field}
          aria-label="Minimum pay"
        >
          {PAY_STEPS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Box
          checked={filters.payListedOnly || filters.minPay > 0}
          onChange={() => onChange({ payListedOnly: !filters.payListedOnly })}
          label="Only jobs with pay listed"
        />
        <p className="text-xs text-muted">
          Many postings don't list pay, so choosing a minimum hides them.
        </p>
      </Group>

      <Group title="Experience level">
        {levels.map((l) => (
          <Box
            key={l.label}
            checked={filters.levels.includes(l.label)}
            onChange={() => toggleList('levels', l.label)}
            label={l.label}
            hint={l.hint}
          />
        ))}
        <Box
          checked={filters.includeNoLevel}
          onChange={() => onChange({ includeNoLevel: !filters.includeNoLevel })}
          label="Include no experience listed"
        />
      </Group>

      <Group title="Posted">
        <Box
          checked={filters.includeOlder}
          onChange={() => onChange({ includeOlder: !filters.includeOlder })}
          label={`${MAX_AGE_DAYS} days +`}
          hint="Older listings"
        />
        <Box
          checked={filters.includeNoDate}
          onChange={() => onChange({ includeNoDate: !filters.includeNoDate })}
          label="No date"
          hint="Date not listed"
        />
      </Group>

      <Group title="Job field">
        {FIELDS.map((f) => (
          <Box
            key={f}
            checked={(filters.fields || []).includes(f)}
            onChange={() => toggleList('fields', f)}
            label={f}
          />
        ))}
      </Group>

      {!isDefault && (
        <button
          onClick={() => onChange(defaults)}
          className="mt-2 text-sm underline underline-offset-4"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}