import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useInRouterContext,
  useLocation,
} from 'react-router-dom'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobPage from './pages/JobPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Employer from './pages/Employer'
import PostJob from './pages/PostJob'
import RequireEmployer from './components/RequireEmployer'
import { AuthProvider } from './lib/auth'
import { Analytics } from '@vercel/analytics/react'

// Jump back to the top of the page whenever the address changes
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employer" element={<RequireEmployer><Employer /></RequireEmployer>} />
        <Route path="/employer/post" element={<RequireEmployer><PostJob /></RequireEmployer>} />
        <Route path="/employer/post/:id" element={<RequireEmployer><PostJob /></RequireEmployer>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  // Works whether or not main.jsx already wraps the app in a router
  const insideRouter = useInRouterContext()
  if (insideRouter) return <AuthProvider><AppRoutes /></AuthProvider>
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}