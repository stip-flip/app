import { derived, get, type Readable } from "svelte/store";
import { resolvedTransactions } from "../transactions";
import { chainId, signerAddress } from "svelte-ethers-store";
import { gqlsdk } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber, utils } from "ethers";
import { usePositionClaims } from "./positionClaims";

export type Position = {
  tick: number;
  activeTick: number;
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
  console.log(poolAddress, account, positionResults);
  const pool = sdk.POOL.attach(poolAddress);
  const slot1 = await pool.slot1();
  console.log("positionResults", poolAddress, positionResults.positions);
  // get all the positions pnl and value
  const [pnl, liquidities, positionInfos] = await Promise.all([
    Promise.all(
      positionResults.positions.map((p) =>
        // pool.positionPnL(p.tick, account).catch((_) => BigNumber.from(0))
        BigNumber.from(0)
      )
    ),
    Promise.all(
      positionResults.positions.map((p) => pool.positionValue(p.tick, account))
    ),
    Promise.all(
      positionResults.positions.map((p) => pool.position(p.tick, account))
    ),
  ]);

  const pnls = pnl.map((p, i) => {
    const l = liquidities[i];
    const pi = positionInfos[i];

    return l.sub(pi.shares.mul(pi.sharesRatio).div(1e9).div(1e9).div(1e9));
  });

  let positions = positionResults.positions.reduce((acc: any, cur, index) => {
    const byte = utils.solidityKeccak256(
      ["address", "int24"],
      [account, cur.tick]
    );
    if (liquidities[index].isZero()) return acc;
    return {
      ...acc,
      [byte]: {
        tick: cur.tick,
        activeTick: slot1.tick,
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
    get(gqlsdk)
      ?.getSynths({})
      .then(async (res) => {
        console.log("pools", res.synths);
        const poolAddresses = res.synths.map((p) => p.id);
        const positions = await Promise.all(
          poolAddresses.map((a) => positionsAsync(a, $signerAddress))
        );
        console.log(positions);
        set(positions);
      })
      .catch((error) => {
        console.warn("Unable to load position pools from subgraph", error);
        set([]);
      });
    // Promise.all(
    //   poolAddresses.map((a) => positionsAsync(a, account || $signerAddress))
    // ).then((res) => {
    //   set(res);
    // });
  },
  [] as Record<string, Position>[]
);

type PositionStats = {
  APY: number;
  pnl: BigNumber;
  totalActivated: BigNumber;
  totalDeposited: BigNumber;
};
export const usePositionsStats: Readable<PositionStats> = derived(
  [usePositions],
  ([$positions], set) => {
    let weightedActiveTick = 0;
    let activeLiquidityTotal = 0;

    const stats = Object.values($positions).reduce(
      (acc, cur) => {
        Object.values(cur).forEach((p) => {
          const activeLiquidity = p.liquidity.mul(
            (Number(p.liquidityActive) * 1e9).toFixed(0)
          );
          const activeLiquidityAmount = Number(formatUnits(activeLiquidity, 27));

          weightedActiveTick += activeLiquidityAmount * p.activeTick;
          activeLiquidityTotal += activeLiquidityAmount;

          acc.totalDeposited = acc.totalDeposited.add(p.liquidity);
          acc.totalActivated = acc.totalActivated.add(activeLiquidity);
          acc.pnl = acc.pnl.add(p.pnl);
        });
        return acc;
      },
      {
        APY: 0,
        pnl: BigNumber.from(0),
        totalActivated: BigNumber.from(0),
        totalDeposited: BigNumber.from(0),
      } as PositionStats
    );
    stats.APY = activeLiquidityTotal ? weightedActiveTick / activeLiquidityTotal : 0;
    set(stats);
  }
);
