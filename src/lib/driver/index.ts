import { driver } from "driver.js";
import { walletSteps } from "./wallet";
import { swapSteps } from "./swap";
import { earnSteps } from "./earn";
import { page } from "$app/stores";

export const pageTour = (pageName: string) => {
  const config = {
    animate: true,
    showButtons: [],
    showProgress: false,
    popoverClass: "popover",
    nextBtnText: "Next",
    prevBtnText: "Back",
    overlayOpacity: 0.4,
  };
  switch (pageName) {
    case "wallet":
      return driver({
        ...config,
        steps: walletSteps,
      });
    case "swap":
      return driver({ ...config, steps: swapSteps });
    case "earn":
      return driver({ ...config, steps: earnSteps });
    default:
      return driver({ ...config, steps: earnSteps });
  }
};

export const appTour = driver({
  animate: true,
  showButtons: [],
  showProgress: false,
  popoverClass: "popover",
  nextBtnText: "Next",
  prevBtnText: "Back",
  overlayOpacity: 0.4,

  steps: [
    {
      element: "#modes",
      popover: {
        title: "App Mode",
        description:
          "Stip&Flip works in 2 mode. Over The Counter (OTC) and Market.",
      },
    },
    {
      element: "#otc-mode",
      popover: {
        title: "Over The Counter",
        description:
          "S&F goes in OTC (Over The Counter) mode, this means that the trade will be settled at the next oracle round, at the price reported by the oracle",
      },
    },
    {
      element: "#market-mode",
      popover: {
        title: "Market",
        description:
          "S&F goes in Market mode, Trades are instant and the price is determined by the Uniswap pool (like a regular swap)",
      },
    },
    {
      element: "#wallet-connect",
      popover: {
        title: "Wallet",
        description:
          "Click here to connect your wallet, you can use Metamask, Coinbase or any other wallet that supports EIP-1193",
      },
    },
    ...walletSteps,
    ...swapSteps,
    // ...earnSteps,
  ],
});
