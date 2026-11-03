import { supabase } from './supabase'

// Counts a click on a tools link. Never blocks or breaks the click.
export function trackToolClick({ toolId, jobId, type }) {
  try {
    supabase
      .from('tool_clicks')
      .insert({ tool_id: toolId, job_id: jobId || null, tool_type: type })
      .then(() => {}, () => {})
  } catch {
    // tracking must never get in the way
  }
}
