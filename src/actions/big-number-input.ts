import { constants, type BigNumberish } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";

type ValidatorProps = {
  value: string;
  min?: number | string;
  max?: number | string;
  decimals?: number;
};

export const validator = (
  node: any,
  { value: v, min = 0, max, decimals = 18 }: ValidatorProps
) => {
  let previousValue = v;
  return {
    update({ value: v, min = 0, max, decimals = 18 }: ValidatorProps) {
      if (v == "") {
        previousValue = v;
        return;
      }

      let newValue: BigNumberish;
      let maxValue: BigNumberish;
      let minValue: BigNumberish;
      try {
        // console.log(decimals);
        // make sure v has less decimals places than the decimals prop
        v = String(Math.round(Number(v) * 10 ** decimals) / 10 ** decimals);
        newValue = parseUnits(v, decimals);
        maxValue = parseUnits(
          max ? String(max) : String(constants.MaxUint256),
          decimals
        );
        minValue = parseUnits(String(min) || "0", decimals);
        // console.log("newValue: ", newValue);
      } catch (e) {
        console.log("error: ", e);
        // input.target. = '';
        v = previousValue;
        v = "";
        node.dispatchEvent(
          new CustomEvent("validated", {
            detail: v,
          })
        );
        // don't update the input on invalid values
        return;
      }
      if (v.split(".")[1]?.length > decimals) {
        v = previousValue;
        node.dispatchEvent(
          new CustomEvent("validated", {
            detail: v,
          })
        );
        return;
      }
      if (newValue.lt(minValue) || newValue.gt(maxValue)) {
        v = previousValue;
        node.dispatchEvent(
          new CustomEvent("validated", {
            detail: v,
          })
        );
        return;
      }
      previousValue = v;
      node.dispatchEvent(
        new CustomEvent("validated", {
          detail: v,
        })
      );
    },
  };
};
