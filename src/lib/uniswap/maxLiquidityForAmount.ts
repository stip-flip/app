// Computes the maximum amount of liquidity received for a given amount of token0
function maxLiquidityForAmount0(
  sqrtPrice0: number,
  sqrtPrice1: number,
  amount0: number
): number {
  if (sqrtPrice0 > sqrtPrice1) {
    [sqrtPrice0, sqrtPrice1] = [sqrtPrice1, sqrtPrice0];
  }
  return (amount0 * (sqrtPrice0 * sqrtPrice1)) / (sqrtPrice1 - sqrtPrice0);
}

// Computes the maximum amount of liquidity received for a given amount of token1
function maxLiquidityForAmount1(
  sqrtPrice0: number,
  sqrtPrice1: number,
  amount1: number
): number {
  if (sqrtPrice0 > sqrtPrice1) {
    [sqrtPrice0, sqrtPrice1] = [sqrtPrice1, sqrtPrice0];
  }

  return amount1 / (sqrtPrice1 - sqrtPrice0);
}

export function liquidityForAmount0(
  currentPrice: number,
  price0: number,
  price1: number,
  amount0: number
): number {
  if (!currentPrice || !price0 || !price1 || !amount0) return 0;
  // transform the price0 and price1 to sqrtRatio0 and sqrtRatio1
  let sqrtPrice0 = Math.sqrt(price0);
  let sqrtPrice1 = Math.sqrt(price1);

  let sqrtPrice = Math.sqrt(currentPrice);

  if (sqrtPrice0 > sqrtPrice1) {
    [sqrtPrice0, sqrtPrice1] = [sqrtPrice1, sqrtPrice0];
  }
  if (sqrtPrice <= sqrtPrice0) {
    return maxLiquidityForAmount0(sqrtPrice0, sqrtPrice1, amount0);
  } else if (sqrtPrice < sqrtPrice1) {
    return maxLiquidityForAmount0(sqrtPrice, sqrtPrice1, amount0);
  } else {
    return 0;
  }
}

export function liquidityForAmount1(
  currentPrice: number,
  price0: number,
  price1: number,
  amount1: number
): number {
  if (!currentPrice || !price0 || !price1 || !amount1) return 0;
  // transform the price0 and price1 to sqrtRatio0 and sqrtRatio1
  let sqrtPrice0 = Math.sqrt(price0);
  let sqrtPrice1 = Math.sqrt(price1);

  let sqrtPrice = Math.sqrt(currentPrice);

  if (sqrtPrice0 > sqrtPrice1) {
    [sqrtPrice0, sqrtPrice1] = [sqrtPrice1, sqrtPrice0];
  }
  if (sqrtPrice <= sqrtPrice0) {
    return 0;
  } else if (sqrtPrice < sqrtPrice1) {
    return maxLiquidityForAmount1(sqrtPrice0, sqrtPrice, amount1);
  } else {
    return maxLiquidityForAmount1(sqrtPrice0, sqrtPrice1, amount1);
  }
}

/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 */
export function maxLiquidityForAmounts(
  price: number,
  price0: number,
  price1: number,
  amount0: number,
  amount1: number
): number {
  console.log("mlfa", amount0, amount1);
  let sqrtPrice = Math.sqrt(price);
  let sqrtPrice0 = Math.sqrt(price0);
  let sqrtPrice1 = Math.sqrt(price1);

  if (sqrtPrice0 > sqrtPrice1) {
    [sqrtPrice0, sqrtPrice1] = [sqrtPrice1, sqrtPrice0];
  }

  if (amount0 == 0) amount0 = 1e18;
  if (amount1 == 0) amount1 = 1e18;

  if (sqrtPrice <= sqrtPrice0) {
    return maxLiquidityForAmount0(sqrtPrice0, sqrtPrice1, amount0);
  } else if (sqrtPrice < sqrtPrice1) {
    const liquidity0 = maxLiquidityForAmount0(sqrtPrice, sqrtPrice1, amount0);
    const liquidity1 = maxLiquidityForAmount1(sqrtPrice0, sqrtPrice, amount1);
    return liquidity0 < liquidity1 ? liquidity0 : liquidity1;
  } else {
    return maxLiquidityForAmount1(sqrtPrice0, sqrtPrice1, amount1);
  }
}
