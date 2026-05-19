/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050507',
        'bg-2': '#0a0a12',
        text: '#f5f5f7',
        'text-dim': 'rgba(245,245,247,0.55)',
        'text-faint': 'rgba(245,245,247,0.35)',
        'accent-1': '#C17BE8',
        'accent-2': '#6080FF',
        'accent-soft': '#E5B8FF',
        signal: '#5EFFAA',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['var(--font-instrument-serif)', 'serif'],
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.5)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
