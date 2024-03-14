import { ethers, utils, BigNumber } from "ethers";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { gqlsdk, timestamp10 } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get } from "svelte/store";
import { resolvedTransactions } from "./blocknumber";
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

  const [currentPrice, oracleDecimals, slot0, slot1, slot2, fee] =
    await Promise.all([
      p.getPrice(),
      o.getDecimals(slot),
      p.slot0(),
      p.slot1(),
      p.slot2(),
      p.fee(),
      p.description(),
    ]);

  return {
    address,
    lastPrice: slot2.lastPrice,
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
  console.log("positionResults", poolAddress, positionResults.positions);
  // get all the positions pnl and value
  const [pnls, liquidities, positionInfos] = await Promise.all([
    Promise.all(
      positionResults.positions.map((p) => pool.positionPnL(p.tick, account))
    ),
    Promise.all(
      positionResults.positions.map((p) => pool.positionValue(p.tick, account))
    ),
    Promise.all(
      positionResults.positions.map((p) =>
        pool.positions(
          ethers.utils.solidityKeccak256(
            ["address", "int24"],
            [account, p.tick]
          )
        )
      )
    ),
  ]);

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
      ?.getPools({})
      .then(async (res) => {
        console.log("pools", res.pools);
        const poolAddresses = res.pools.map((p) => p.id);
        const positions = await Promise.all(
          poolAddresses.map((a) => positionsAsync(a, $signerAddress))
        );
        console.log(positions);
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

export type Claim = {
  id: string;
  amount: BigNumber; // the amount of the claim if we know it, 0 otherwise (in kind)
  estimatedAmount: BigNumber; // the estimated amount of the claim (in kind)
  exit: Boolean;
  claimable: Boolean;
  canceled: Boolean;
  owner: string;
  pool: string;
  round: number;
  automated: Boolean;
  settlementTimestamp: number; // the timestamp for the next settlement
};

const asyncClaims = async (
  poolAddress: string,
  account: string
): Promise<Claim[]> => {
  const gql = get(gqlsdk);
  const eth = get(ethsdk);
  if (!gql || !poolAddress || !account) return Promise.resolve([]);

  const pool = eth.POOL.attach(poolAddress);
  const [claimQuery, oracleAddress, slot] = await Promise.all([
    gql.getClaims({
      where: { pool: poolAddress, owner: account, claimed: false },
    }),
    pool.oracle(),
    pool.oracleSlot(),
  ]);
  // const claimQuery = await gql.getClaims({
  //   where: { pool: poolAddress, owner: account, claimed: false },
  // });
  // const oracleAddress = await pool.oracle();
  // const slot = await pool.oracleSlot();
  // extract the useful values from the Oracle
  const oracle = eth.ORACLE.attach(oracleAddress);
  console.log("claimQuery", claimQuery);
  return await Promise.all(
    claimQuery.claims.map(async (c) => {
      const [
        initialized,
        frequency,
        roundDuration,
        lastRound,
        currentPrice,
        lastPrice,
        nextPrice,
        sharesValue,
        oracleDecimals,
      ] = await Promise.all([
        oracle.initialized(),
        oracle.frequency(),
        oracle.roundDuration(),
        oracle.getLastRound(),
        oracle["lastPrice(uint8)"](slot),
        oracle["lastPrice(uint64,uint8)"](c.round, slot),
        oracle.nextPrice(c.round, slot).catch((e) => parseEther("0")),
        pool.sharesValueWithRebalance(c.amount),
        oracle.getDecimals(slot),
      ]);
      console.log(
        oracleDecimals,
        c.amount,
        lastRound.toNumber(),
        c.round,
        currentPrice.toString(),
        nextPrice.toString()
      );
      return {
        id: c.id,
        amount: c.exit
          ? c.amount
          : BigNumber.from(c.amount)
              .div(Math.pow(10, oracleDecimals))
              .mul(nextPrice),
        estimatedAmount: c.exit
          ? c.amount
          : BigNumber.from(c.amount)
              .mul(Math.pow(10, oracleDecimals))
              .div(nextPrice.isZero() ? lastPrice : nextPrice),
        claimable: !nextPrice.isZero(),
        automated: c.claimer.toLowerCase() != account.toLowerCase(),
        canceled: lastRound.toNumber() > Number(c.round) + 1,
        owner: c.owner,
        pool: poolAddress,
        round: c.round,
        exit: c.exit,
        settlementTimestamp:
          lastRound.toNumber() <= Number(c.round)
            ? initialized.toNumber() +
              (Number(c.round) + 1) * frequency +
              roundDuration
            : 0,
      };
    })
  );
};

export const useClaims = derived(
  [chainId, signerAddress, resolvedTransactions, timestamp10],
  ([$chainId, $signerAddress, $resolvedTransactions, $timestamp10], set) => {
    get(gqlsdk)
      ?.getPools({})
      .then(async (res) => {
        const poolAddresses = res.pools.map((p) => p.id);
        const claims = await Promise.all(
          poolAddresses.map((a) => asyncClaims(a, $signerAddress))
        );
        set(claims);
      });
  },
  [] as Claim[][]
);
