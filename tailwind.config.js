/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Include all files inside `app/`
    "./components/**/*.{js,ts,jsx,tsx}", // Include all components
    "./lib/**/*.{js,ts,jsx,tsx}", // Include any utility functions that use classNames
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
