import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { gqlsdk } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { derived, get } from "svelte/store";
import { resolvedTransactions, totalTraderTransactions } from "../transactions";
import { useClaims } from "../claims";
import { infosAndBalanceAsync, type TokenInfoAndBalance } from "../erc20";
import type { SynthFragmentFragment } from "../subgraph";

export type SynthInfo = {
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
  settlementTimestamp: number;
  ratio: BigNumber;
};

export const synthInfoAsync = async (
  address: string,
  account?: string
): Promise<SynthInfo> => {
  const sdk = get(ethsdk);
  const p = sdk.POOL.attach(address || ethers.constants.AddressZero);
  const [oracle, slot] = await Promise.all([p.oracle(), p.oracleSlot()]);
  const o = sdk.ORACLE.attach(oracle);

  const [
    currentPrice,
    slot0,
    slot1,
    lastPrice,
    fee,
    oracleDecimals,
    round,
    frequency,
    initialized,
    roundDuration,
    ratio,
  ] = await Promise.all([
    p.getPrice(),
    p.slot0(),
    p.slot1(),
    p.getPrice(),
    p.fee(),
    o.getDecimals(slot),
    o.getLastRound(),
    o.frequency(),
    o.initialized(),
    o.roundDuration(),
    p.sharesValueWithRebalance(parseEther("1")),
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
    settlementTimestamp:
      initialized.toNumber() +
      (round.toNumber() + 1) * frequency +
      roundDuration,
    ratio: ratio.isZero() ? parseEther("1") : ratio,
  };
};

export const useSynthInfos = derived(
  [ethsdk, resolvedTransactions, gqlsdk, totalTraderTransactions],
  ([$ethsdk, $pt, $gqlsdk, $totalTraderTransactions], set) => {
    $gqlsdk?.getSynths({}).then(async (res) => {
      console.log(res.synths);
      const synthInfos = await Promise.all(
        res.synths.map(async (p) => {
          if (!p.id) return Promise.resolve({} as SynthInfo);
          return {
            ...(await synthInfoAsync(p.id)),
            ticks: initializedTickAsync(p),
            token: await infosAndBalanceAsync(p.id),
          };
        })
      );
      set(synthInfos);
    });
  },
  [] as SynthInfo[]
);

export const initializedTickAsync = (
  pool: SynthFragmentFragment
): Record<number, number> => {
  let ticksMap = pool.ticks.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.index]: Number(formatEther(cur.liquidity || 0)),
    };
  }, {} as Record<number, number>);
  return ticksMap;
};
