/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary-1': '#5BA6A6',
        'primary-2': '#4a8db7',
        'secondary': '#6fa8dc',
        'light': '#cfcfcf65',
        'gray': '#f7f7f7',
      }
    },
  },
  plugins: [],
}
