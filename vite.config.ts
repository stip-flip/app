import { sveltekit } from "@sveltejs/kit/vite";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  // WARN: this will not be necessary on your project
  logLevel: "info",
  server: {
    fs: {
      // Allow serving files from hoisted root node_modules
      allow: ["eth-sdk", "../.."],
    },
  },
  resolve: {
    alias: {
      src: ["/src"],
      "eth-sdk": ["/eth-sdk"],
      // ["ethers/lib/utils"]: ["ethers/lib/utils.js"]
    },
  },
});
