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
  totalStakes: BigNumber;
  totalMana: BigNumber;
};

export const oracleInfoAsync = async (
  account: string,
  oracleAddress: string
): Promise<OracleInfo> => {
  if (!account || !oracleAddress) return {} as OracleInfo;
  try {
    const sdk = get(ethsdk);
    const oracle = sdk.ORACLE.attach(oracleAddress);
    const [minStake, stakes, rewards, mana, totalStakes, totalMana] =
      await Promise.all([
        oracle.minStake(),
        oracle.stakes(account),
        oracle.getAccumulatedRewards(account),
        oracle.mana(account),
        oracle.totalStakes(),
        oracle.totalMana(),
      ]);

    return {
      minStake,
      stakes,
      rewards,
      mana,
      totalStakes,
      totalMana,
    };
  } catch (e) {
    console.warn(e);
    return {} as OracleInfo;
  }
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

export const useOraclesInfo = (account: string, oracleAddresses: string[]) => {
  console.log("useOraclesInfo", account, oracleAddresses);
  return derived(
    [ethsdk, resolvedTransactions, signerAddress],
    ([$ethsdk, $pt, $sa], set) => {
      if (!$ethsdk || !account || !oracleAddresses) return;
      Promise.all(
        oracleAddresses.map((oracleAddress) =>
          oracleInfoAsync(account, oracleAddress)
        )
      )
        .then((infos) => {
          set(infos);
        })
        .catch((err) => console.error(err));
    },
    [] as OracleInfo[]
  );
};

export const ORACLES_NAMES = {
  ["0x4AC635E92801e657F44BDEfcc7660Ea1431DF846"]: "Crypto",
};
