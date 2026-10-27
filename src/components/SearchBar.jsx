import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  'Customer Support',
  'Engineering',
  'Finance',
  'Marketing',
  'Sales',
]

const fieldClass =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-xs outline-none focus:border-brand'

export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [remote, setRemote] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch({ keyword, category, remote })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-end gap-3 rounded-2xl bg-[#f3f3f3] p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <label className="text-xs font-medium">
        Keywords
        <input
          className={`${fieldClass} mt-1.5`}
          placeholder="Type here..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </label>

      <label className="text-xs font-medium">
        Job Category
        <select
          className={`${fieldClass} mt-1.5`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select an option</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs font-medium">
        Remote
        <select
          className={`${fieldClass} mt-1.5`}
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>
      </label>

      <button
        type="submit"
        className="flex items-center justify-between gap-3 rounded-full bg-brand py-2 pl-6 pr-1.5 text-xs font-medium text-white md:justify-start"
      >
        Search
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
          <ArrowRight size={14} />
        </span>
      </button>
    </form>
  )
}