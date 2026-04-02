import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import LabelPill from '../ui/LabelPill'

// 4 clear steps — simplified from 6 for cognitive fluency
const steps = [
  {
    number: '01',
    title: 'Share Your Vision',
    body: 'Tell us what you need — your goals, your audience, your timeline. We listen first, then plan.',
  },
  {
    number: '02',
    title: 'We Design & Build',
    body: 'Our team creates your site with speed and precision, keeping you updated throughout the process.',
  },
  {
    number: '03',
    title: 'Review & Approve',
    body: 'You review everything, request changes, and give the final sign-off. Nothing ships without your approval.',
  },
  {
    number: '04',
    title: 'Payment & Launch',
    body: 'Finalize payment — simple and transparent — and your site goes live. We stay available for support.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works" className="bg-bg-deep">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}>
            <LabelPill>The Process</LabelPill>
          </motion.div>
          <motion.h2 variants={itemVariants} className="section-heading mt-2">
            How We Work{' '}
            <span className="text-gold-gradient">Together</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="section-sub mx-auto">
            A clear, stress-free process from first conversation to launch day.
          </motion.p>
        </div>

        {/* 4-step grid — 2×2 on desktop, 1 column on mobile */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {steps.map(({ number, title, body }, index) => (
            <motion.div
              key={number}
              variants={itemVariants}
              className="card p-8 group relative overflow-hidden"
            >
              {/* Faded step number background */}
              <span
                className="absolute top-4 right-5 text-7xl font-black opacity-[0.04]
                           select-none pointer-events-none leading-none text-text-primary"
                aria-hidden="true"
              >
                {number}
              </span>

              {/* Step badge */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-8 h-8 rounded-xl bg-gold-muted border border-gold-border
                             flex items-center justify-center text-gold text-xs font-bold
                             group-hover:bg-gold/20 transition-colors duration-300"
                >
                  {index + 1}
                </span>
              </div>

              <h3 className="text-text-primary font-semibold text-base mb-2 leading-snug">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Free consultation note */}
        <motion.div
          variants={itemVariants}
          className="mt-10 p-5 rounded-3xl border border-gold-border bg-gold-muted text-center"
        >
          <p className="text-gold text-sm font-medium">
            Not sure where to start? We offer a <strong>free consultation</strong> — no commitment required.
          </p>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
