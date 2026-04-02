import { motion } from 'framer-motion'
import Button from '../ui/Button'

// Shared animation variants
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden bg-bg-deep"
      aria-label="Hero"
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Gold glow — top center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full
                     opacity-[0.08] blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, #C4A030 0%, transparent 70%)' }}
        />
        {/* Navy orb — bottom left */}
        <div
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full
                     opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(ellipse, #1a2744 0%, transparent 70%)' }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(196,160,48,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,160,48,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ── Main content ── */}
      {/* Spacer matches fixed header height so content never hides behind it */}
      {/* Spacer = header height only — no extra gap */}
      <div className="h-16 md:h-20 shrink-0" aria-hidden="true" />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10
                      max-w-5xl w-full mx-auto px-6 text-center pb-10">

        {/* Floating badge */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <span className="label-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-slow" aria-hidden="true" />
            Web Development Agency
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black
                     leading-[1.02] tracking-tight text-text-primary mb-6"
        >
          We Build Websites<br />
          That{' '}
          <span className="text-gold-gradient">Grow Your</span>
          <br />
          <span className="text-gold-gradient">Business</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-text-secondary text-lg md:text-xl font-medium tracking-wide mb-4"
        >
          Websites &amp; Apps&nbsp;&nbsp;·&nbsp;&nbsp;Fast, Affordable, Professional
        </motion.p>

        {/* Supporting copy */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          From restaurants to construction companies — we craft digital experiences that
          attract customers, build trust, and drive real growth.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button to="/contact" variant="primary" size="lg">
            Start Your Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
          <Button to="/portfolio" variant="ghost" size="lg">
            View Our Work
          </Button>
        </motion.div>

        {/* Trust row */}
        <motion.div
          {...fadeUp(0.55)}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-text-muted text-sm"
        >
          {[
            '✓ No long contracts',
            '✓ No hidden fees',
            '✓ Free consultation',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-text-muted"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
