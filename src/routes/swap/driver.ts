import { driver } from "driver.js";

export const d = driver({
  animate: true,
  showButtons: [],
  showProgress: false,
  popoverClass: "popover",
  overlayOpacity: 0.4,
  steps: [
    {
      element: "#token0",
      popover: {
        title: "Title for the Popover",
        description: "Description for it",
      },
    },
  ],
});

export const driveOTC = (token0: string, token1: string) => {
  const d = driver({
    animate: true,
    showProgress: true,
    popoverClass: "popover",
    steps: [
      {
        element: "#current-price",
        popover: {
          title: "Current Price",
          description: `This is the last available ${token1}'s price, expressed in ${token0}.
            This price is an estimation of the price you will get when the trade will settle`,
        },
      },
      {
        element: "#funding-rate",
        popover: {
          title: "Funding Rate",
          description: `This is the current *funding rate*, or the cost of holding ${token1} for a year.
            This funding rate is variable and is updated with each oracle price round or every 24 hours`,
        },
      },
      {
        element: "#settlement",
        popover: {
          title: "Settlement time",
          description: `This is the time when the trade will settle and the tokens will be swapped.`,
        },
      },
      {
        element: "#automate",
        popover: {
          title: "Automate",
          description: `Give permission to a third party to claim the tokens on your behalf when the trade settles. 
          This is useful if you want to automate the process of claiming the synthetic. 
          <strong>If you do not claim the token within the next round, the trade will be cancelled and you will get your collateral back in full</strong>`,
        },
      },
    ],
  });

  d.drive();
};
