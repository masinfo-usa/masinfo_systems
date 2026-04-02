/**
 * ServiceIcon — renders one of 4 inline SVG icons for the Services section
 * Supported: monitor | code | cart | server
 */

const paths = {
  monitor: (
    <path
      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  code: (
    <path
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  cart: (
    <path
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  server: (
    <path
      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}

export default function ServiceIcon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {paths[name] ?? paths.monitor}
    </svg>
  )
}
