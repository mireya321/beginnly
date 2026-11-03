import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Arrow from '../components/Arrow'
import { unsubscribe } from '../lib/subscribe'

// Opened from the link at the bottom of every weekly email: /unsubscribe?t=TOKEN
export default function Unsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('t') || ''
  const [state, setState] = useState('working') // working | done | failed

  useEffect(() => {
    if (!token) {
      setState('failed')
      return
    }
    unsubscribe(token).then((ok) => setState(ok ? 'done' : 'failed'))
  }, [token])

  return (
    <Layout>
      <div className="wrap py-28 text-center">
        {state === 'working' && <p className="text-slate">One moment…</p>}
        {state === 'done' && (
          <>
            <h1 className="t-h3">You're unsubscribed.</h1>
            <p className="mt-4 text-slate">You won't get any more weekly emails from us.</p>
          </>
        )}
        {state === 'failed' && (
          <>
            <h1 className="t-h3">That link didn't work.</h1>
            <p className="mt-4 text-slate">
              It may be old or incomplete. Use the unsubscribe link in your latest email.
            </p>
          </>
        )}
        {state !== 'working' && (
          <Link to="/jobs" className="btn mt-8">
            Back to jobs
            <Arrow />
          </Link>
        )}
      </div>
    </Layout>
  )
}