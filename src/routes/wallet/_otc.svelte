<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther, formatUnits } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import type { TokenInfo } from "src/hooks/erc20";
  import type { Claim } from "src/hooks/synth";
  import { commify, getTimeDifference } from "src/lib";
  import { timestamp } from "src/stores";

  export let token: TokenInfo | undefined = undefined;
  export let claim: Claim | undefined = undefined;

  $: timeleft = getTimeDifference(claim?.settlementTimestamp || 0, $timestamp);
</script>

<tr class="hover cursor-pointer">
  <td>
    <strong class="flex space-x-2"
      >{#if claim?.exit}
        <CoinIcon symbol={"ETC"} /><span>Ether Classic</span>
      {:else}
        <CoinIcon symbol={token?.symbol} /><span>{token?.name}</span
        >{/if}</strong
    >
  </td>
  <td class="text-left">
    {commify(formatEther(claim?.estimatedAmount || 0), 4)}
  </td>
  <td class="text-left">
    {claim?.automated ? "Yes" : "No"}
  </td>
  <td class="text-right px-8">
    {#if claim?.canceled}
      <span class="text-warning">Canceled</span>
    {:else if claim?.claimable}
      <span class="text-green-600">Settled</span>
    {:else if (claim?.settlementTimestamp || 0) < $timestamp}
      <span class="text-info-600">Awaiting Next Price</span>
    {:else}
      <span>{timeleft}</span>
    {/if}
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
