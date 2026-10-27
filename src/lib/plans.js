// Employer plans. Used by the website AND the Stripe checkout function,
// so change a price here and both update. `price` is in US dollars.
export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    days: 14,
    featured: false,
    note: 'A short listing to try the board.',
    items: ['Live for 14 days', 'Verified experience badge', 'Link to your application page'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 49,
    days: 30,
    featured: false,
    popular: true,
    note: 'The full listing for most roles.',
    items: ['Live for 30 days', 'Verified experience badge', 'Shown in search and similar roles'],
  },
  {
    id: 'featured',
    name: 'Featured',
    price: 99,
    days: 45,
    featured: true,
    note: 'Maximum visibility for key hires.',
    items: ['Live for 45 days', 'Pinned to the top of results', 'Highlighted card'],
  },
]

export const getPlan = (id) => PLANS.find((p) => p.id === id)