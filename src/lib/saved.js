import { useCallback, useEffect, useState } from 'react'

const KEY = 'beginnly_saved_jobs'

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

// Bookmarks are kept in this browser only (localStorage).
export function useSavedJobs() {
  const [saved, setSaved] = useState(read)

  useEffect(() => {
    const sync = () => setSaved(read())
    window.addEventListener('storage', sync)
    window.addEventListener('beginnly-saved', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('beginnly-saved', sync)
    }
  }, [])

  const toggle = useCallback((id) => {
    const cur = read()
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // storage blocked: the bookmark just won't persist
    }
    setSaved(next)
    window.dispatchEvent(new Event('beginnly-saved'))
  }, [])

  return { saved, toggle }
}