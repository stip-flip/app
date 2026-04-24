import { ethers } from "ethers";
import { providers } from "@0xsequence/multicall";
import { getEtherSdk, getMordorSdk, type MordorSdk } from "eth-sdk/build";
import { chainId, signer } from "svelte-ethers-store";
import { derived, type Readable } from "svelte/store";

import type { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";

export const mainDefaultChainId = 61;

export type Network = 63 | 61;

export const INITIAL_BLOCK = 3108107;

const networks = {
  61: "etc.etcdesktop.com",
  63: "mordor.stipflip.xyz",
};

const providerMap = {
  61: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[61]),
    {
      batchSize: 50,
      timeWindow: 50,
      contract: "0xA0be3B62e582938e7c8dA84AA56f35755180Ae61",
    }
  ),
  63: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[63]),
    {
      batchSize: 50,
      timeWindow: 50,
      contract: "0xf7AE82eEDaFf3F12cB6961074F8ae64bB3C0097D",
    }
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
      case 61:
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
      case 61:
        set(getEtherSdk(provider_($chainId)));
        break;
      default:
        set(getEtherSdk(provider_(61)));
        break;
    }
  },
  null as any
);
