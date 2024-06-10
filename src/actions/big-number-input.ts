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
      if (!v) return;
      if (v == "") {
        previousValue = v;
        return;
      }
      console.log("update", v, max);
      let lastCharacterDot = v[v.length - 1] === "." || v[v.length - 1] === ",";
      let zeroAfterDot = Number(v.split(".")[1]) === 0 ? v.split(".")[1] : "";

      if (lastCharacterDot) {
        v = v.slice(0, -1) + ".0";
      }

      let newValue: BigNumberish;
      let maxValue: BigNumberish;
      let minValue: BigNumberish;
      try {
        // console.log(decimals);
        // make sure v has less decimals places than the decimals prop
        const split = v.split(".");
        if (split[1]?.length > decimals) {
          v = split[0] + "." + split[1].slice(0, decimals);
        }
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
        // v = "";
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

      v = lastCharacterDot ? v.slice(0, -1) : v;
      previousValue = v;
      node.dispatchEvent(
        new CustomEvent("validated", {
          detail: v,
        })
      );
    },
  };
};
