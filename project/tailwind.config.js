/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E50914',
          50: '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#E50914',
          600: '#c80710',
          700: '#a50610',
          800: '#870a14',
          900: '#720d15',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          50: '#f5f5f5',
          900: '#111111',
          950: '#0a0a0a',
          975: '#060606',
        },
        accent: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-fade': 'linear-gradient(to top, #0a0a0a 5%, rgba(10,10,10,0.4) 35%, rgba(10,10,10,0.1) 70%, transparent 100%)',
        'hero-left': 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 40%, transparent 80%)',
        'card-fade': 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(229,9,20,0.5)' },
          '50%': { boxShadow: '0 0 0 12px rgba(229,9,20,0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.12) translate(-1%, -1%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-brand': 'pulse-brand 2s infinite',
        'ken-burns': 'ken-burns 18s ease-out infinite alternate',
      },
    },
  },
  plugins: [],
};
