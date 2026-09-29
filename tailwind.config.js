/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          50: '#F3F1FE',
          100: '#E6E1FD',
          200: '#CDC3FB',
          300: '#AEA0F7',
          400: '#8B79F1',
          500: '#6C5CE7',
          600: '#5642D6',
          700: '#4432B0',
          800: '#372A8A',
          900: '#2A2168',
        },
        accent: {
          DEFAULT: '#00D9C0',
          light: '#5FF5E0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#12101A',
          card: '#F8F7FC',
          cardDark: '#1B1826',
          border: '#E7E4F2',
          borderDark: '#2E2A3E',
        },
        muted: {
          DEFAULT: '#6B667A',
          light: '#9C97AC',
        },
        danger: {
          DEFAULT: '#FF5A6E',
          light: '#FFE3E7',
        },
        success: {
          DEFAULT: '#22C58B',
          light: '#DFF8ED',
        },
        warning: {
          DEFAULT: '#FFB020',
          light: '#FFF3DA',
        },
        info: {
          DEFAULT: '#3E9BFF',
          light: '#E3F1FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        glow: '0 8px 40px -8px rgba(108, 92, 231, 0.45)',
        card: '0 4px 24px -6px rgba(20, 15, 45, 0.08)',
        'card-dark': '0 4px 24px -6px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C5CE7 0%, #00D9C0 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1B1826 0%, #12101A 100%)',
        'gradient-radial': 'radial-gradient(circle at top left, rgba(108,92,231,0.25), transparent 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
