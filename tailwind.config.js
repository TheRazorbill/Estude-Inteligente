/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#6A0572',
        'secondary': '#8E299C',
        'accent': '#FFD700',
        'text-dark': '#2C3E50',
        'text-light': '#7F8C8D',
      }
    },
  },
  plugins: [],
}