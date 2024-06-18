import { BigNumber, ethers } from "ethers";
import type { TokenInfoAndBalance } from "../erc20";
import { get } from "svelte/store";
import { sdk as ethsdk } from "src/stores";
import type { MordorSdk } from "eth-sdk/build";
import type { SynthInfo } from "./synth";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { reverse } from "lodash";
import Decimal from "decimal.js";

const ZERO_ADDRESS = "0x0";
const WETC9 = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a";

const ERRORS = {
  liquidities: `Not enough liquidities in the Uniswap pool`,
  void: "This uniswap pool does not exist, <a class='font-bold underline' href='/earn/add?mode=market'>create it</a> first",
};
// as synth token0 is expected to be the synth token, token1 is the base token (ETC)
// we fist check if the ratio asked is reversed
// we then check if the unipool ratio is reversed
// if both are reversed, or both are not reversed, it's aligned, otherwise it's not
function isAligned(token0: string, token1: string): boolean {
  console.log("isReversed", token0, token1);
  const isPathReversed = token1 != WETC9;
  const isPoolReversed = isPathReversed && token0 < token1;
  return isPathReversed == isPoolReversed;
}

export async function swapOut(
  sdk: MordorSdk,
  amountOut: string,
  path: string,
  steps: string[][],
  synth0?: SynthInfo,
  synth1?: SynthInfo,
  selectedToken0?: TokenInfoAndBalance,
  selectedToken1?: TokenInfoAndBalance
): Promise<{ error: string; price: number; amountIn: string }> {
  console.log(amountOut);
  let error: string = "";
  let price: number = 0;
  let amountIn: string = "";
  if (!selectedToken0 || !selectedToken1) return { error, price, amountIn };
  const synth0Price = Number(
    formatUnits(synth0?.currentPrice || 0, synth0?.oracleDecimals)
  );
  const synth0Ratio = Number(formatUnits(synth0?.ratio || 0, 18));
  const synth1Price = Number(
    formatUnits(synth1?.currentPrice || 0, synth1?.oracleDecimals)
  );
  const synth1Ratio = Number(formatUnits(synth1?.ratio || 0, 18));

  let amount = Number(!amountOut || amountOut == "0" ? "0.000001" : amountOut);
  if (synth0 && amountOut != "0") {
    amount = (amount * synth0Price) / synth0Ratio;
  }

  console.log(
    "amount",
    amount,
    amountOut,
    synth0Price,
    new Decimal(String(amount)),
    new Decimal(String(amount)).toFixed(18)
  );

  try {
    const res = await sdk.QUOTER.callStatic.quoteExactInput(
      path,
      parseUnits(
        new Decimal(String(amount)).toFixed(),
        selectedToken0.info.decimals
      )
    );
    console.log("ok");
    let p = BigNumber.from(1e4);
    for (let i = 0; i < res.sqrtPriceX96AfterList.length; i++) {
      p = p.mul(res.sqrtPriceX96AfterList[i].mul(1e6).shr(96).pow(2)).div(1e12);
      p = isAligned(steps[i][0], steps[i][1]) ? p : BigNumber.from(1e8).div(p);
    }
    console.log(
      "path",
      p.toString(),
      p.mul(res.sqrtPriceX96AfterList[0].mul(1e6).shr(96).pow(2)).div(1e12)
    );
    amountIn =
      amountOut == "0"
        ? "0"
        : formatUnits(res.amountOut, selectedToken1.info.decimals);
    if (synth1) {
      amountIn = ((Number(amountIn) * synth1Ratio) / synth1Price).toString();
    }
    price = p.toNumber() / 1e4;
    if (synth0) {
      price = (price * synth0Price) / synth0Ratio;
    }
    if (synth1) {
      price = (price * synth1Ratio) / synth1Price;
    }
    error = "";
  } catch (err: any) {
    console.log(err, err.message);
    if (err.message.includes("TF")) {
      error = ERRORS.liquidities;
    } else if (err.message.includes("AS")) {
      // do nothing
      error = "";
    } else {
      error = ERRORS.void;
    }
  }
  return { error, price, amountIn };
}

