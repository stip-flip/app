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
          secondary: "#7aa7b9",
          accent: "#b7a8ff",
          neutral: "#252a32",
          "base-100": "#252a32",
          "base-200": "#1f222b",
          "base-300": "#171922",
          "base-content": "#f4f6f1",
          info: "#49BDE4",
          // success: "#0C6A5F",
          warning: "#E9B43A",
          error: "#F66076",
        },
        light: {
          "color-scheme": "light",
          primary: "#4d805b",
          secondary: "#5d6678",
          accent: "#695f9f",
          neutral: "#252a32",
          "base-100": "#f5f7f2",
          "base-200": "#e9eee7",
          "base-300": "#d8dfd6",
          "base-content": "#242833",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
