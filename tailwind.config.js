/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#4A5D4E',
          light: '#5E7362',
          dark: '#354538'
        },
        cream: {
          DEFAULT: '#F9F8F3',
          dark: '#EBE9DD'
        },
        white: '#FFFFFF'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