export async function swapIn(
  sdk: MordorSdk,
  amountIn: string,
  reversePath: string,
  reverseSteps: string[][],
  synth0?: SynthInfo,
  synth1?: SynthInfo,
  selectedToken0?: TokenInfoAndBalance,
  selectedToken1?: TokenInfoAndBalance
): Promise<{ error: string; price: number; amountOut: string }> {
  let error: string = "";
  let price: number = 0;
  let amountOut: string = "";

  if (!selectedToken0 || !selectedToken1) return { error, price, amountOut };
  const synth0Price = Number(
    formatUnits(synth0?.currentPrice || 0, synth0?.oracleDecimals)
  );
  const synth0Ratio = Number(formatUnits(synth0?.ratio || 0, 18));
  const synth1Price = Number(
    formatUnits(synth1?.currentPrice || 0, synth1?.oracleDecimals)
  );
  const synth1Ratio = Number(formatUnits(synth1?.ratio || 0, 18));

  let amount = Number(amountIn == "0" ? "0.000001" : amountIn);

  if (synth1 && amountIn != "0") {
    amount = (amount * synth1Price) / synth1Ratio;
  }

  try {
    const res = await sdk.QUOTER.callStatic.quoteExactOutput(
      reversePath,
      amount
    );
    let p = BigNumber.from(1e4);
    for (let i = 0; i < res.sqrtPriceX96AfterList.length; i++) {
      p = p.mul(res.sqrtPriceX96AfterList[i].mul(1e6).shr(96).pow(2)).div(1e12);
      p = isAligned(reverseSteps[i][0], reverseSteps[i][1])
        ? p
        : BigNumber.from(1e8).div(p);
    }

    amountOut =
      amountIn == "0"
        ? "0"
        : formatUnits(res.amountIn, selectedToken0.info.decimals);

    if (synth0) {
      amountOut = ((Number(amountOut) * synth0Ratio) / synth0Price).toString();
    }
    price = p.toNumber() / 1e4;

    if (synth0) {
      price = (price * synth0Ratio) / synth0Price;
    }
    if (synth1) {
      price = (price * synth1Price) / synth1Ratio;
    }

    error = "";
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("TF")) {
      error = ERRORS.liquidities;
    } else if (err.message.includes("AS")) {
      // do nothing
      error = "";
    } else {
      error = ERRORS.void;
    }
  }

  return { error, price, amountOut };
}

// construct the path used by QuoterV2 to come up with the quote
export function buildPath(
  selectedToken0?: TokenInfoAndBalance,
  selectedToken1?: TokenInfoAndBalance
): [string, string, string[][], string[][]] {
  let path = "";
  let steps: string[][] = [];
  let reversePath = "";
  let reverseSteps: string[][] = [];
  const sdk = get(ethsdk);
  if (!selectedToken0 || !selectedToken1) path = "";
  else if (selectedToken0.info.address == ZERO_ADDRESS) {
    path = ethers.utils.solidityPack(
      ["address", "uint24", "address"],
      [sdk.WETC9.address, 3000, selectedToken1.info.address]
    );
    steps = [[sdk.WETC9.address, selectedToken1.info.address]];
    reversePath = ethers.utils.solidityPack(
      ["address", "uint24", "address"],
      [selectedToken1.info.address, 3000, sdk.WETC9.address]
    );
    reverseSteps = [[selectedToken1.info.address, sdk.WETC9.address]];
  } else if (selectedToken1.info.address == ZERO_ADDRESS) {
    path = ethers.utils.solidityPack(
      ["address", "uint24", "address"],
      [selectedToken0.info.address, 3000, sdk.WETC9.address]
    );
    steps = [[selectedToken0.info.address, sdk.WETC9.address]];
    reversePath = ethers.utils.solidityPack(
      ["address", "uint24", "address"],
      [sdk.WETC9.address, 3000, selectedToken0.info.address]
    );
    reverseSteps = [[sdk.WETC9.address, selectedToken0.info.address]];
  } else {
    path = ethers.utils.solidityPack(
      ["address", "uint24", "address", "uint24", "address"],
      [
        selectedToken0.info.address,
        3000,
        sdk.WETC9.address,
        3000,
        selectedToken1.info.address,
      ]
    );
    steps = [
      [selectedToken0.info.address, sdk.WETC9.address],
      [sdk.WETC9.address, selectedToken1.info.address],
    ];
    reversePath = ethers.utils.solidityPack(
      ["address", "uint24", "address", "uint24", "address"],
      [
        selectedToken1.info.address,
        3000,
        sdk.WETC9.address,
        3000,
        selectedToken0.info.address,
      ]
    );
    reverseSteps = [
      [selectedToken1.info.address, sdk.WETC9.address],
      [sdk.WETC9.address, selectedToken0.info.address],
    ];
  }
  return [path, reversePath, steps, reverseSteps];
}
