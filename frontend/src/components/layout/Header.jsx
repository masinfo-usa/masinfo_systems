import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Process',   to: '/process' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Pricing',   to: '/pricing' },
  { label: 'Contact',   to: '/contact' },
]

// M logo with rounded rect container + gold border
function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hdr-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C840" />
          <stop offset="100%" stopColor="#9A7820" />
        </linearGradient>
      </defs>
      {/* Background rect with gold border */}
      <rect width="64" height="64" rx="16" fill="#1c1a0d"
            stroke="#D4A820" strokeWidth="2.5" strokeOpacity="0.40" />
      <path
        d="M11 50 L11 16 L24 16 L32 35 L40 16 L53 16 L53 50 L45 50 L45 30 L34 50 L30 50 L19 30 L19 50 Z"
        fill="url(#hdr-gold)"
      />
    </svg>
  )
}

// Sun icon — shown in dark mode (click to switch to light)
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

// Moon icon — shown in light mode (click to switch to dark)
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass' : 'header-fade'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Masinfo Systems home">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-gold-gradient">Masinfo</span>
              <span className="text-text-primary"> Systems</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(to) ? 'text-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
                {/* Active underline */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold rounded-full
                             transition-all duration-300 ${
                    isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Theme toggle + CTA + Hamburger */}
          <div className="flex items-center gap-3">

            {/* Theme toggle button */}
            <button
              onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-xl
                         text-text-secondary hover:text-gold hover:bg-gold-muted
                         border border-border hover:border-gold-border
                         transition-all duration-200"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="hidden md:block">
              <Link to="/contact">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10
                         rounded-xl hover:bg-white/5 transition-colors duration-200"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                   stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6"  x2="17" y2="6"  />
                    <line x1="3" y1="10" x2="17" y2="10" />
                    <line x1="3" y1="14" x2="17" y2="14" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="md:hidden glass border-t border-white/[0.06]"
          >
            <nav className="flex flex-col px-6 py-5 gap-1" aria-label="Mobile navigation">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`font-medium py-3 px-4 rounded-2xl transition-all duration-200 ${
                    isActive(to)
                      ? 'text-gold bg-gold-muted border border-gold-border'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-3 pb-1">
                <Link to="/contact" className="block">
                  <Button variant="primary" size="md" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
