import type { DriveStep } from "driver.js";

export const earnSteps = [
  {
    element: "#earn",
    onHighlightStarted: (element, step, { config, state }) => {
      var li = document.getElementById("earn");
      if (li) {
        li.firstChild?.click();
      }
    },
    popover: {
      title: "Earn",
      description:
        "The earn page will let you earn interest on your assets, either in OTC or Market mode",
    },
  },
  {
    element: "#deposits",
    popover: {
      title: "Deposits",
      description:
        "The Total Value of your deposits, this value is auto compounded, PnL and fees are included in this value",
    },
  },
  {
    element: "#apy",
    popover: {
      title: "APY",
      description:
        "The Annual Percentage Yield, this is the funding rate you will earn on your deposits, this is taking both active and inactive assets into account",
    },
  },
  {
    element: "#pnl",
    popover: {
      title: "Profit And Loss",
      description:
        "The PnL of your deposits, considering the funding rate, swap fees and trader PnL.",
    },
  },
  {
    element: "#new-position",
    onDeselected: (element, step, { config, state }) => {
      var next = document.getElementById("new-position");
      if (next) {
        next?.click();
      }
    },
    popover: {
      title: "Create an OTC position",
      description: "Click here to go to the create position page",
    },
  },
  {
    element: "#position-opener",
    onDeselected: (element, step, { config, state }) => {
      var next = document.getElementById("position-opener");
      if (next) {
        next?.click();
      }
    },
    popover: {
      title: "Select market",
      description:
        "Click here to select the market you would like to bring liquidity to",
    },
  },
  {
    element: "#select-token",
    onDeselected: (element, step, { config, state }) => {
      var next = document.getElementById("select-token");
      if (next) {
        next?.click();
      }
      var close = document.getElementById("position-modal");
      if (close) {
        close?.click();
      }
    },
    popover: {
      title: "Select a token",
      description: "Select a token in the list",
    },
  },
  {
    element: "#activation-rate",
    popover: {
      title: "Activation rate",
      description:
        "You can choose the activation rate of your position, under this rate, your position will be considered inactive and will not earn interest or swap fees",
    },
  },
  {
    element: "#liquidity-chart",
    onDeselected: (element, step, { config, state }) => {
      var swap = document.getElementById("swap");
      if (swap) {
        swap.firstChild?.click();
      }
    },
    popover: {
      title: "Liquidity chart",
      description:
        "You can consult the current liquidity already present in the pool and how you compare to it",
    },
  },
] as DriveStep[];
