/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B18',
          900: '#0B132B',
          850: '#111C3D',
          800: '#1C2541',
          700: '#27355B',
          600: '#3A506B',
        },
        electric: {
          400: '#38BDF8',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
