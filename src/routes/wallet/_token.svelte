<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { BigNumberish } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import type { TokenInfo } from "src/hooks/erc20";
  import { addToken, commify } from "src/lib";

  export let token: TokenInfo;
  export let balance: BigNumberish = "0";
  export let leverage: BigNumberish;
  export let liquidationPrice: BigNumberish;
  export let pnl: BigNumberish;
  export let tick: BigNumberish;

  $: details = token?.name.includes("stip")
    ? "This token represent the long side of " + token?.name.split("stip-")[1]
    : "This token represent the short side of " + token?.name.split("flip-")[1];
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={token?.address} class="modal-toggle" />
<label for={token?.address} class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-2xl text-center pb-4">{token?.name}</h3>
    <p class="text-center text-sm">{details}</p>
    <div class="border-b m-4" />
    <div class="flex py-2 p-4">
      <strong class="w-1/3">Leverage: </strong>
      <p>{Number(leverage) == 0 ? "--" : commify(leverage, 2)}</p>
    </div>
    <div class="flex py-2 p-4">
      <strong class="w-1/3">Liquidation Price: </strong>
      <p>
        {Number(liquidationPrice) == 0
          ? "--"
          : commify(formatUnits(liquidationPrice || "0", 8))}
      </p>
    </div>
    <div class="flex py-2 p-4">
      <strong class="w-1/3">Profit & Loss: </strong>
      <p>{commify(formatUnits(pnl, 18))} USDC</p>
    </div>
    <div class="p-4 text-right">
      <a
        on:click={(_) =>
          addToken(token?.address, token?.symbol, token?.decimals)}
        class="underline text-primary cursor-pointer">Add to Wallet</a
      >
    </div>
  </label>
</label>

<tr class="hover cursor-pointer">
  <td>
    <strong>{token?.name}</strong>
  </td>
  <td>
    {commify(balance, 4)}
  </td>
  <td>
    {Number(commify(formatUnits(tick, 2)))} %
  </td>
  <!-- <td
    ></td
  > -->
  <td>
    <label for={token?.address}>
      <Icon icon="pepicons-pencil:dots-y" class="cursor-pointer w-6 h-6" />
    </label>
  </td>
</tr>
