// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        "indie-flower": ['"Indie Flower"', "cursive"],
      },
      colors: {
        paper: "#f4ede1",
      },
    },
  },
  plugins: [],
};
