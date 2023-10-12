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
        'displayPictureBackground' : "url('https://res.cloudinary.com/dgajofeja/image/upload/v1697100260/akjmt1tl070y3ss6qodq.png')"
      }
    },
  },
  plugins: [],
}