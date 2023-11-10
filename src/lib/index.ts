import { BigNumber, type BigNumberish } from "ethers";

import { commify as com } from "ethers/lib/utils.js";

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

export async function switchNetwork() {
  await window?.ethereum?.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x5" }],
  });
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
