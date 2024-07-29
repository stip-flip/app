import type { BigNumber } from "ethers/lib/ethers";
import { derived, get } from "svelte/store";

import { sdk as ethsdk } from "src/stores/eth-sdk";
import { resolvedTransactions } from "../transactions";
import { signerAddress } from "svelte-ethers-store";

export type OracleInfo = {
  minStake: BigNumber;
  stakes: BigNumber;
  rewards: BigNumber;
  mana: BigNumber;
};

export const oracleInfoAsync = async (
  account: string,
  oracleAddress: string
): Promise<OracleInfo> => {
  if (!account || !oracleAddress) return {} as OracleInfo;
  const sdk = get(ethsdk);
  const oracle = sdk.ORACLE.attach(oracleAddress);
  const [minStake, stakes, rewards, mana] = await Promise.all([
    oracle.minStake(),
    oracle.stakes(account),
    oracle.getAccumulatedRewards(account),
    oracle.mana(account),
  ]);

  return {
    minStake,
    stakes,
    rewards,
    mana,
  };
};

export const useOracleInfo = (account: string, oracleAddress: string) => {
  console.log("useOracleInfo", account, oracleAddress);
  return derived(
    [ethsdk, resolvedTransactions, signerAddress],
    ([$ethsdk, $pt, $sa], set) => {
      if (!$ethsdk || !account || !oracleAddress) return;
      oracleInfoAsync(account, oracleAddress).then((info) => {
        set(info);
      });
    },
    {} as OracleInfo
  );
};
