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
          primary: "#6dc096",
          secondary: "#309aa8",
          accent: "#3774d6",
          neutral: "#2D2933",
          "base-100": "#424158",
          info: "#49BDE4",
          success: "#0C6A5F",
          warning: "#E9B43A",
          error: "#F66076",
        },
        light: {
          "color-scheme": "light",
          primary: "#303b52",
          secondary: "#ef9fbc",
          accent: "#eeaf3a",
          neutral: "#3876a1",
          "base-100": "#faf7f5",
          "base-200": "#efeae6",
          "base-300": "#e7e2df",
          "base-content": "#291334",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
