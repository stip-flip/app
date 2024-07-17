import { BigNumber, type BigNumberish } from "ethers";

import { commify as com } from "ethers/lib/utils.js";
import { networkInfos } from "src/stores";
import { defaultEvmStores } from "svelte-ethers-store";
import { modal } from "./web3";

// format an ERC20 amount as a number with 2 decimals
export const formatAmount = (amount: BigNumberish, ERC20decimals: number) => {
  if (!amount) return 0;
  return (
    BigNumber.from(amount)
      .div(BigNumber.from(10).pow(ERC20decimals - 3))
      .toNumber() / 1000
  );
};

export const commify = (value: any, decimals?: number) => {
  if (value == "NaN" || value == "Infinity" || (value != 0 && !value))
    return "0";
  if (typeof value == "number") return com(value?.toFixed(decimals || 2));
  return com((Number(value) || 0).toFixed(decimals || 2));
};

export async function switchNetwork(chainId: number): boolean {
  console.log("hey");
  try {
    console.log("switching network");
    // await window?.ethereum?.request({
    //   method: "wallet_switchEthereumChain",
    //   params: [{ chainId: "0x" + chainId.toString(16) }],
    // });
    await modal.switchNetwork(chainId);
    return true;
  } catch {
    console.log("switching network 2");
    await window?.ethereum?.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + chainId.toString(16),
          chainName: networkInfos[chainId]?.name,
          nativeCurrency: {
            name: networkInfos[chainId]?.name,
            symbol: networkInfos[chainId]?.symbol,
            decimals: 18,
          },
          rpcUrls: [networkInfos[chainId]?.rpc],
          blockExplorerUrls: [networkInfos[chainId]?.explorer],
        },
      ],
    });
    return false;
  }
}

export async function addToken(
  address: string,
  symbol: string,
  decimals: string
) {
  await window?.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: address,
        symbol,
        decimals,
        image: "",
      },
    },
  });
}

export function connectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    if (window.ethereum.selectedAddress) {
      defaultEvmStores.setProvider();
    }
  }
}

export function disconnectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    if (window.ethereum.selectedAddress) {
      window.ethereum
        .request({
          method: "eth_requestAccounts",
          params: [{ disconnect: true }],
        })
        .then(() => {
          defaultEvmStores.disconnect();
          console.log("Account disconnected successfully.");
        })
        .catch((error) => {
          console.error("Failed to disconnect account:", error);
        });
    }
  }
}

export function getTimeDifference(settlement: number, givenTime: number) {
  let differenceInSeconds = Math.abs(settlement - givenTime);
  // console.log(now, givenTime, differenceInSeconds);
  const hours = Math.floor(differenceInSeconds / 3600);
  differenceInSeconds %= 3600;
  const minutes = Math.floor(differenceInSeconds / 60);
  const seconds = Math.floor(differenceInSeconds % 60);

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

export function getHoursMinutesSeconds(settlement: number, givenTime: number) {
  let differenceInSeconds = Math.abs(settlement - givenTime);
  // console.log(now, givenTime, differenceInSeconds);
  const days = Math.floor(differenceInSeconds / 86400);
  differenceInSeconds %= 86400;
  const hours = Math.floor(differenceInSeconds / 3600);
  differenceInSeconds %= 3600;
  const minutes = Math.floor(differenceInSeconds / 60);
  const seconds = Math.floor(differenceInSeconds % 60);

  const paddedDays = String(days).padStart(2, "0");
  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return {
    days: paddedDays,
    hours: paddedHours,
    minutes: paddedMinutes,
    seconds: paddedSeconds,
  };
}

export function updateVc() {
  setTimeout(() => {
    console.log("updatevc");
    // find a div with id container
    const container = document.getElementById("container");
    // find a div with id footer
    const footer = document.getElementById("footer");
    // check the height of the footer
    if (!container || !footer) return;
    // see how many pixel it is from the top
    const top = container.getBoundingClientRect().top;
    const footerHeight = footer?.getBoundingClientRect().height;
    console.log(top, footerHeight, window.innerHeight - top - footerHeight);
    document.documentElement.style.setProperty(
      "--vc",
      `${(window.innerHeight - footerHeight - top) * 0.01}px`
    );
    // document.documentElement.style.setProperty(
    //   "--footer-height",
    //   `${footerHeight}px`
    // );
  }, 0);
}
