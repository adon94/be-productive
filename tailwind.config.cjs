// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "indie-flower": ['"Indie Flower"', "cursive"],
      },
      colors: {
        desk: "#86D6CB",
        paper: "#e3cea6",
      },
    },
  },
  plugins: [],
};
