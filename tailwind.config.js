/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'secondary': '#3b7197',
        'primary-2': '#4a8db7',
        'primary-1': '#74bde0',
        'light': '#f1f1f1',
      }
    },
  },
  plugins: [],
}
