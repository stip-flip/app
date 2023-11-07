<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatUnits, parseUnits } from "ethers/lib/utils";
  import { usdcInfo } from "src/hooks/erc20";
  import { commify, formatAmount } from "src/lib";
  import { sdk } from "src/stores";
  import { validator } from "src/actions/big-number-input";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { broadcastTransaction } from "src/hooks/blocknumber";
  import type { BigNumberish } from "ethers";

  export let token: string = "";
  export let balance: BigNumberish = "0";
  export let leverage: BigNumberish;
  export let liquidationPrice: BigNumberish;
  export let pnl: BigNumberish;
  export let fr: BigNumberish;

  $: details = token.includes("steep")
    ? "This token represent the long side of " + token.split("steep-")[0]
    : "This token represent the short side of " + token.split("flip-")[0];
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={token} class="modal-toggle" />
<label for={token} class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-2xl text-center pb-4">{token} details</h3>
    <p>{details}</p>
    <div class="border-b" />
  </label>
</label>

<tr class="hover cursor-pointer">
  <td>
    <strong>{token}</strong>
  </td>
  <td>
    {commify(balance, 2)}
  </td>
  <td>
    {commify(leverage, 2)}
  </td>
  <td>{commify(formatUnits(liquidationPrice || "0", 8))}</td>
  <!-- <td>
          {commify(
            formatUnits(
              exitPreviews?.[i]?.pnl_ || "0",
              $collateralInfo.decimals
            ),
            2
          )}
          {$collateralInfo.name || "USDN"}
        </td>
        <td>
          {commify(formatUnits(t?.slot0?.fr || "0", 18 + 3), 2)} %
        </td> -->
</tr>
