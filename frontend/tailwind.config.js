/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Gold — same in both themes (looks great on dark and light bg)
        gold: {
          DEFAULT: '#D4A820',
          light: '#E8C040',
          lighter: '#F4D060',
          dark: '#9A7820',
          muted: 'rgba(212,168,32,0.10)',
          border: 'rgba(212,168,32,0.22)',
        },
        // Theme-aware backgrounds — values set via CSS variables in index.css
        bg: {
          DEFAULT: 'var(--bg)',
          deep: 'var(--bg-deep)',
          card: 'var(--bg-card)',
          hover: 'var(--bg-hover)',
          navy: '#0d1629',   // Always dark — used in CTA section intentionally
        },
        // Theme-aware text
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        // Theme-aware borders
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
          gold: 'rgba(212,168,32,0.22)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // To switch fonts, replace 'Inter' above with one of:
        // 'Poppins'  — geometric, rounded, very popular
        // 'Nunito'   — softest rounding, warm and friendly
        // 'DM Sans'  — subtle rounding, clean, used by tech/SaaS brands
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        card: '0 4px 32px rgba(0,0,0,0.3)',
        glass: '0 8px 40px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(160deg, #E8C840 0%, #D4A820 55%, #9A7820 100%)',
      },
    },
  },
  plugins: [],
}
