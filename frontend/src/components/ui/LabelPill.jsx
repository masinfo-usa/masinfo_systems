/**
 * LabelPill — small gold pill label above section headings
 * Usage: <LabelPill>Services</LabelPill>
 */

export default function LabelPill({ children }) {
  return (
    <span className="label-pill">
      <span className="w-1 h-1 rounded-full bg-gold inline-block" aria-hidden="true" />
      {children}
    </span>
  )
}
