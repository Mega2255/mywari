/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f7ee',
          100: '#e2eccc',
          200: '#c5d99a',
          300: '#a3c160',
          400: '#86ab3a',
          500: '#6b8e23',
          600: '#52701a',
          700: '#3d5415',
          800: '#2c3d10',
          900: '#1a240a',
        },
        earth: {
          50: '#f5f0eb',
          100: '#e8ddd0',
          200: '#d0b99b',
          300: '#b8916b',
          400: '#9e6e47',
          500: '#6B3A2A',
          600: '#5a3022',
          700: '#47261b',
          800: '#341c13',
          900: '#1f100b',
        },
        cream: '#F5F0E8',
        bark: '#5C3D2E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
