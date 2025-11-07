/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for the three connection types
        'connection-opposite': '#ef4444', // red
        'connection-link': '#3b82f6', // blue
        'connection-linear': '#10b981', // green
      },
    },
  },
  plugins: [],
}
