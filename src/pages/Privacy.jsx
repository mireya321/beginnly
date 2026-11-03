import Layout from '../components/Layout'
import { SITE_NAME } from '../config'

// Type your contact email between the quotes to show it on this page
const CONTACT_EMAIL = ''

export default function Privacy() {
  return (
    <Layout>
      <div className="wrap max-w-3xl py-16">
        <h1 className="t-h3">Privacy</h1>
        <div className="job-body mt-8">
          <p>
            {SITE_NAME} is a job board. This page explains what we collect and why, in plain words.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Your email and job category</strong>, only if you sign up for the weekly job
              email.
            </li>
            <li>
              <strong>Which links get clicked</strong> (for example, a tool on a job page). We
              don't attach these clicks to your name or email.
            </li>
            <li>
              <strong>Basic visit statistics</strong> (pages viewed, country, device type) through
              Vercel Analytics.
            </li>
          </ul>

          <h2>How we use it</h2>
          <p>
            Your email is used to send the weekly job email, and nothing else. We don't sell your
            email. Click and visit numbers help us see what is useful.
          </p>

          <h2>Unsubscribing</h2>
          <p>
            Every email has an unsubscribe link. Click it and you're removed from the list.
          </p>

          <h2>Links to other sites</h2>
          <p>
            Job listings come from public job feeds. When you apply, you go to the company's own
            site, which has its own privacy rules. Some links in the tools section are paid or
            sponsored. Those are labeled "Paid link" or "Sponsored".
          </p>

          {CONTACT_EMAIL && (
            <>
              <h2>Contact</h2>
              <p>
                Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}