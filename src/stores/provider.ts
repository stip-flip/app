import { ethers } from "ethers";
import { providers } from "@0xsequence/multicall";
import type { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";

export const mainDefaultChainId = 5;

export type Network = 63 | 5;

export const INITIAL_BLOCK = 3108107;

const networks = {
  5: "goerli.infura.io/v3/222a8beda9f5441a94f13ce9c96c546e",
  63: "rpc.mordor.etccooperative.org",
};

const providerMap = {
  5: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[5])
  ),
  63: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[63])
  ),
};

export const provider = (
  chainId?: Network,
  defaultChainId?: Network
): MulticallProvider => {
  // return providerMap[chainId == 1337 ? 1337 : defaultChainId || chainId || 5];
  return providerMap[
    chainId == mainDefaultChainId
      ? mainDefaultChainId
      : defaultChainId || chainId || 5
  ];
};
