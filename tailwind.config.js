/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'chatSectionBackground':"url('components/chatSectionBackground.jpg')",
        'displayPictureBackground' : "url('https://shorturl.at/cjtyQ')"
      }
    },
  },
  plugins: [],
}