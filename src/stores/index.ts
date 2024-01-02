import { parseUnits } from "ethers/lib/utils";

export * from "./eth-sdk";
export * from "./provider";
export * from "./gql";

export const MAX_FR = parseUnits("604462", 18);
// export const MIN_FR = parseUnits("-604462", 18);

export const SUPPORTED_NETWORKS = [5, 63];
