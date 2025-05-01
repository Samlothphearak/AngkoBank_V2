/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
        },
        green: {
          100: '#dcfce7',
          800: '#166534',
        },
        blue: {
          100: '#dbeafe',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}
