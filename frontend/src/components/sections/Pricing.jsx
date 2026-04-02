import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import LabelPill from '../ui/LabelPill'
import Button from '../ui/Button'
import { plans } from '../../data/pricing'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <SectionWrapper id="pricing" className="bg-bg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}>
            <LabelPill>Pricing</LabelPill>
          </motion.div>
          <motion.h2 variants={itemVariants} className="section-heading mt-2">
            Transparent,{' '}
            <span className="text-gold-gradient">No-Surprise Pricing</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="section-sub mx-auto">
            Choose the plan that fits where you are now. You can always grow from here.
          </motion.p>
        </div>

        {/* Plans */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className={`card flex flex-col relative overflow-hidden ${
                plan.highlighted
                  ? 'border-gold md:scale-[1.03] pricing-highlight'
                  : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 text-[11px] font-bold uppercase tracking-wider
                              px-4 py-1.5 rounded-bl-2xl rounded-tr-3xl ${
                    plan.highlighted
                      ? 'bg-gold text-[#111]'
                      : 'bg-bg-hover text-text-muted border-l border-b border-border'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Plan name */}
                <h3
                  className={`text-base font-semibold mb-1 ${
                    plan.highlighted ? 'text-gold' : 'text-text-secondary'
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-text-primary">{plan.price}</span>
                </div>
                <p className="text-text-muted text-xs mb-1 capitalize">{plan.period}</p>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">{plan.description}</p>

                {/* Divider */}
                <div className="divider-gold mb-6" />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-text-primary">
                      <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-text-muted line-through">
                      <span className="text-text-muted mt-0.5 shrink-0"><XIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  to="/contact"
                  variant={plan.highlighted ? 'primary' : 'ghost'}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p variants={itemVariants} className="text-center text-text-muted text-sm mt-10">
          All prices are one-time. Need something custom?{' '}
          <a href="/contact" className="text-gold hover:underline transition-colors">
            Let's talk
          </a>
          .
        </motion.p>
      </motion.div>
    </SectionWrapper>
  )
}
