/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF6B9D',
        'secondary': '#FEC84B',
        'success': '#12B76A',
        'info': '#7C3AED',
        'warning': '#F97316',
      },
      fontFamily: {
        'kids': ['Comic Sans MS', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
