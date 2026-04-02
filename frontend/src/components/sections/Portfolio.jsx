import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import LabelPill from '../ui/LabelPill'
import Button from '../ui/Button'
import { projects } from '../../data/projects'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

// Placeholder visual when no screenshot is available
function ProjectPlaceholder({ color, accent }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 select-none"
      style={{ background: `linear-gradient(135deg, ${color} 0%, #111111 100%)` }}
    >
      {/* Fake browser chrome */}
      <div className="w-4/5 rounded-2xl overflow-hidden border border-white/10 shadow-card">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-black/40">
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <div className="ml-2 flex-1 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="px-4 py-5" style={{ background: color }}>
          <div className="h-1.5 rounded-full mb-2" style={{ background: accent, width: '60%', opacity: 0.7 }} />
          <div className="h-1 rounded-full bg-white/20 mb-1.5 w-4/5" />
          <div className="h-1 rounded-full bg-white/15 mb-4 w-3/5" />
          <div className="h-6 rounded-xl w-28" style={{ background: accent, opacity: 0.6 }} />
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-white/30">
        {/* PLACEHOLDER — replace with actual screenshot */}
        Screenshot coming soon
      </p>
    </div>
  )
}

export default function Portfolio() {
  return (
    <SectionWrapper id="portfolio" className="bg-bg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}>
            <LabelPill>Our Work</LabelPill>
          </motion.div>
          <motion.h2 variants={itemVariants} className="section-heading mt-2">
            Recent{' '}
            <span className="text-gold-gradient">Live Projects</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="section-sub mx-auto">
            Real businesses, real results. Built from scratch, delivered on time.
          </motion.p>
        </div>

        {/* Project cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              variants={itemVariants}
              className={`card overflow-hidden flex flex-col group ${
                project.placeholder ? 'opacity-60' : ''
              }`}
              aria-label={project.name}
            >
              {/* Screenshot / Placeholder */}
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.name} website screenshot`}
                    className="w-full h-full object-cover object-top group-hover:scale-105
                               transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <ProjectPlaceholder
                    color={project.placeholderColor}
                    accent={project.placeholderAccent}
                    name={project.name}
                  />
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-6">
                {/* Category tag */}
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                  {project.tagline}
                </span>

                <h3 className="text-white font-bold text-lg mb-2">{project.name}</h3>
                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-5">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-text-muted border border-border px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {project.liveUrl ? (
                  <Button
                    href={project.liveUrl}
                    variant="outline"
                    size="sm"
                    external
                    className="self-start"
                  >
                    View Live Site
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </Button>
                ) : (
                  <span className="text-xs text-text-muted italic">Your project could be here.</span>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
