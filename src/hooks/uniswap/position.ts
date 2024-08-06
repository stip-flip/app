import { BigNumber, type BigNumberish } from "ethers";
import { gqlsdk, sdk } from "src/stores";
import { signerAddress } from "svelte-ethers-store";
import { derived, get } from "svelte/store";
import type { UniPositionFragment } from "../subgraph";
import { resolvedTransactions } from "../transactions";

export type UniPositionInfo = UniPositionFragment & {
  fees: {
    amount0: BigNumberish;
    amount1: BigNumberish;
  };
};

export const asyncUniPositions = async (owner: string) => {
  const balance = await get(sdk).POSITION_MANAGER.balanceOf(owner);

  const tokenIDs = await Promise.all(
    Array.from(
      { length: balance.toNumber() },
      async (_, i) =>
        await get(sdk).POSITION_MANAGER.tokenOfOwnerByIndex(owner, i)
    )
  );

  const positions = await Promise.all(
    tokenIDs.map(async (id) => {
      const p = await get(sdk).POSITION_MANAGER.positions(id);
      const fees = await get(sdk).POSITION_MANAGER.callStatic.collect({
        tokenId: id,
        recipient: get(signerAddress),
        amount0Max: BigNumber.from("1").shl(128).sub(1),
        amount1Max: BigNumber.from("1").shl(128).sub(1),
      });
      return {
        ...p,
        token0: p.token0.toLowerCase(),
        token1: p.token1.toLowerCase(),
        id,
        fees,
      };
    })
  );

  console.log(
    positions,
    positions.filter((p) => !p.liquidity.isZero())
  );

  return positions.filter((p) => !p.liquidity.isZero());
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
