import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ["@lottiefiles/svelte-lottie-player"],
  },
  server: {
    fs: {
      allow: ["eth-sdk"],
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
