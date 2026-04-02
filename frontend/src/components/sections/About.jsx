import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import LabelPill from '../ui/LabelPill'

const pillars = [
  {
    icon: (
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            strokeLinecap="round" strokeLinejoin="round" />
    ),
    title: 'First Impressions Are Everything',
    body: 'Visitors form an opinion in milliseconds. We engineer that first impression so your business radiates trust before a word is read.',
  },
  {
    icon: (
      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    title: 'Designed to Convert',
    body: 'Every layout, headline, and button is placed with purpose — guiding visitors from curiosity to action without friction.',
  },
  {
    icon: (
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            strokeLinecap="round" strokeLinejoin="round" />
    ),
    title: 'Built to Scale',
    body: 'Start simple, grow confidently. Our code is clean, modular, and ready for whatever your business needs next.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  return (
    <SectionWrapper id="about" className="bg-bg">
      {/* Divider from hero */}
      <div className="divider-gold mb-24 -mt-12" aria-hidden="true" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center"
      >
        <motion.div variants={itemVariants}>
          <LabelPill>Why It Matters</LabelPill>
        </motion.div>

        <motion.h2 variants={itemVariants} className="section-heading mt-2">
          Your Website Is Your{' '}
          <span className="text-gold-gradient">Best Salesperson</span>
        </motion.h2>

        <motion.p variants={itemVariants} className="section-sub mx-auto">
          In today's world, your website is often the very first interaction a customer
          has with your business. It works 24/7, never calls in sick, and represents
          your brand to every single visitor. Make it count.
        </motion.p>

        {/* Pillars */}
        <motion.div
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {pillars.map(({ icon, title, body }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="card p-8 text-left group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gold-muted flex items-center justify-center mb-5
                              group-hover:bg-gold/20 transition-colors duration-300">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C4A030"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  {icon}
                </svg>
              </div>

              <h3 className="text-text-primary font-semibold text-lg mb-3 leading-snug">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
