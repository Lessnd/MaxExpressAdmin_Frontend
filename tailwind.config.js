/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tu color corporativo exacto
        primary: {
          DEFAULT: '#4089f5', // El $primary-color de tu SCSS
          hover: '#3070d5',   // El $primary-hover
        },
        // Mapeo de tus variables SCSS a Tailwind
        bg: {
          app: '#e4e7eb', // $background-color
        }
      }
    },
  },
  plugins: [],
}