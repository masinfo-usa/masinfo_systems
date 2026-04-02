import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import SectionWrapper from '../ui/SectionWrapper'
import LabelPill from '../ui/LabelPill'
import Button from '../ui/Button'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const contactInfo = [
  {
    label: 'Phone',
    value: '984-399-1281',
    href: 'tel:9843991281',
    icon: (
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"
            strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Email',
    value: 'masinfo.usa@gmail.com',
    href: 'mailto:masinfo.usa@gmail.com',
    icon: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
  },
]

const initialForm = { name: '', email: '', phone: '', message: '' }

// Client-side validation rules
function validate(form) {
  const errors = {}
  if (!form.name.trim())
    errors.name = 'Your name is required'
  if (!form.email.trim())
    errors.email = 'Your email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Please enter a valid email address'
  if (!form.message.trim())
    errors.message = 'Please describe your project'
  else if (form.message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [honeypot, setHoneypot] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear the error for this field as user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (honeypot) return // Bot detected — silent discard

    // Run validation before anything else
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0]
      document.getElementById(firstErrorKey)?.focus()
      return
    }

    setFieldErrors({})
    setStatus('loading')
    setServerError('')

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, form)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      if (err.response?.status === 429) {
        setServerError('Too many requests. Please wait a few minutes and try again.')
      } else {
        setServerError('Something went wrong. Please email us directly at masinfo.usa@gmail.com')
      }
    }
  }

  return (
    <SectionWrapper id="contact" className="bg-bg-deep">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}><LabelPill>Contact</LabelPill></motion.div>
          <motion.h2 variants={itemVariants} className="section-heading mt-2">
            Let's Start a{' '}
            <span className="text-gold-gradient">Conversation</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="section-sub mx-auto">
            Tell us about your project. We respond within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Contact info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-5">
            {contactInfo.map(({ label, value, href, icon }) => (
              <a key={label} href={href}
                className="card p-5 flex items-center gap-4 group no-underline">
                <div className="w-10 h-10 rounded-2xl bg-gold-muted flex items-center justify-center shrink-0
                                group-hover:bg-gold/20 transition-colors duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="#D4A820" strokeWidth="1.5" aria-hidden="true">
                    {icon}
                  </svg>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-text-primary text-sm font-medium group-hover:text-gold transition-colors duration-200">
                    {value}
                  </p>
                </div>
              </a>
            ))}

            <div className="card p-5 border-gold-border bg-gold-muted">
              <p className="text-gold text-sm font-medium mb-1">Free Consultation</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                Not sure what you need? We'll help you figure it out — no commitment, no pressure.
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="card p-8">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                         stroke="#D4A820" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-text-primary font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-text-secondary text-sm mb-6">
                    We'll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setStatus('idle')} variant="ghost" size="sm">
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — hidden from real users */}
                  <input type="text" name="_hp" tabIndex={-1} autoComplete="off"
                    aria-hidden="true" value={honeypot} onChange={e => setHoneypot(e.target.value)}
                    style={{ position:'absolute', left:'-9999px', opacity:0, height:0, width:0 }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input id="name" name="name" type="text"
                        className={`form-input ${fieldErrors.name ? 'form-input-error' : ''}`}
                        placeholder="John Smith"
                        value={form.name} onChange={handleChange} />
                      {fieldErrors.name && (
                        <p className="text-red-400 text-xs mt-1.5">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input id="email" name="email" type="email"
                        className={`form-input ${fieldErrors.email ? 'form-input-error' : ''}`}
                        placeholder="john@company.com"
                        value={form.email} onChange={handleChange} />
                      {fieldErrors.email && (
                        <p className="text-red-400 text-xs mt-1.5">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                      Phone (Optional)
                    </label>
                    <input id="phone" name="phone" type="tel"
                      className="form-input"
                      placeholder="984-000-0000"
                      value={form.phone} onChange={handleChange} />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                      Tell Us About Your Project *
                    </label>
                    <textarea id="message" name="message" rows={5}
                      className={`form-input resize-none ${fieldErrors.message ? 'form-input-error' : ''}`}
                      placeholder="What kind of website do you need? Any specific features or timeline?"
                      value={form.message} onChange={handleChange} />
                    {fieldErrors.message && (
                      <p className="text-red-400 text-xs mt-1.5">{fieldErrors.message}</p>
                    )}
                  </div>

                  {status === 'error' && (
                    <div className="mb-5 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                      {serverError}
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="lg" className="w-full"
                          disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
