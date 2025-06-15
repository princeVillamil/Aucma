/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#F15A29',
        orangeLight: '#FF7C4D',
        maroon: '#4E130D',
        bg: '#FFF9F5',
        grayText: '#333333',
      },
    },
  },
  plugins: [],
}