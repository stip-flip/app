import type { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { gqlsdk, timestamp10 } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get } from "svelte/store";
import { resolvedTransactions, totalTraderTransactions } from "./transactions";

export type PositionClaim = {
  id: string;
  amount: BigNumber; // the amount of the claim if we know it, 0 otherwise (in kind)
  burn: Boolean;
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
): Promise<PositionClaim[]> => {
  const gql = get(gqlsdk);
  const eth = get(ethsdk);
  if (!gql || !poolAddress || !account) return Promise.resolve([]);

  const pool = eth.POOL.attach(poolAddress);
  const [claimQuery, oracleAddress, slot] = await Promise.all([
    gql.getPositionClaims({
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
    claimQuery.positionClaims
      .map(async (c) => {
        const [initialized, frequency, roundDuration, lastRound, nextPrice] =
          await Promise.all([
            oracle.initialized(),
            oracle.frequency(),
            oracle.roundDuration(),
            oracle.getLastRound(),
            oracle.nextPrice(c.round, slot).catch((e) => parseEther("0")),
          ]);
        const claimable =
          !nextPrice.isZero() ||
          (lastRound.toNumber() < Number(c.round) + 1 && c.burn == true);

        console.log(
          initialized.toNumber(),
          (Number(c.round) + 1) * frequency,
          roundDuration
        );
        return {
          id: c.id,
          amount: c.amount,
          estimatedAmount: c.amount,
          claimable,
          automated: c.claimer?.toLowerCase() != account.toLowerCase(),
          canceled: lastRound.toNumber() > Number(c.round) + 1,
          owner: c.owner,
          pool: poolAddress,
          round: c.round,
          burn: c.burn,
          settlementTimestamp:
            lastRound.toNumber() <= Number(c.round)
              ? initialized.toNumber() +
                (Number(c.round) + 1) * frequency +
                roundDuration
              : 0,
        };
      })
      .filter((c) => !!c)
  );
};

export const usePositionClaims = derived(
  [
    chainId,
    signerAddress,
    resolvedTransactions,
    timestamp10,
    totalTraderTransactions,
  ],
  (
    [
      $chainId,
      $signerAddress,
      $resolvedTransactions,
      $timestamp10,
      $totalTraderTransactions,
    ],
    set
  ) => {
    get(gqlsdk)
      ?.getPools({})
      .then(async (res) => {
        const poolAddresses = res.pools.map((p) => p.id);
        let claims = await Promise.all(
          poolAddresses.map((a) => asyncClaims(a, $signerAddress))
        );
        claims = claims.map((c) => c.filter((c) => !(c.burn && c.canceled)));
        set(claims);
      });
  },
  [] as PositionClaim[][]
);
