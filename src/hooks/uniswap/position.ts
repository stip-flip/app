import { gqlsdk, sdk } from "src/stores";
import { derived, get } from "svelte/store";
import { resolvedTransactions } from "../transactions";
import { signerAddress } from "svelte-ethers-store";
import type { UniPositionFragment } from "../subgraph";
import { constants, type BigNumberish, BigNumber } from "ethers";

export type UniPositionInfo = UniPositionFragment & {
  fees: {
    amount0: BigNumberish;
    amount1: BigNumberish;
  };
};

export const asyncUniPositions = async (owner: string) => {
  const results = await get(gqlsdk).getUniPositions({
    where: { owner: owner.toLowerCase() },
  });
  const fees = await Promise.all(
    results.uniPositions.map(
      async (p) =>
        await get(sdk).POSITION_MANAGER.callStatic.collect({
          tokenId: p.id,
          recipient: get(signerAddress),
          amount0Max: BigNumber.from("1").shl(128).sub(1),
          amount1Max: BigNumber.from("1").shl(128).sub(1),
        })
    )
  );

  return results.uniPositions.map((p, i) => ({
    ...p,
    fees: fees[i],
  }));
};

export const useUniPositions = derived(
  [resolvedTransactions, gqlsdk, signerAddress],
  ([$resolvedTransactions, $gqlsdk, $signerAddress], set) => {
    if (!$gqlsdk) set([]);
    asyncUniPositions($signerAddress)
      .then((res) => set(res))
      .catch((err) => console.log(err));
  },
  [] as UniPositionInfo[]
);
