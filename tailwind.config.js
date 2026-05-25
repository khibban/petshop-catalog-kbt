/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#944a00',
        secondary: '#376847',
        background: '#fbf9f8',
        surface: '#ffffff',
        'surface-variant': '#e4e2e2',
        outline: '#887365',
        'outline-variant': '#dbc2b2',
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#554337',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      spacing: {
        'header-height': '80px',
        'sidebar-width': '280px',
        'margin-page': '2rem',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
}
