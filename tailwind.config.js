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
      },
    },
  },
  plugins: [],
};
