import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { gqlsdk } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { derived, get } from "svelte/store";
import { infosAndBalanceAsync, type TokenInfoAndBalance } from "../erc20";
import type { PoolFragment } from "../subgraph";
import { resolvedTransactions } from "../transactions";
import { reverseRatio } from "src/lib/sf/reverse";

// synth token is expected to be token 0 accross the app
// sometimes it is token1, we note the pool as reversed in that case
export type PoolInfo = {
  address: string;
  tick: number;
  ratio: number; // the current pool ratio
  sqrtRatio: number; // the current pool ratio sqrt
  synthRatio: number; // the synthetic token ratio (useful to translate to a synth price)
  synthPrice: number; // the synth price (useful to translate to a synth price)
  price: number; // the pool ratio, translated to a synth price
  token0?: TokenInfoAndBalance; // extract more info from token0 address
  token1?: TokenInfoAndBalance; // extract more info from token1 address
  synthIndex?: 0 | 1; // the index of the synth token (token 0 or 1)
  synth?: TokenInfoAndBalance; // whichever token is the synth (0 or 1) store its info here
  reversed?: boolean; // if the synth token is token1
};

export const poolInfoAsync = async (pool: PoolFragment): Promise<PoolInfo> => {
  // return await get(gqlsdk).getPools();
  const sdk = get(ethsdk);

  const p = sdk.UNIV3_POOL.attach(pool.id);

  const synthAddress =
    pool.token0.toLowerCase() == sdk.WETC9.address.toLowerCase()
      ? pool.token1
      : pool.token0;

  const s = sdk.POOL.attach(synthAddress);
  const [oracle, slot] = await Promise.all([s.oracle(), s.oracleSlot()]);
  const o = sdk.ORACLE.attach(oracle);

  const [
    slot0,
    token0Info,
    token1Info,
    synthPrice,
    synthRatio,
    oracleDecimals,
  ] = await Promise.all([
    p.slot0(),
    infosAndBalanceAsync(pool.token0),
    infosAndBalanceAsync(pool.token1),
    s.getPrice(),
    s.sharesValueWithRebalance(parseEther("1")),
    o.getDecimals(slot),
  ]);

  const sqrtRatio = slot0.sqrtPriceX96.mul(1e6).shr(96).toNumber() / 1e6;
  const ratio = sqrtRatio * sqrtRatio;

  console.log("ratio", ratio, slot0.sqrtPriceX96.toString());
  const reversed = pool.token0.toLowerCase() == sdk.WETC9.address.toLowerCase();
  const price =
    (Number(formatUnits(synthPrice, oracleDecimals)) *
      reverseRatio(ratio, reversed)) /
    Number(formatEther(synthRatio));

  return {
    address: pool.id,
    tick: slot0.tick,
    ratio,
    sqrtRatio,
    synthRatio: Number(formatEther(synthRatio)),
    synthPrice: Number(formatUnits(synthPrice, oracleDecimals)),
    price,
    token0: token0Info,
    token1: token1Info,
    synthIndex:
      pool.token0.toLowerCase() == sdk.WETC9.address.toLowerCase() ? 1 : 0,
    synth: synthAddress == pool.token0 ? token0Info : token1Info,
    reversed,
  };
};

export const usePoolInfos = derived(
  [ethsdk, resolvedTransactions, gqlsdk],
  ([$ethsdk, $resolvedTransactions, $gqlsdk], set) => {
    $gqlsdk?.getPools().then(async (res) => {
      const pools = await Promise.all(
        res.pools.map((p: PoolFragment) => poolInfoAsync(p))
      );
      set(pools);
    });
  },
  [] as PoolInfo[]
);
