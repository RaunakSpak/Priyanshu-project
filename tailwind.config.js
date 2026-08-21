/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00E5FF',
        accent: '#4CAF50',
        background: '#121212',
      },
    },
  },
  plugins: [],
}
