import { parseUnits } from "ethers/lib/utils";
import { derived, type Readable } from "svelte/store";

export * from "./eth-sdk";
export * from "./app-state";
export * from "./gql";

export const MAX_FR = parseUnits("604462", 18);
// export const MIN_FR = parseUnits("-604462", 18);

export const SUPPORTED_NETWORKS = [61, 63];

export const networkInfos: { [key: string]: any } = {
  61: {
    name: "The Ether",
    icon: "mdi:ethereum",
    rpc: "https://etc.etcdesktop.com",
    explorer: "https://etc.blockscout.com/",
    tokenName: "Ether Coin",
    symbol: "ETC",
    decimals: 18,
  },
  63: {
    name: "Mordor",
    icon: "mdi:ethereum",
    rpc: "https://mordor.sf.exchange",
    explorer: "https://mordor-etc.blockscout.com/",
    symbol: "METC",
    decimals: 18,
  },
};

// create a store that return the current timestamp update every seconds
export const timestamp: Readable<number> = derived([], (_, set) => {
  setInterval(() => {
    set(Math.floor(Date.now() / 1000));
  }, 1000);
});

// create a store that will return the timestamp every 10 secons
export const timestamp10: Readable<number> = derived([], (_, set) => {
  setInterval(() => {
    set(Math.floor(Date.now() / 1000));
  }, 10000);
});
