<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePositions, usePositionsStats } from "src/hooks/sf/position";
  import { usePositionClaims } from "src/hooks/sf/positionClaims";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { commify, updateVc } from "src/lib";
  import Claims from "./_claims.svelte";
  import Positions from "./_positions.svelte";
  import { navigate } from "src/lib/path";
  import { onMount } from "svelte";

  $: synthInfos = useSynthInfos;

  $: positions = usePositions;

  $: positionsStats = usePositionsStats;

  $: claims = usePositionClaims;

  let positionExist: boolean = true;

  $: positionExist = $positions.reduce((acc: boolean, cur: any) => {
    return acc || !!Object.keys(cur).length;
  }, false);

  $: claimsExist = $claims.reduce((acc: boolean, cur: any) => {
    return acc || !!cur.length;
  }, false);

  $: url = new URL($page.url);

  onMount(updateVc);
</script>

<div
  class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 m-auto overflow-scroll scrollbar-hide lg:h-auto container-height"
  id="container"
>
  {#if !positionExist && !claimsExist}
    <div class="text-center lg:mt-0 px-4">
      <Icon icon="octicon:inbox-24" class="text-5xl m-auto" />
      <p class="text-lg mt-4">
        Your active liquidity positions will appear here
      </p>
    </div>
  {:else}
    {#each $synthInfos as pi, i}
      <!-- <h1 class="p-2 py-4 flex mt-8 items-center space-x-2">
        <CoinIcon symbol={pi?.token?.info?.symbol} />
        <strong>{pi?.token?.info?.name}</strong>
      </h1> -->
      {#if Object.keys($positions?.[i] || {}).length}
        <div class="divider odd:first:hidden mb-0"></div>
        <h1 class="p-2 lg:py-4 flex justify-between">
          <strong class="flex space-x-2"
            ><CoinIcon symbol={pi?.token?.info.symbol} /><span
              >{pi?.token?.info?.name}</span
            ></strong
          >
          <strong>Funding rate: {pi?.tick / 100} %</strong>
        </h1>
        <Positions
          positions={$positions?.[i]}
          bytes={Object.keys($positions?.[i])}
          poolAddress={pi.address}
          poolName={pi?.token?.info?.name || ""}
        />
      {/if}
      {#if $claims[i]?.length}
        {#if !Object.keys($positions?.[i] || {}).length}
          <div class="divider odd:first:hidden mb-0"></div>
          <strong class="flex space-x-2"
            ><CoinIcon symbol={pi?.token?.info.symbol} /><span
              >{pi?.token?.info?.name}</span
            ></strong
          >
          <h2 class="p-2 py-4 flex space-x-2">
            <Icon icon="gis:timer" class="text-2xl" /><strong
              >Pending claims</strong
            >
          </h2>
        {:else}
          <h2 class="p-2 py-4 flex space-x-2">
            <Icon icon="gis:timer" class="text-2xl" /><strong
              >Pending claims</strong
            >
          </h2>
        {/if}
        <Claims claims={$claims?.[i]} poolName={pi?.token?.info?.name} />
      {/if}
    {/each}
  {/if}
</div>
