import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

const footerLinks = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Pricing',   to: '/pricing' },
  { label: 'Contact',   to: '/contact' },
]

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ftr-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C840" />
          <stop offset="100%" stopColor="#9A7820" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#1c1a0d"
            stroke="#D4A820" strokeWidth="2.5" strokeOpacity="0.40" />
      <path
        d="M11 50 L11 16 L24 16 L32 35 L40 16 L53 16 L53 50 L45 50 L45 30 L34 50 L30 50 L19 30 L19 50 Z"
        fill="url(#ftr-gold)"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-bg-deep border-t border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Masinfo Systems">
              <LogoMark />
              <span className="text-base font-bold">
                <span className="text-gold">Masinfo</span>
                <span className="text-text-primary"> Systems</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm text-center md:text-left max-w-xs">
              Websites & Apps — Fast, Affordable, Professional.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="divider-gold mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-text-muted text-xs">
          <p>© {currentYear} Masinfo Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="mailto:masinfo.usa@gmail.com"
               className="hover:text-gold transition-colors duration-200">
              masinfo.usa@gmail.com
            </a>
            <a href="tel:9843991281"
               className="hover:text-gold transition-colors duration-200">
              984-399-1281
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
