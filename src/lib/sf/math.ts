import type { BigNumberish } from "ethers";
import { formatEther } from "ethers/lib/utils";

export function getShares(
  synthAmount: number,
  synthPrice: number,
  synthRatio: BigNumberish
): number {
  if (!synthPrice || !synthAmount || !synthRatio) return 0;
  if (typeof synthRatio === "object") {
    synthRatio = formatEther(synthRatio);
  }
  const shares = (synthAmount * synthPrice) / Number(synthRatio);

  return shares;
}

export function getSynthAmount(
  shares: number,
  synthPrice: number,
  synthRatio: BigNumberish
): number {
  if (!synthRatio || !shares || !synthRatio) return 0;
  // check if synthRatio is of type BigNumber
  if (typeof synthRatio === "object") {
    synthRatio = formatEther(synthRatio);
  }
  const synthAmount = (shares * Number(synthRatio)) / synthPrice;

  return synthAmount;
}

export function getPRFromVirtualPrice(
  synthAmount: number,
  virtualPrice: number,
  shares: number
): number {
  const virtualPR = (synthAmount * virtualPrice) / shares;
  console.log("virtualPR", virtualPR);
  return virtualPR;
}

export function translatePriceToPoolRatio(
  virtualPrice: number,
  synthPrice: number
): number {
  if (!synthPrice || !virtualPrice) return 0;
  const translatedPrice = virtualPrice / synthPrice;
  return translatedPrice;
}

/**
 * translate a uniswap pool ratio to a synthetic price
 * @param uniRatio the ratio shares/etc of the uniswap pool
 * @param synthPrice the current synthetic price in ETC
 * @param synthRatio the current ratio shares/etc of the synthetic
 * @param isReversed is the pool reversed
 * @returns
 */
export function uniRatioToSynthPrice(
  uniRatio: number,
  synthPrice: number,
  isReversed?: boolean
): number {
  let p = uniRatio * synthPrice;
  if (isReversed) {
    p = 1 / p;
  }
  return p;
}
