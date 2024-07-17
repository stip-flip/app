<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { BigNumberish } from "ethers";
  import { formatUnits } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import type { TokenInfo } from "src/hooks/erc20";
  import { addToken, commify } from "src/lib";

  export let token: TokenInfo | undefined;
  export let balance: BigNumberish = "0";
  export let pnl: BigNumberish;
  export let tick: BigNumberish;

  let input: HTMLInputElement;

  $: details = token?.name.toLowerCase().includes("stip")
    ? "This token represent the long side of " + token?.name.split("Stip-")[1]
    : "This token represent the short side of " + token?.name.split("Flip-")[1];
</script>

<!-- Put this part before </body> tag -->
<input
  type="checkbox"
  bind:this={input}
  id={token?.address}
  class="modal-toggle"
/>
<label for={token?.address} class="modal cursor-pointer">
  <label class="modal-box relative bg-gradient" for="">
    <h3 class="text-2xl text-center pb-4">{token?.name}</h3>
    <p class="text-center text-sm">{details}</p>
    <div class="border-b m-4" />
    <!-- <div class="flex py-2 p-4">
      <strong class="w-1/3">Leverage: </strong>
      <p>{Number(leverage) == 0 ? "--" : commify(leverage, 2)}</p>
    </div> -->
    <!-- <div class="flex py-2 p-4">
      <strong class="w-1/3">Liquidation Price: </strong>
      <p>
        {Number(liquidationPrice) == 0
          ? "--"
          : commify(formatUnits(liquidationPrice || "0", 8))}
      </p>
    </div> -->
    <div class="flex py-2 p-4">
      <strong class="w-1/3">Profit & Loss: </strong>
      <p>
        {commify(formatUnits(pnl | 0, 18))}
        <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
      </p>
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

<tr class="hover cursor-pointer" on:click={(_) => input.click()}>
  <td class="flex items-center space-x-2">
    <CoinIcon symbol={token?.symbol} />
    <strong>{token?.name}</strong>
  </td>
  <td>
    {commify(balance, 4)}
  </td>
  <td class="text-right">
    {Number(commify(formatUnits(tick || 0, 2)))} %
  </td>
  <!-- <td
    ></td
  > -->
  <!-- <td>
    <label for={token?.address}>
      <Icon icon="pepicons-pencil:dots-y" class="cursor-pointer w-6 h-6" />
    </label>
  </td> -->
</tr>
