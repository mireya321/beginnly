import { useState } from 'react'
import { Check, ChevronUp } from 'lucide-react'
import { EXPERIENCE_LEVELS, CATEGORIES, MAX_AGE_DAYS } from '../config'
import { DEFAULT_FILTERS } from '../lib/jobs'

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

export default function FilterPanel({ filters, onChange }) {
  function toggleList(key, value) {
    const list = filters[key]
    onChange({
      [key]: list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value],
    })
  }

  const levels = EXPERIENCE_LEVELS.filter((l) => l.values.length > 0)
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS)

  return (
    <div>
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

      <Group title="Category">
        {CATEGORIES.map((c) => (
          <Box
            key={c.value}
            checked={filters.categories.includes(c.value)}
            onChange={() => toggleList('categories', c.value)}
            label={c.label}
          />
        ))}
      </Group>

      {!isDefault && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="mt-2 text-sm underline underline-offset-4"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}