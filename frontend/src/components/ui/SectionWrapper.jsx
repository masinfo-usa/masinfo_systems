/**
 * SectionWrapper — consistent section padding and max-width
 *
 * Props:
 *   id        — used for anchor navigation (#services, etc.)
 *   className — additional classes on the <section>
 *   inner     — additional classes on the inner max-width container
 */

export default function SectionWrapper({ id, children, className = '', inner = '' }) {
  return (
    <section id={id} className={`py-24 md:py-32 px-6 ${className}`}>
      <div className={`max-w-6xl mx-auto ${inner}`}>
        {children}
      </div>
    </section>
  )
}
