<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther, formatUnits } from "ethers/lib/utils";
  import type { TokenInfo } from "src/hooks/erc20";
  import type { Claim } from "src/hooks/pool";
  import { commify } from "src/lib";
  import { timestamp } from "src/stores";

  export let token: TokenInfo | undefined = undefined;
  export let claim: Claim | undefined = undefined;

  function getTimeDifference(settlement: number, givenTime: number) {
    let differenceInSeconds = Math.abs(settlement - givenTime);
    // console.log(now, givenTime, differenceInSeconds);
    const hours = Math.floor(differenceInSeconds / 3600);
    differenceInSeconds %= 3600;
    const minutes = Math.floor(differenceInSeconds / 60);
    const seconds = Math.floor(differenceInSeconds % 60);

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  $: timeleft = getTimeDifference(claim?.settlementTimestamp || 0, $timestamp);
</script>

<tr class="hover cursor-pointer">
  <td>
    <strong>{claim?.exit ? "Ether Classic" : token?.name}</strong>
  </td>
  <td class="text-left">
    {commify(formatEther(claim?.estimatedAmount || 0), 4)}
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
