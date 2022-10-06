// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  important: true,
  theme: {
    extend: {
      fontFamily: {
        "indie-flower": ['"Indie Flower"'],
        "uncial-antiqua": ['"Uncial Antiqua"'],
      },
      colors: {
        paper: "#fff",
      },
    },
  },
  plugins: [],
};
