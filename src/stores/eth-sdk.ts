import { getGoerliSdk, type GoerliSdk } from "eth-sdk/build";
import { chainId, signer } from "svelte-ethers-store";
import { derived, type Readable } from "svelte/store";
import { provider as provider_ } from "./provider";
import type { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";

export const marketSymbols = {
  ETHEREUM_PRICE: "ETH",
};

export const marketIds = {
  ETHEREUM_PRICE: "ethereum",
};

export const provider: Readable<MulticallProvider> = derived(
  chainId,
  ($chainId, set) => {
    switch ($chainId) {
      case 5:
        set(provider_($chainId));
        break;
      case 63:
        set(provider_($chainId));
        break;
      default:
        set(provider_(5));
        break;
    }
  }
);

export const sdk: Readable<GoerliSdk> = derived(
  [signer, chainId],
  ([$signer, $chainId], set) => {
    switch ($chainId) {
      case 5:
        set(getGoerliSdk(provider_($chainId)));
        break;
      case 63:
        set(getGoerliSdk(provider_($chainId)));
        break;
      default:
        set(getGoerliSdk(provider_(5)));
        break;
    }
  },
  null as any
);
