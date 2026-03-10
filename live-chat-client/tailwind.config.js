/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        elevated:
          'rgba(0, 0, 0, 0.08) 0px 10px 30px -5px, rgba(0, 0, 0, 0.04) 0px 4px 10px -2px',
      },
    },
  },
  plugins: [],
}
