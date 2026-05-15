module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        dark: {
          // ...require("daisyui/src/colors/themes")["[data-theme=night]"],
          primary: "#9ee6ad",
          secondary: "#c6d8e2",
          accent: "#d8e5df",
          neutral: "#242424",
          "base-100": "#242424",
          "base-200": "#2b2b2b",
          "base-300": "#171717",
          "base-content": "#efefef",
          info: "#49BDE4",
          // success: "#0C6A5F",
          warning: "#E9B43A",
          error: "#F66076",
        },
        light: {
          "color-scheme": "light",
          primary: "#4d805b",
          secondary: "#255976",
          accent: "#c6d8e2",
          neutral: "#242424",
          "base-100": "#efefef",
          "base-200": "#e5e5e5",
          "base-300": "#d8e5df",
          "base-content": "#242424",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
