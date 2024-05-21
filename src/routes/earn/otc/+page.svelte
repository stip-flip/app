<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePositions, usePositionsStats } from "src/hooks/sf/position";
  import { usePositionClaims } from "src/hooks/sf/positionClaims";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { commify } from "src/lib";
  import Claims from "./_claims.svelte";
  import Positions from "./_positions.svelte";
  // import {  } from "svelte/transition";

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

  $: console.log("positionExist", positionExist);
  $: console.log("positions", $positions);
  $: console.log("claims", $claims);
</script>

<div class="flex flex-wrap justify-around lg:w-1/2 m-auto space-x-4">
  <div class="join flex-grow">
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient flex-grow"
    >
      Total Deposit
    </div>
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient"
    >
      <CoinIcon symbol="ETC" />{commify(
        formatEther($positionsStats?.totalDeposited || "0")
      )}
    </div>
  </div>
  <div class="join flex-grow">
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient flex-grow"
    >
      APY
    </div>
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient"
    >
      {$positionsStats?.APY / 100}%
    </div>
  </div>
  <div class="join flex-grow">
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient flex-grow"
    >
      Profit & Loss
    </div>
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient"
    >
      <CoinIcon symbol="ETC" />{commify(
        formatEther($positionsStats?.pnl || "0")
      )}
    </div>
  </div>
  <a class="btn btn-primary flex-grow" href="/earn/otc/add">+ New Position</a>
</div>
<div
  class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide"
  style="max-height: 60vh"
>
  {#if !positionExist && !claimsExist}
    <div class="text-center">
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
        <h1 class="p-2 py-4 flex justify-between">
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
          <h1 class="p-2 pt-4">
            <strong>{pi?.token?.info?.name}</strong>
          </h1>
          <h2 class="p-2 py-4">Pending claims</h2>
        {:else}
          <h2 class="p-2 py-4">Pending claims</h2>
        {/if}
        <Claims claims={$claims?.[i]} poolName={pi?.token?.info?.name} />
      {/if}
    {/each}
  {/if}
</div>
