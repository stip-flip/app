import { getGoerliSdk, type GoerliSdk } from "eth-sdk/build";
import { chainId, signer } from "svelte-ethers-store";
import { derived, type Readable } from "svelte/store";
import { provider } from "./provider";

export const marketSymbols = {
  ETHEREUM_PRICE: "ETH",
};

export const marketIds = {
  ETHEREUM_PRICE: "ethereum",
};

export const sdk: Readable<GoerliSdk> = derived(
  [signer, chainId],
  ([$signer, $chainId], set) => {
    switch ($chainId) {
      case 5:
        set(getGoerliSdk(provider($chainId)));
        break;
      default:
        set(getGoerliSdk(provider(5)));
        break;
    }
  },
  null as any
);
