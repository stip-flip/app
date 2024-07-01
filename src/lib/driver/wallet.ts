import type { DriveStep } from "driver.js";

export const walletSteps = [
  {
    element: "#wallet",
    onHighlightStarted: (element, step, { config, state }) => {
      var li = document.getElementById("wallet");

      if (li) {
        li.firstChild?.click();
      }
    },
    popover: {
      title: "Wallet",
      description:
        "The wallet page will show you all the S&F tokens you own, the current funding rate applied and their balance. If some OTC trades are ongoing, you will see them here as well",
    },
  },
] as DriveStep[];
