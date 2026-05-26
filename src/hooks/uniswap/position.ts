import { BigNumber, type BigNumberish } from "ethers";
import { gqlsdk, sdk } from "src/stores";
import { signerAddress } from "svelte-ethers-store";
import { derived, get, writable } from "svelte/store";
import type { UniPositionFragment } from "../subgraph";
import { resolvedTransactions } from "../transactions";

export type UniPositionInfo = UniPositionFragment & {
  fees: {
    amount0: BigNumberish;
    amount1: BigNumberish;
  };
};

const maxUint128 = BigNumber.from("1").shl(128).sub(1);

export const useUniPositionsLoading = writable(false);

export const asyncUniPositions = async (owner: string) => {
  const currentSdk = get(sdk);

  if (!currentSdk?.POSITION_MANAGER || !owner) {
    return [];
  }

  let balance: BigNumber;

  try {
    balance = await currentSdk.POSITION_MANAGER.balanceOf(owner);
  } catch (err) {
    console.warn("Unable to fetch Uniswap position balance", err);
    return [];
  }

  const tokenIDs = await Promise.all(
    Array.from(
      { length: balance.toNumber() },
      async (_, i) =>
        await currentSdk.POSITION_MANAGER.tokenOfOwnerByIndex(owner, i)
    )
  );

  const positionResults = await Promise.allSettled(
    tokenIDs.map(async (id) => {
      const p = await currentSdk.POSITION_MANAGER.positions(id);
      const fees = await currentSdk.POSITION_MANAGER.callStatic.collect({
        tokenId: id,
        recipient: owner,
        amount0Max: maxUint128,
        amount1Max: maxUint128,
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

  const positions = positionResults.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
  );

  return positions.filter((p) => !p.liquidity.isZero());
};

export const useUniPositions = derived(
  [resolvedTransactions, gqlsdk, signerAddress],
  ([$resolvedTransactions, $gqlsdk, $signerAddress], set) => {
    let cancelled = false;

    if (!$gqlsdk || !$signerAddress) {
      useUniPositionsLoading.set(false);
      set([]);
      return () => {
        cancelled = true;
      };
    }

    useUniPositionsLoading.set(true);

    asyncUniPositions($signerAddress)
      .then((res) => {
        if (!cancelled) {
          set(res);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("Unable to fetch Uniswap positions", err);
        set([]);
      })
      .finally(() => {
        if (!cancelled) {
          useUniPositionsLoading.set(false);
        }
      });

    return () => {
      cancelled = true;
    };
  },
  [] as UniPositionInfo[]
);
