import { ArrowRight } from 'lucide-react'

// The lime arrow square used inside buttons
export default function Arrow({ size = 16 }) {
  return (
    <span className="btn-arrow">
      <ArrowRight size={size} strokeWidth={2.2} />
    </span>
  )
}
