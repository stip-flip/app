import type { PoolInfo } from "src/hooks/uniswap/pool";
import type { UniPositionInfo } from "src/hooks/uniswap/position";

export function reverseUniPosition(position: UniPositionInfo) {}

export function reversePool(pool: PoolInfo) {}

export function reverseRatio(
  ratio?: number,
  isReversed?: boolean
): typeof ratio {
  if (!ratio) return ratio;
  if (isReversed === false) return ratio;
  return 1 / ratio;
}
