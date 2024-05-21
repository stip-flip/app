import type { BigNumber, BigNumberish } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";

export function getShares(
  synthAmount: number,
  price: number,
  synthRatio: BigNumberish
): number {
  if (!price || !synthAmount || !synthRatio) return 0;
  if (typeof synthRatio === "object") {
    synthRatio = formatEther(synthRatio);
  }
  const shares = (synthAmount * price) / Number(synthRatio);

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

// take the price synth/ETC and translate it to the price shares/ETC `shares = ETC / PoolRatio`
export function translatePrice(
  poolRatio: BigNumber,
  price: number,
  virtualPrice: number
): number {
  if (!price || !virtualPrice || !poolRatio) return 0;
  const translatedPrice =
    (Number(formatEther(poolRatio)) * virtualPrice) / price;
  return translatedPrice;
}

export function uniRatioToSynthPrice(
  uniRatio: number,
  synthPrice: number,
  synthRatio: number
): number {
  return (synthPrice * uniRatio) / synthRatio;
}
