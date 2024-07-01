import type { DriveStep } from "driver.js";

export const swapSteps = [
  {
    element: "#swap",
    onHighlightStarted: (element, step, { config, state }) => {
      var li = document.getElementById("swap");
      if (li) {
        li.firstChild?.click();
      }
    },
    popover: {
      title: "Swap",
      description:
        "The swap page will let you swap between assets, either in OTC or Market mode",
    },
  },
  {
    element: "#token0",
    onDeselected: (element, step, { config, state }) => {
      var label = document.getElementById("token0");
      if (label) {
        label?.click();
      }
    },
    popover: {
      title: "Sell Token",
      description: "Select the token you would like to sell",
    },
  },
  {
    element: "#menu",
    popover: {
      title: "Token Filter",
      description:
        "Use this menu to filter out the tokens you are interested in. Filter by exposition (long or short) or by leverage, you can use no leverage or squared and cubed leverage. Learn more <a href='https://docs.sf.exchange/docs/protocol-rules/leverage'>here</a>",
    },
  },
  {
    element: "#list-token",
    onHighlighted: (element, step, { config, state }) => {
      var list = document.getElementById("list-token");
      console.log(list);
      if (list) {
        list?.click();
      }
    },
    popover: {
      title: "Select Sell Token",
      description: "Select in the list the token you would like to sell",
    },
  },
  {
    element: "#modal-next",
    onDeselected: (element, step, { config, state }) => {
      var next = document.getElementById("modal-next");
      if (next) {
        next?.click();
      }
    },
    popover: {
      title: "Go to next step",
      description: "Click here to select the buy token",
    },
  },
  {
    element: "#list-token",
    onHighlighted: (element, step, { config, state }) => {
      var list = document.getElementById("list-token");
      if (list) {
        list?.click();
      }
    },
    onDeselected: (element, step, { config, state }) => {
      var done = document.getElementById("selectToken");
      if (done) {
        done?.click();
      }
    },
    popover: {
      title: "Select Buy Token",
      description: "Select in the list the token you would like to buy",
    },
  },
  {
    element: "#current-price",
    popover: {
      title: "Last submitted price",
      description:
        "This is the last submitted price for the selected token pair, the price is expressed in ETC. This is NOT the price at which the trade will be settled",
    },
  },
  {
    element: "#funding-rate",
    popover: {
      title: "Current funding rate",
      description:
        "For the pair selected, the current funding rate or the trader cost for holding the token for a year",
    },
  },
  {
    element: "#settlement",
    popover: {
      title: "Next settlement",
      description:
        "At what time will the trade be settled and the tokens swapped",
    },
  },
  {
    element: "#automate",
    popover: {
      title: "Automate",
      description:
        "You can give permission to a third party to claim the tokens on your behalf when the trade settles. This is useful if you want to automate the process of claiming the synthetic. If you do not claim the token within the next round (24h), the trade will be cancelled. This will involve a fee to cover the gas cost",
    },
  },
] as DriveStep[];
