import { Link } from 'react-router-dom'

/**
 * Button — renders as:
 *   <Link>   when `to` prop is provided  (internal React Router navigation)
 *   <a>      when `href` prop is provided (external URLs, tel:, mailto:)
 *   <button> otherwise
 *
 * Variants: primary | ghost | outline
 * Sizes:    sm | md | lg
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  external = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full ' +
    'transition-all duration-200 ease-out cursor-pointer select-none'

  const variants = {
    primary:
      'bg-gold text-[#111111] hover:bg-gold-light active:scale-[0.97]',
    ghost:
      'bg-transparent text-text-primary border border-border ' +
      'hover:border-border-light hover:bg-bg-hover active:scale-[0.97]',
    outline:
      'bg-transparent text-gold border border-gold-border ' +
      'hover:border-gold/50 hover:bg-gold/[0.06] active:scale-[0.97]',
    white:
      'bg-transparent text-white border border-white/25 ' +
      'hover:border-white/45 hover:bg-white/[0.06] active:scale-[0.97]',
  }

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : ''
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${disabledClass} ${className}`

  // Internal navigation — React Router Link
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    )
  }

  // External link or tel: / mailto:
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  )
}
