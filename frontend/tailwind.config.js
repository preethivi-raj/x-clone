import   daisyui from 'daisyui'
import themes from 'daisyui/src/theming/themes'
import daisyUiTheme from "daisyui/src/theming/themes"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes : [
      "light",
      {
        black : {
          ...daisyUiTheme["black"],
          primary : "rgb(29,155,240)",
          secondary : "rgb(24,24,24)",
        },
      },
    ],
  },
}

