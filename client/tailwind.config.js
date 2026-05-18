/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wave: {
          bg: 'var(--bg)',
          card: 'var(--card)',
          surface: 'var(--surface)',
          border: 'var(--border)',
          accent: 'var(--accent)',
          pink: 'var(--pink)',
          cyan: 'var(--cyan)',
          text: 'var(--text)',
          muted: 'var(--muted)'
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      animation: {
        'equalizer': 'equalizer 1.2s ease infinite',
        'pulse-slow': 'pulse 3s ease infinite',
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.4s ease'
      },
      keyframes: {
        equalizer: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' }
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }
    }
  },
  plugins: []
}
