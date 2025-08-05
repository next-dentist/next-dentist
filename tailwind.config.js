// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: "#0f2138",
        secondary: "#DF9D7C",
        background: "#18273a",
        foreground: "#f4f8f8",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".popover-content-width-same-as-its-trigger": {
          width: "var(--radix-popover-trigger-width)",
          "max-height": "var(--radix-popover-content-available-height)",
        },
      });
    },
  ],
};
