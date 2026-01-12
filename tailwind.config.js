/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        content: '1360px', // 1920px - 280px * 2 (PC 표준 레이아웃)
      },
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1E3A5F', // 딥 네이비 - 메인 컬러
          700: '#162D4D',
          800: '#0F1F33',
          900: '#0A1421',
        },
        surface: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
        'fade-in': 'fade-in 0.2s ease-in-out forwards',
        'fade-in-up': 'fade-in-up 1.2s ease-in-out forwards',
        'fade-in-up-delayed': 'fade-in-up 1.2s ease-in-out 0.5s forwards',
        'dropdown-in': 'dropdown-in 0.2s ease-out forwards',
        'dropdown-out': 'dropdown-out 0.2s ease-in forwards',
        'slide-in': 'fade-in-up 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
