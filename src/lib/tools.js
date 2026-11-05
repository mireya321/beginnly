// ─────────────────────────────────────────────────────────────────────────────
// TOOLS SHOWN ON EACH JOB PAGE
// This is the one file you edit to add, change or remove tools.
// To add a tool, copy one block below, paste it at the end of the TOOLS list
// (before the final  ]  ), and change the words.
//
//   id        a short unique name with no spaces (used to count clicks)
//   name      what people see
//   blurb     one short line under the name
//   url       the link people go to (must start with https://)
//   type      'free'      -> no label
//             'paid'      -> shows "Paid link" (use for affiliate links)
//             'sponsored' -> shows "Sponsored" (use when a company pays you
//                            to be listed)
//   fields    which job fields it shows on, written exactly like the field
//             names on the board, or 'all' to show on every job.
//   enabled   true = visible, false = hidden
// ─────────────────────────────────────────────────────────────────────────────

export const TOOLS = [
  // ── Customer support & retail
  {
    id: 'hubspot-academy',
    name: 'HubSpot Academy',
    blurb: 'Free courses and certificates in customer service, sales and marketing.',
    url: 'https://academy.hubspot.com',
    type: 'free',
    fields: ['Customer support & retail', 'Sales', 'Marketing & content'],
    enabled: true,
  },
  {
    id: 'trailhead',
    name: 'Salesforce Trailhead',
    blurb: 'Free, hands-on lessons in the software many support and sales teams use.',
    url: 'https://trailhead.salesforce.com',
    type: 'free',
    fields: ['Customer support & retail', 'Sales', 'Operations & strategy'],
    enabled: true,
  },

  // ── Admin & office
  {
    id: 'gcf',
    name: 'GCFGlobal',
    blurb: 'Free lessons in Word, Excel, Outlook and Google Workspace.',
    url: 'https://edu.gcfglobal.org/en/topics/office/',
    type: 'free',
    fields: ['Admin & office', 'Accounting & finance', 'Operations & strategy', 'HR & recruiting'],
    enabled: true,
  },

  // ── Accounting & finance
  {
    id: 'accountingcoach',
    name: 'AccountingCoach',
    blurb: 'Free accounting basics, from debits and credits to financial statements.',
    url: 'https://www.accountingcoach.com',
    type: 'free',
    fields: ['Accounting & finance'],
    enabled: true,
  },
  {
    id: 'cfi',
    name: 'Corporate Finance Institute',
    blurb: 'Free introductory finance and Excel courses.',
    url: 'https://corporatefinanceinstitute.com/resources/',
    type: 'free',
    fields: ['Accounting & finance'],
    enabled: true,
  },

  // ── Legal & compliance
  {
    id: 'lii',
    name: 'Legal Information Institute',
    blurb: 'Cornell\'s free plain-language guide to US law and legal terms.',
    url: 'https://www.law.cornell.edu',
    type: 'free',
    fields: ['Legal & compliance'],
    enabled: true,
  },
  {
    id: 'edx',
    name: 'edX',
    blurb: 'University courses you can audit for free, including law, business and science.',
    url: 'https://www.edx.org',
    type: 'free',
    fields: ['Legal & compliance', 'Engineering & science', 'HR & recruiting', 'Teaching & education'],
    enabled: true,
  },

  // ── Data & analytics
  {
    id: 'sqlbolt',
    name: 'SQLBolt',
    blurb: 'Short, free lessons that teach SQL by doing.',
    url: 'https://sqlbolt.com',
    type: 'free',
    fields: ['Data & analytics', 'Software & IT'],
    enabled: true,
  },
  {
    id: 'kaggle-learn',
    name: 'Kaggle Learn',
    blurb: 'Free, short courses in Python, pandas, SQL and data visualization.',
    url: 'https://www.kaggle.com/learn',
    type: 'free',
    fields: ['Data & analytics'],
    enabled: true,
  },
  {
    id: 'mode-sql',
    name: 'Mode SQL Tutorial',
    blurb: 'Free SQL and analytics tutorials with real data to practice on.',
    url: 'https://mode.com/sql-tutorial',
    type: 'free',
    fields: ['Data & analytics'],
    enabled: true,
  },

  // ── Software & IT
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    blurb: 'Free coding courses and projects for your portfolio.',
    url: 'https://www.freecodecamp.org',
    type: 'free',
    fields: ['Software & IT', 'Data & analytics', 'Design'],
    enabled: true,
  },
  {
    id: 'odin',
    name: 'The Odin Project',
    blurb: 'A free, project-based path to becoming a web developer.',
    url: 'https://www.theodinproject.com',
    type: 'free',
    fields: ['Software & IT'],
    enabled: true,
  },
  {
    id: 'cs50',
    name: 'Harvard CS50',
    blurb: 'Harvard\'s free intro to computer science.',
    url: 'https://cs50.harvard.edu/x/',
    type: 'free',
    fields: ['Software & IT', 'Cybersecurity', 'Engineering & science'],
    enabled: true,
  },

  // ── Cybersecurity
  {
    id: 'tryhackme',
    name: 'TryHackMe',
    blurb: 'Beginner-friendly, hands-on security labs in your browser.',
    url: 'https://tryhackme.com',
    type: 'free',
    fields: ['Cybersecurity'],
    enabled: true,
  },
  {
    id: 'messer',
    name: 'Professor Messer',
    blurb: 'Free video courses for CompTIA A+, Network+ and Security+.',
    url: 'https://www.professormesser.com',
    type: 'free',
    fields: ['Cybersecurity', 'Software & IT'],
    enabled: true,
  },

  // ── Healthcare
  {
    id: 'khan-health',
    name: 'Khan Academy: Health & Medicine',
    blurb: 'Free lessons in anatomy, physiology and how the body works.',
    url: 'https://www.khanacademy.org/science/health-and-medicine',
    type: 'free',
    fields: ['Healthcare'],
    enabled: true,
  },
  {
    id: 'medlineplus',
    name: 'MedlinePlus',
    blurb: 'Plain-language medical terms and health topics from the US National Library of Medicine.',
    url: 'https://medlineplus.gov',
    type: 'free',
    fields: ['Healthcare'],
    enabled: true,
  },

  // ── Marketing & content
  {
    id: 'skillshop',
    name: 'Google Skillshop',
    blurb: 'Free training and certificates for Google Ads and Analytics.',
    url: 'https://skillshop.withgoogle.com',
    type: 'free',
    fields: ['Marketing & content', 'Data & analytics', 'Sales'],
    enabled: true,
  },
  {
    id: 'canva-school',
    name: 'Canva Design School',
    blurb: 'Free lessons in design, social media and presentations.',
    url: 'https://www.canva.com/designschool/',
    type: 'free',
    fields: ['Marketing & content', 'Design'],
    enabled: true,
  },

  // ── Design
  {
    id: 'figma-learn',
    name: 'Figma Learn',
    blurb: 'Free tutorials for the design tool most teams use.',
    url: 'https://www.figma.com/resource-library/',
    type: 'free',
    fields: ['Design'],
    enabled: true,
  },

  // ── HR & recruiting
  {
    id: 'alison',
    name: 'Alison',
    blurb: 'Free courses with certificates, including human resources and business.',
    url: 'https://alison.com',
    type: 'free',
    fields: ['HR & recruiting', 'Admin & office', 'Operations & strategy'],
    enabled: true,
  },

  // ── Teaching & education
  {
    id: 'khan-educators',
    name: 'Khan Academy for Educators',
    blurb: 'Free lesson plans, courses and teaching resources.',
    url: 'https://www.khanacademy.org/khan-for-educators',
    type: 'free',
    fields: ['Teaching & education'],
    enabled: true,
  },
  {
    id: 'edutopia',
    name: 'Edutopia',
    blurb: 'Free classroom strategies and ideas from working teachers.',
    url: 'https://www.edutopia.org',
    type: 'free',
    fields: ['Teaching & education'],
    enabled: true,
  },

  // ── Operations & strategy
  {
    id: 'atlassian-agile',
    name: 'Atlassian Agile Coach',
    blurb: 'Free guides to project management, Agile and Scrum.',
    url: 'https://www.atlassian.com/agile',
    type: 'free',
    fields: ['Operations & strategy', 'Software & IT'],
    enabled: true,
  },

  // ── Trades & manufacturing
  {
    id: 'mikerowe',
    name: 'mikeroweWORKS',
    blurb: 'Skilled-trade career info and scholarships.',
    url: 'https://www.mikeroweworks.org',
    type: 'free',
    fields: ['Trades & manufacturing'],
    enabled: true,
  },
  {
    id: 'careeronestop',
    name: 'CareerOneStop',
    blurb: 'US Department of Labor career info, training and local job centers.',
    url: 'https://www.careeronestop.org',
    type: 'free',
    fields: ['Trades & manufacturing', 'Other', 'Healthcare'],
    enabled: true,
  },

  // ── Engineering & science
  {
    id: 'mit-ocw',
    name: 'MIT OpenCourseWare',
    blurb: 'Free MIT course materials in engineering, science and math.',
    url: 'https://ocw.mit.edu',
    type: 'free',
    fields: ['Engineering & science'],
    enabled: true,
  },
  {
    id: 'khan-science',
    name: 'Khan Academy: Science',
    blurb: 'Free lessons from basic physics and chemistry to engineering.',
    url: 'https://www.khanacademy.org/science',
    type: 'free',
    fields: ['Engineering & science'],
    enabled: true,
  },

  // ── Examples to copy. They stay hidden until you set enabled: true
  // and replace the url with your own link.
  {
    id: 'example-paid',
    name: 'Example course',
    blurb: 'One line about what this teaches.',
    url: '',
    type: 'paid',
    fields: ['Data & analytics'],
    enabled: false,
  },
  {
    id: 'example-sponsored',
    name: 'Example sponsor',
    blurb: 'One line about the sponsor.',
    url: '',
    type: 'sponsored',
    fields: ['all'],
    enabled: false,
  },
]

const MAX_SHOWN = 3

// Returns the tools to show for a job: sponsored first, then paid, then free.
// Jobs without a field get a general set.
export function toolsForJob(job) {
  const field = job.field || 'Other'
  const rank = { sponsored: 0, paid: 1, free: 2 }
  return TOOLS.filter(
    (t) =>
      t.enabled &&
      t.url &&
      (t.fields.includes('all') || t.fields.includes(field))
  )
    .sort((a, b) => rank[a.type] - rank[b.type])
    .slice(0, MAX_SHOWN)
}