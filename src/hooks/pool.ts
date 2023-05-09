import { ethers, utils, type BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { gqlsdk } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get, type Readable } from "svelte/store";
import { infosAndBalanceAsync, type TokenInfoAndBalance } from "./erc20";
import type { PoolFragmentFragment } from "./subgraph";

export type PoolInfo = {
  address: string;
  lastPrice: BigNumber;
  slot0: {
    fr: BigNumber;
    tick: number;
    feeProtocol: number;
    unlocked: boolean;
  };
  debt: BigNumber;
  collateral: string;
  fee: number;
  liquidityPerTick: BigNumber;
  totalLiquidities: BigNumber;
  traderLiquidities: BigNumber;
  ticks?: Record<number, number>;
  token?: TokenInfoAndBalance;
};

export const poolInfoAsync = async (
  address: string,
  account?: string
): Promise<PoolInfo> => {
  const sdk = get(ethsdk);
  const p = sdk.POOL.attach(address || ethers.constants.AddressZero);

  const [
    lastPrice,
    debt,
    collateral,
    slot0,
    fee,
    liquidityPerTick,
    totalLiquidities,
    traderLiquidities,
  ] = await Promise.all([
    p.lastPrice(),
    p.debt(account || get(signerAddress) || ethers.constants.AddressZero),
    p.collateral(),
    p.slot0(),
    p.fee(),
    p.liquidityPerTickX24(),
    p.totalLiquidities(),
    p.traderLiquidities(),
  ]);

  return {
    address,
    lastPrice,
    debt,
    collateral,
    slot0,
    fee,
    liquidityPerTick,
    totalLiquidities,
    traderLiquidities,
  };
};

export const usePoolInfos = (): Readable<PoolInfo[]> => {
  return derived(
    [ethsdk],
    ([$ethsdk], set) => {
      gqlsdk.getPools({}).then(async (res) => {
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
};

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

export const positionsAsync = async (poolAddress: string, account: string) => {
  const sdk = get(ethsdk);
  if (!sdk || !poolAddress || !account) return Promise.resolve([]);
  const positionResults = await gqlsdk.getPositions({
    where: { pool: poolAddress, owner: account },
  });
  const pool = sdk.POOL.attach(poolAddress);
  const slot0 = await pool.slot0();
  console.log(positionResults.positions);
  let positions = positionResults.positions.reduce((acc, cur) => {
    const byte = utils.solidityKeccak256(
      ["address", "int24", "int24"],
      [account, cur.tickLower, cur.tickUpper]
    );
    console.log(byte);
    return {
      ...acc,
      [byte]: {
        tickLower: cur.tickLower,
        tickUpper: cur.tickUpper,
        liquidity: cur.amount,
        liquidityActive: Math.max(
          0,
          Math.min(
            1,
            (slot0.fr.toNumber() - cur.tickLower * 1e9) /
              ((cur.tickUpper - cur.tickLower) * 1e9)
          )
        ),
        // pnl: await pool.getPositionPnL(cur.tickLower, cur.tickUpper, account),
      },
    };
  }, {} as Record<string, any>);
  return positions;
};

export const usePositions = derived(
  [chainId, signerAddress],
  ([$signer, $signerAddress], set) => {
    gqlsdk.getPools({}).then(async (res) => {
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
  [] as Record<string, any>
);
