// Genearal Math functions, mixing liquidities and sqrtRatio libraries

import { maxLiquidityForAmounts } from "./maxLiquidityForAmount";
import { getAmount0Delta, getAmount1Delta } from "./sqrtPriceMath";

/**
 * Function to calculate the amount0 of a pool given the ratio, low ratio, high ratio, and amount1
 * @param poolRatio The current ratio of the pool, (can be the price, sqrtPrice, or any other ratio as long as it's shared between all ratios)
 * @param lowRatio The lower ratio of the pool
 * @param highRatio The higher ratio of the pool
 * @param amount1 The amount of token1
 * @returns The amount of token0
 **/
export function computeAmount0(
  poolRatio: number,
  lowRatio: number,
  highRatio: number,
  amount1: number
): number {
  const liquidity = maxLiquidityForAmounts(
    poolRatio,
    lowRatio,
    highRatio,
    0,
    amount1
  );

  if (poolRatio <= lowRatio) {
    return getAmount0Delta(lowRatio, highRatio, liquidity);
  } else if (poolRatio < highRatio) {
    return getAmount0Delta(poolRatio, highRatio, liquidity);
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
  poolRatio: number,
  lowRatio: number,
  highRatio: number,
  amount0: number
): number {
  const liquidity = maxLiquidityForAmounts(
    poolRatio,
    lowRatio,
    highRatio,
    amount0,
    0
  );

  if (poolRatio <= lowRatio) {
    return 0;
  } else if (poolRatio < highRatio) {
    return getAmount1Delta(lowRatio, poolRatio, liquidity);
  } else {
    return getAmount1Delta(lowRatio, highRatio, liquidity);
  }
}
