import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { gqlsdk } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { derived, get } from "svelte/store";
import { resolvedTransactions, totalTraderTransactions } from "./transactions";
import { useClaims } from "./claims";
import { infosAndBalanceAsync, type TokenInfoAndBalance } from "./erc20";
import type { PoolFragmentFragment } from "./subgraph";

export type PoolInfo = {
  address: string;
  lastPrice: BigNumber;
  oracleDecimals: number;
  oracleAddress: string;
  currentPrice: BigNumber;
  tick: number;
  feeProtocol: number;
  fee: number;
  totalLiquidities: BigNumber;
  ticks?: Record<number, number>;
  token?: TokenInfoAndBalance;
};

export const poolInfoAsync = async (
  address: string,
  account?: string
): Promise<PoolInfo> => {
  const sdk = get(ethsdk);
  const p = sdk.POOL.attach(address || ethers.constants.AddressZero);
  const [oracle, slot] = await Promise.all([p.oracle(), p.oracleSlot()]);
  const o = sdk.ORACLE.attach(oracle);

  const [currentPrice, oracleDecimals, slot0, slot1, lastPrice, fee] =
    await Promise.all([
      p.getPrice(),
      o.getDecimals(slot),
      p.slot0(),
      p.slot1(),
      p.getPrice(),
      p.fee(),
      p.description(),
    ]);

  return {
    address,
    lastPrice: lastPrice,
    oracleDecimals: oracleDecimals,
    oracleAddress: o.address,
    currentPrice: currentPrice,
    tick: slot1.tick,
    feeProtocol: 0,
    fee,
    totalLiquidities: slot0.totalLiquidities,
  };
};

export const usePoolInfos = derived(
  [ethsdk, resolvedTransactions, gqlsdk, totalTraderTransactions],
  ([$ethsdk, $pt, $gqlsdk, $totalTraderTransactions], set) => {
    $gqlsdk?.getPools({}).then(async (res) => {
      console.log(res.pools);
      const poolInfos = await Promise.all(
        res.pools.map(async (p) => {
          if (!p.id) return Promise.resolve({} as PoolInfo);
          return {
            ...(await poolInfoAsync(p.id)),
            ticks: initializedTickAsync(p),
            token: await infosAndBalanceAsync(p.id),
          };
        })
      );
      set(poolInfos);
    });
  },
  [] as PoolInfo[]
);

export const initializedTickAsync = (
  pool: PoolFragmentFragment
): Record<number, number> => {
  let ticksMap = pool.ticks.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.index]: Number(formatEther(cur.liquidity || 0)),
    };
  }, {} as Record<number, number>);
  return ticksMap;
};
