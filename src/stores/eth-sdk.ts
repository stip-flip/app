import { ethers } from "ethers";
import { providers } from "@0xsequence/multicall";
import { getMordorSdk, type MordorSdk } from "eth-sdk/build";
import { chainId, signer } from "svelte-ethers-store";
import { derived, type Readable } from "svelte/store";

import type { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";

export const mainDefaultChainId = 61;

export type Network = 63 | 61;

export const INITIAL_BLOCK = 3108107;

const networks = {
  61: "etc.etcdesktop.com",
  63: "mordor.sf.exchange",
};

const providerMap = {
  61: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[61])
  ),
  63: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[63])
  ),
};

const provider_ = (
  chainId?: Network,
  defaultChainId?: Network
): MulticallProvider => {
  // return providerMap[chainId == 1337 ? 1337 : defaultChainId || chainId || 5];
  return providerMap[
    chainId == mainDefaultChainId
      ? mainDefaultChainId
      : defaultChainId || chainId || 61
  ];
};

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
      case 63:
        set(provider_($chainId));
        break;
      default:
        set(provider_(63));
        break;
    }
  }
);

export const sdk: Readable<MordorSdk> = derived(
  [signer, chainId],
  ([$signer, $chainId], set) => {
    switch ($chainId) {
      case 63:
        set(getMordorSdk(provider_($chainId)));
        break;
      default:
        set(getMordorSdk(provider_(63)));
        break;
    }
  },
  null as any
);
