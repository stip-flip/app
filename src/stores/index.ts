import { parseUnits } from "ethers/lib/utils";
import { derived, type Readable } from "svelte/store";

export * from "./eth-sdk";
// export * from "./provider";

export * from "./gql";

export const MAX_FR = parseUnits("604462", 18);
// export const MIN_FR = parseUnits("-604462", 18);

export const SUPPORTED_NETWORKS = [61, 63];

// create a store that return the current timestamp update every seconds
export const timestamp: Readable<number> = derived([], (_, set) => {
  setInterval(() => {
    set(Math.floor(Date.now() / 1000));
  }, 1000);
});
