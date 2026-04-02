import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import LabelPill from '../ui/LabelPill'
import ServiceIcon from '../ui/ServiceIcon'
import Button from '../ui/Button'
import { services } from '../../data/services'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Services() {
  return (
    <SectionWrapper id="services" className="bg-bg-deep">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}>
            <LabelPill>What We Build</LabelPill>
          </motion.div>
          <motion.h2 variants={itemVariants} className="section-heading mt-2">
            Services Built for{' '}
            <span className="text-gold-gradient">Every Business</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="section-sub mx-auto">
            Whether you run a restaurant, a construction company, a dealership, or anything
            in between — we have the right solution for you.
          </motion.p>
        </div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {services.map(({ id, title, description, icon, highlight }) => (
            <motion.div
              key={id}
              variants={itemVariants}
              className={`card p-8 group relative overflow-hidden ${
                highlight
                  ? 'border-gold-border'
                  : ''
              }`}
            >
              {/* Gold accent bar on highlighted card */}
              {highlight && (
                <div className="absolute top-0 left-8 w-12 h-0.5 bg-gold rounded-full" aria-hidden="true" />
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  highlight
                    ? 'bg-gold/15 group-hover:bg-gold/25'
                    : 'bg-bg-hover group-hover:bg-gold-muted'
                }`}
              >
                <ServiceIcon
                  name={icon}
                  size={22}
                  className={highlight ? 'text-gold' : 'text-text-secondary group-hover:text-gold'}
                />
              </div>

              <h3 className={`text-lg font-semibold mb-3 ${highlight ? 'text-gold' : 'text-text-primary'}`}>
                {title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div variants={itemVariants} className="text-center mt-14">
          <p className="text-text-muted text-sm mb-5">
            Not sure which service fits your needs?
          </p>
          <Button to="/contact" variant="outline" size="md">
            Let's figure it out together
          </Button>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
