import Layout from './Layout'

// Shared card for login / signup
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <Layout>
      <section className="relative z-10 py-16">
        <div className="wrap">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-medium text-dark">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
        </div>
      </section>
    </Layout>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-dark">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-line bg-page px-4 py-3 text-sm text-dark outline-none transition-all placeholder:text-muted/70 focus:border-brand focus:bg-white focus:ring-2 focus:ring-lilac'

export const primaryBtn =
  'inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-dark px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-dark-2 disabled:opacity-60'