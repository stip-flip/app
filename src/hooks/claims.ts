import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { gqlsdk, timestamp10 } from "src/stores";
import { sdk as ethsdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get } from "svelte/store";
import { resolvedTransactions, totalTraderTransactions } from "./transactions";

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
      ?.getSynths({})
      .then(async (res) => {
        const synthAddresses = res.synths.map((p) => p.id);
        const claims = await Promise.all(
          synthAddresses.map((a) => asyncClaims(a, $signerAddress))
        );
        set(claims);
      });
  },
  [] as Claim[][]
);
