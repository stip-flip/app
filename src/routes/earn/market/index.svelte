<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePoolInfos } from "src/hooks/uniswap/pool";
  import { useUniPositions } from "src/hooks/uniswap/position";
  import { commify, updateVc } from "src/lib";
  import Positions from "./_positions.svelte";
  import { navigate } from "src/lib/path";
  import { onMount } from "svelte";

  $: poolInfos = usePoolInfos;

  $: positionInfos = useUniPositions;

  $: positionExist = !!$positionInfos.length;

  $: url = new URL($page.url);

  onMount(updateVc);
</script>

{#if !positionExist}
  <div
    class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide lg:h-auto container-height"
    id="container"
    style="max-height: 60vh"
  >
    <div class="text-center lg:mt-0 mt-24 px-4">
      <Icon icon="octicon:inbox-24" class="text-5xl m-auto" />
      <p class="text-lg mt-4">
        Your active liquidity positions will appear here
      </p>
    </div>
  </div>
{:else}
  <div
    class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide lg:h-auto container-height"
    id="container"
    style="max-height: 60vh"
  >
    {#each $poolInfos as pool}
      <br class="odd:first:hidden lg:hidden mb-0" />
      {#if $positionInfos.some((p) => p.token0 + p.token1 == (pool.token0?.info?.address || "") + (pool.token1?.info?.address || ""))}
        <div class="lg:divider odd:first:hidden hidden mb-0"></div>
        <h1 class="lg:p-2 px-4 lg:py-4 flex justify-between">
          <strong class="flex space-x-2 items-center"
            ><CoinIcon symbol={pool?.synth?.info?.symbol || ""} /><span
              >{pool?.synth?.info?.name}</span
            ><span class="pr-2"> = </span>
            {commify(pool.price)}
            <span class="flex items-center">
              <span>ETC</span>
              <Icon
                class="inline text-2xl text-green-600"
                icon="mdi:ethereum"
              />
            </span>
          </strong>
        </h1>
        <Positions
          {pool}
          positions={$positionInfos.filter(
            (p) =>
              p.token0 + p.token1 ==
              (pool.token0?.info?.address || "") +
                (pool.token1?.info?.address || "")
          )}
        />
      {/if}
    {/each}
  </div>
{/if}
