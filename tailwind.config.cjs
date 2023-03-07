/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.marko"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
