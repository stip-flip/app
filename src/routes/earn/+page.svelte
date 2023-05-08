<script lang="ts">
  import Icon from "@iconify/svelte";
  import { usePoolInfos, usePositions } from "src/hooks/pool";
  import Positions from "./_positions.svelte";

  $: poolInfos = usePoolInfos();

  $: positions = usePositions;
  // $poolInfos.map((p) => p.address),
  // $signerAddress

  $: positionExist = $positions.reduce((acc: boolean, cur: any) => {
    return acc || Object.keys(cur).length;
  }, false);
  $: console.log($positions, $poolInfos);
</script>

<div class="w-1/2 m-auto mt-40 flex justify-between items-center">
  <h1 class="text-3xl">Pools</h1>
  <a class="btn float-right" href="earn/add">+ New Position</a>
</div>
<div
  class="border-2 rounded-lg p-4 bg-gradient bg-opacity-80 w-1/2 m-auto mt-4 overflow-scroll"
  style="max-height: 60vh"
>
  {#if !positionExist}
    <div class="text-center">
      <Icon icon="octicon:inbox-24" class="text-5xl m-auto" />
      <p class="text-lg mt-4">
        Your active liquidity positions will appear here
      </p>
    </div>
  {:else}
    {#each $poolInfos as pi, i}
      {#if Object.keys($positions?.[i] || {}).length}
        <h1 class="p-2 py-4 flex justify-between">
          <strong>{pi?.token?.info?.name}</strong>
          <strong>Funding rate: {pi?.slot0.tick / 1000} %</strong>
        </h1>
        <Positions
          positions={$positions?.[i]}
          bytes={Object.keys($positions?.[i])}
          poolAddress={pi.address}
        />
      {/if}
    {/each}
  {/if}
</div>
