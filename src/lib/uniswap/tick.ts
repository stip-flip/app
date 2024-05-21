// Import the necessary libraries

// Define the tick spacing (this is 60 for most pools in Uniswap V3)
const TICK_SPACING = 60;

// Define the base for tick calculations (this is sqrt(1.0001))
const TICK_BASE = Math.sqrt(1.0001);

// Function to calculate the closest tick for a given square root price
export function getClosestTick(price: number): number {
  // calculate the square root of the price
  let sqrtPrice = Math.sqrt(price);
  // Calculate the raw tick
  let rawTick = Math.floor(Math.log(sqrtPrice) / Math.log(TICK_BASE));

  // Round the raw tick to the nearest valid tick
  let tick = Math.round(rawTick / TICK_SPACING) * TICK_SPACING;

  return tick;
}

// Function to calculate the root price that a tick translates to
export function getRatioForTick(tick: number): number {
  // Calculate the square root price
  let sqrtPrice = Math.pow(TICK_BASE, tick);

  // translate the square root price to the actual price
  let price = sqrtPrice * sqrtPrice;
  return price;
}

// Function to rectify to a price that is a multiple of the tick spacing
export function rectifyPrice(price: number): number {
  let tick = getClosestTick(price);
  let rectifiedPrice = getRatioForTick(tick);
  return rectifiedPrice;
}
