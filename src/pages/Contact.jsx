import { useEffect } from 'react'
import { Mail } from 'lucide-react'
import Layout from '../components/Layout'
import { SITE_NAME } from '../config'

// Type your contact email between the quotes below, then save.
const CONTACT_EMAIL = 'support@beginnly.com'

export default function Contact() {
  useEffect(() => {
    document.title = `Contact us | ${SITE_NAME}`
  }, [])

  return (
    <Layout>
      <div className="wrap py-16 sm:py-24">
        <span className="t-eyebrow text-primary">Contact</span>
        <h1 className="t-display mt-4 max-w-3xl text-ink">
          Let's <span className="mark">connect.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate">
          Found a problem with a job, or have a question or an idea? Send us a note and we'll get
          back to you.
        </p>

        <div className="mt-12 max-w-xl rounded-3xl border border-line bg-forest p-8 text-white sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-highlight text-ink">
            <Mail size={22} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-extrabold text-white">Email us</h2>
          {CONTACT_EMAIL ? (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block text-lg font-semibold text-highlight underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="mt-2 text-white/75">Our contact email is coming soon.</p>
          )}
        </div>
      </div>
    </Layout>
  )
}