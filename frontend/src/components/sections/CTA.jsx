import { motion } from 'framer-motion'
import Button from '../ui/Button'

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function CTA() {
  return (
    <section className="relative py-28 px-6 overflow-hidden bg-bg-navy" aria-label="Call to action">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(26,39,68,0.9) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]
                     rounded-full opacity-[0.07] blur-[80px]"
          style={{ background: '#C4A030' }}
        />
        {/* Decorative corner lines */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/20 rounded-tl-2xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/20 rounded-br-2xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <motion.p
          variants={itemVariants}
          className="label-pill mb-6 justify-center"
        >
          <span className="w-1 h-1 rounded-full bg-gold" aria-hidden="true" />
          Ready When You Are
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white mb-6"
        >
          Ready to Build{' '}
          <span className="text-gold-gradient">Something Great?</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          No long contracts. No hidden fees. Just a clean, professional website
          delivered on time — built to grow your business from day one.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button to="/contact" variant="primary" size="lg">
            Get a Free Quote
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
          <Button href="tel:9843991281" variant="white" size="lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14h-1v2.92z" />
            </svg>
            Call 984-399-1281
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
