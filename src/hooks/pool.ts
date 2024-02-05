import { ethers, utils, type BigNumber } from "ethers";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { gqlsdk } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get, type Readable } from "svelte/store";
import { pendingTransactions, resolvedTransactions } from "./blocknumber";
import { infosAndBalanceAsync, type TokenInfoAndBalance } from "./erc20";
import type { PoolFragmentFragment } from "./subgraph";

export type PoolInfo = {
  address: string;
  lastPrice: BigNumber;
  oracleDecimals: number;
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

  const [currentPrice, oracleDecimals, slot0, slot1, slot2, fee] =
    await Promise.all([
      p.getPrice(),
      p.oracleDecimals(),
      p.slot0(),
      p.slot1(),
      p.slot2(),
      p.fee(),
    ]);

  return {
    address,
    lastPrice: slot2.lastPrice,
    oracleDecimals: oracleDecimals,
    currentPrice: currentPrice,
    tick: slot1.tick,
    feeProtocol: 0,
    fee,
    totalLiquidities: slot0.totalLiquidities,
  };
};

export const usePoolInfos = derived(
  [ethsdk, resolvedTransactions, gqlsdk],
  ([$ethsdk, $pt, $gqlsdk], set) => {
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
export type Position = {
  tick: number;
  liquidity: BigNumber;
  pnl: BigNumber;
  shares: BigNumber;
  liquidityActive: number;
};

export const positionsAsync = async (poolAddress: string, account: string) => {
  const sdk = get(ethsdk);
  if (!sdk || !poolAddress || !account) return Promise.resolve([]);
  const positionResults = await get(gqlsdk).getPositions({
    where: { pool: poolAddress, owner: account },
  });
  const pool = sdk.POOL.attach(poolAddress);
  const slot1 = await pool.slot1();
  console.log(positionResults.positions);
  // get all the positions pnl and value
  const [pnls, liquidities, positionInfos] = await Promise.all([
    Promise.all(
      positionResults.positions.map((p) => pool.positionPnL(p.tick, account))
    ),
    Promise.all(
      positionResults.positions.map((p) => pool.positionValue(p.tick, account))
    ),
    Promise.all(
      positionResults.positions.map((p) => pool.position(p.tick, account))
    ),
  ]);
  let positions = positionResults.positions.reduce((acc: any, cur, index) => {
    const byte = utils.solidityKeccak256(
      ["address", "int24"],
      [account, cur.tick]
    );
    if (liquidities[index].isZero()) return acc;
    // console.log(byte);
    return {
      ...acc,
      [byte]: {
        tick: cur.tick,
        liquidity: liquidities[index],
        pnl: pnls[index],
        shares: positionInfos[index].shares,
        liquidityActive:
          cur.tick > slot1.tick
            ? 0
            : cur.tick < slot1.tick
            ? 1
            : formatUnits(slot1.tickRatio, 27),
      },
    };
  }, {} as Record<string, Position>);
  return positions;
};

export const usePositions = derived(
  [chainId, signerAddress, resolvedTransactions],
  ([$signer, $signerAddress, $resolvedTransactions], set) => {
    console.log("ohoh");
    get(gqlsdk)
      ?.getPools({})
      .then(async (res) => {
        console.log(res.pools);
        const poolAddresses = res.pools.map((p) => p.id);
        const positions = await Promise.all(
          poolAddresses.map((a) => positionsAsync(a, $signerAddress))
        );
        set(positions);
      });
    // Promise.all(
    //   poolAddresses.map((a) => positionsAsync(a, account || $signerAddress))
    // ).then((res) => {
    //   set(res);
    // });
  },
  [] as Record<string, Position>[]
);
