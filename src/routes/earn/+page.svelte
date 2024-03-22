<script lang="ts">
  import Icon from "@iconify/svelte";
  import { usePoolInfos, usePositions } from "src/hooks/pool";
  import Positions from "./_positions.svelte";

  $: poolInfos = usePoolInfos;

  $: positions = usePositions;

  let positionExist: boolean = true;

  $: positionExist = $positions.reduce((acc: boolean, cur: any) => {
    return acc || !!Object.keys(cur).length;
  }, false);

  $: console.log("positionExist", positionExist);
  $: console.log("positions", $positions);
</script>

<div
  class="px-4 lg:px-8 lg:px-0 lg:w-1/2 m-auto mt-32 lg:mt-40 flex justify-between items-center"
>
  <h1 class="text-3xl">Pools</h1>
  <a class="btn float-right" href="earn/add">+ New Position</a>
</div>
<div
  class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 m-auto mt-4 overflow-scroll"
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
        <h1 class="p-2 py-4 flex justify-between mt-8">
          <strong>{pi?.token?.info?.name}</strong>
          <strong>Funding rate: {pi?.tick / 100} %</strong>
        </h1>
        <Positions
          positions={$positions?.[i]}
          bytes={Object.keys($positions?.[i])}
          poolAddress={pi.address}
          poolName={pi?.token?.info?.name || ""}
        />
      {/if}
    {/each}
  {/if}
</div>
