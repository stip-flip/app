export function getAmount0Delta(
  price0: number,
  price1: number,
  liquidity: number,
  isSqrt?: boolean
): number {
  let sqrtRatio0;
  let sqrtRatio1;
  if (!isSqrt) {
    // transform the price0 and price1 to sqrtRatio0 and sqrtRatio1
    sqrtRatio0 = Math.sqrt(price0);
    sqrtRatio1 = Math.sqrt(price1);
  } else {
    sqrtRatio0 = price0;
    sqrtRatio1 = price1;
  }

  if (sqrtRatio0 > sqrtRatio1) {
    // [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    [sqrtRatio0, sqrtRatio1] = [sqrtRatio1, sqrtRatio0];
  }

  return (liquidity * (sqrtRatio1 - sqrtRatio0)) / sqrtRatio1 / sqrtRatio0;
}

export function getAmount1Delta(
  price0: number,
  price1: number,
  liquidity: number,
  isSqrt?: boolean
): number {
  let sqrtRatio0;
  let sqrtRatio1;
  if (!isSqrt) {
    // transform the price0 and price1 to sqrtRatio0 and sqrtRatio1
    sqrtRatio0 = Math.sqrt(price0);
    sqrtRatio1 = Math.sqrt(price1);
  } else {
    sqrtRatio0 = price0;
    sqrtRatio1 = price1;
  }

  if (sqrtRatio0 > sqrtRatio1) {
    // [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    [sqrtRatio0, sqrtRatio1] = [sqrtRatio1, sqrtRatio0];
  }

  return liquidity * (sqrtRatio1 - sqrtRatio0);
}

export function getAmountsDelta(
  price0: number,
  price1: number,
  currentPrice: number,
  liquidity: number,
  isSqrt?: boolean
): [number, number] {
  let amount0;
  let amount1;

  if (currentPrice <= price0) {
    amount0 = getAmount0Delta(price0, price1, liquidity, isSqrt);
    amount1 = 0;
  } else if (currentPrice < price1) {
    amount0 = getAmount0Delta(currentPrice, price1, liquidity, isSqrt);
    amount1 = getAmount1Delta(price0, currentPrice, liquidity, isSqrt);
  } else {
    amount0 = 0;
    amount1 = getAmount1Delta(price0, price1, liquidity, isSqrt);
  }
  return [amount0, amount1];
}

export function isInRange(
  currentTick: number,
  tickLower: number,
  tickUpper: number
): boolean {
  return currentTick >= tickLower && currentTick <= tickUpper;
}
