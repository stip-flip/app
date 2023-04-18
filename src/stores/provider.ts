import { ethers } from "ethers";
import { providers } from "@0xsequence/multicall";
import type { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";

export const mainDefaultChainId = 5;

export type Network = 11155111 | 5;

export const INITIAL_BLOCK = 3108107;

const networks = {
  // 4: 'rinkeby.infura.io/v3/17509665a88549b9a5a5f8f3e291120c',
  // 11155111: "eth-sepolia.g.alchemy.com/v2/p485wpX8q1LUZSlUwcqc_ClbYCle4aKu",
  11155111: "sepolia.infura.io/v3/222a8beda9f5441a94f13ce9c96c546e",
  // 11155111: "sepolia.infura.io/v3/abc8b7a77e5b4c30a07658a2ed48a216",
  5: "goerli.infura.io/v3/222a8beda9f5441a94f13ce9c96c546e",

  // development infura link
  // 5: 'goerli.infura.io/v3/581e31cfc0c74b7992093dd62622e9ec'

  // deployment infura link
  // 5: "goerli.infura.io/v3/72b938c53bcf40678b633c011a80a2bf",

  // 137: 'anvil-node-v1-default.0f30s0.on-rio.io',
  // 1337: 'anvil-node-v1-default.0f30s0.on-rio.io',
  // 31337: 'anvil-node-v1-default.0f30s0.on-rio.io'
};

export const blockTimes = (chainId?: 1 | 4 | 42 | 137 | 1337 | 31337) => {
  const bt = {
    1: 13,
    4: 13,
    42: 13,
    137: 2,
    1337: 13,
    31337: 13,
  };
  return bt[chainId || 1];
};

const protocol =
  typeof window != "undefined" && window?.location?.protocol
    ? window?.location?.protocol
    : "http:";

const providerMap = {
  // 1: new providers.MulticallProvider(new ethers.providers.StaticJsonRpcProvider(networks[1])),
  11155111: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider(
      "https:" + "//" + networks[11155111]
    )
  ),
  5: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider("https:" + "//" + networks[5])
  ),
  // 42: new providers.MulticallProvider(new ethers.providers.StaticJsonRpcProvider(networks[42])),
  // 137: new providers.MulticallProvider(
  // 	new ethers.providers.StaticJsonRpcProvider(protocol + '//' + networks[137])
  // ),
  // 1337: new providers.MulticallProvider(
  // 	new ethers.providers.StaticJsonRpcProvider(protocol + '//' + networks[1337]),
  // 	{ contract: '0xf4269fcea52499c410059e50136c166cb173d38b', batchSize: 15 }
  // ),
  // 31337: new providers.MulticallProvider(
  // 	new ethers.providers.StaticJsonRpcProvider(protocol + '//' + networks[31337])
  // ),
  fallBack: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider(
      "https:" + "//" + networks[11155111]
    )
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
      : defaultChainId || chainId || 11155111
  ];
};
