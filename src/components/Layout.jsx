import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-page text-dark selection:bg-lilac selection:text-dark">
      {/* Fine dot pattern behind every page */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#979DF0 0.85px, transparent 0.85px)',
          backgroundSize: '24px 24px',
        }}
      />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  )
}