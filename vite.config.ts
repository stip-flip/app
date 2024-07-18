import { sveltekit } from "@sveltejs/kit/vite";
import { VitePWA } from "vite-plugin-pwa";

import { defineConfig } from "vite";

const generateSW = true;

export default defineConfig({
  // WARN: this will not be necessary on your project
  logLevel: "info",
  server: {
    fs: {
      // Allow serving files from hoisted root node_modules
      allow: ["eth-sdk", "../.."],
    },
  },
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      src: ["/src"],
      "eth-sdk": ["/eth-sdk"],
      // ["ethers/lib/utils"]: ["ethers/lib/utils.js"]
    },
  },
});
