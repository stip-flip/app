import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "exchange.sf.app",
  appName: "Stip&Flip",
  webDir: "build",
  ios: {
    backgroundColor: "rgb(255, 255, 255)",
    scrollEnabled: false,
  },
};

export default config;
