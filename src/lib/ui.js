import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useInRouterContext,
  useLocation,
} from 'react-router-dom'
import Jobs from './pages/Jobs'
import JobPage from './pages/JobPage'
import Privacy from './pages/Privacy'
import Unsubscribe from './pages/Unsubscribe'
import { Analytics } from '@vercel/analytics/react'

// Jump back to the top of the page whenever the address changes.
// If the address has a #section, scroll to that section instead.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// Launch version: the job board only.
// The employer and login pages are built but switched off for now.
// To turn them back on later, we add their routes back here.
function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Analytics />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  // Works whether or not main.jsx already wraps the app in a router
  const insideRouter = useInRouterContext()
  if (insideRouter) return <AppRoutes />
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
