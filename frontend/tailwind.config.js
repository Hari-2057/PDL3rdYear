/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          950: '#04172e',
          900: '#082B55', // Primary brand deep navy
          850: '#0c3566',
          800: '#103f7a',
          700: '#154f96',
        },
        royal: {
          500: '#1769E0', // Secondary royal blue
          600: '#1254b8',
          700: '#0e4191',
        },
        surface: {
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E5EAF0',
          subtle: '#EEF3F8',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(8, 43, 85, 0.04)',
        'sm': '0 1px 3px 0 rgba(8, 43, 85, 0.06), 0 1px 2px -1px rgba(8, 43, 85, 0.04)',
        'md': '0 4px 6px -1px rgba(8, 43, 85, 0.07), 0 2px 4px -2px rgba(8, 43, 85, 0.05)',
      },
      borderRadius: {
        'enterprise': '10px',
      }
    },
  },
  plugins: [],
}
