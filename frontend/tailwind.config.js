/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'avenir': ['Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'avenir-light': ['Avenir Next Light', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'avenir-medium': ['Avenir Next Medium', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'avenir-semibold': ['Avenir Next Semibold', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'avenir-bold': ['Avenir Next Bold', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'avenir-heavy': ['Avenir Next Heavy', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
