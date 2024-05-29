// Genearal Math functions, mixing liquidities and sqrtRatio libraries

import type { BigNumberish } from "ethers";
import { maxLiquidityForAmounts } from "./maxLiquidityForAmount";
import { getAmount0Delta, getAmount1Delta } from "./sqrtPriceMath";
import { formatEther } from "ethers/lib/utils";

/**
 * Function to calculate the amount0 of a pool given the ratio, low ratio, high ratio, and amount1
 * @param poolRatio The current ratio of the pool, (can be the price, sqrtPrice, or any other ratio as long as it's shared between all ratios)
 * @param lowRatio The lower ratio of the pool
 * @param highRatio The higher ratio of the pool
 * @param amount1 The amount of token1
 * @returns The amount of token0
 **/
export function computeAmount0(
  poolRatio: BigNumberish,
  lowRatio: number,
  highRatio: number,
  amount1: number
): number {
  if (typeof poolRatio === "object") {
    poolRatio = Number(formatEther(poolRatio));
  }
  console.log("poolRatio", poolRatio, amount1);
  const liquidity = maxLiquidityForAmounts(
    poolRatio as number,
    lowRatio,
    highRatio,
    0,
    amount1
  );

  console.log("liquidity", liquidity);

  if ((poolRatio as number) <= lowRatio) {
    return getAmount0Delta(lowRatio, highRatio, liquidity);
  } else if ((poolRatio as number) < highRatio) {
    return getAmount0Delta(poolRatio as number, highRatio, liquidity);
  } else {
    return 0;
  }
}

/**
 * Function to calculate the amount1 of a pool given the ratio, low ratio, high ratio, and amount0
 * @param poolRatio The current ratio of the pool, (can be the price, sqrtPrice, or any other ratio as long as it's shared between all ratios)
 * @param lowRatio The lower ratio of the pool
 * @param highRatio The higher ratio of the pool
 * @param amount0 The amount of token0
 * @returns The amount of token1
 */
export function computeAmount1(
  poolRatio: BigNumberish,
  lowRatio: number,
  highRatio: number,
  amount0: number
): number {
  if (typeof poolRatio === "object") {
    console.log("hoy");
    poolRatio = Number(formatEther(poolRatio));
  }
  const liquidity = maxLiquidityForAmounts(
    poolRatio as number,
    lowRatio,
    highRatio,
    amount0,
    0
  );
  console.log(poolRatio, lowRatio);
  if ((poolRatio as number) <= lowRatio) {
    console.log("hey");
    return 0;
  } else if ((poolRatio as number) < highRatio) {
    return getAmount1Delta(lowRatio, poolRatio as number, liquidity);
  } else {
    return getAmount1Delta(lowRatio, highRatio, liquidity);
  }
}
