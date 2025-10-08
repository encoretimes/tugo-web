/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea', // Main brand color
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937', // Main dark color
          900: '#111827',
        },
      },
      fontFamily: {
        serif: ['var(--font-gowun-batang)', 'serif'],
        sans: ['var(--font-noto-sans-kr)', 'sans-serif'],
      },
      keyframes: {
        'pan-image-down': {
          '0%': { objectPosition: 'center top' },
          '100%': { objectPosition: 'center bottom' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dropdown-in': {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'dropdown-out': {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(-10px) scale(0.95)' },
        },
      },
      animation: {
        'pan-image-down': 'pan-image-down 8s ease-out forwards',
        'fade-in-up': 'fade-in-up 1.2s ease-in-out forwards',
        'fade-in-up-delayed': 'fade-in-up 1.2s ease-in-out 0.5s forwards',
        'dropdown-in': 'dropdown-in 0.2s ease-out forwards',
        'dropdown-out': 'dropdown-out 0.2s ease-in forwards',
        'slide-in': 'fade-in-up 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
