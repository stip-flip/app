<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePoolInfos } from "src/hooks/uniswap/pool";
  import { useUniPositions } from "src/hooks/uniswap/position";
  import { commify } from "src/lib";
  import Positions from "./_positions.svelte";
  import { navigate } from "src/lib/path";

  $: poolInfos = usePoolInfos;

  $: positionInfos = useUniPositions;

  $: positionExist = !!$positionInfos.length;

  $: url = new URL($page.url);
</script>

<div class="flex flex-wrap justify-end lg:w-1/2 m-auto space-x-4">
  <a class="btn btn-primary" href={navigate("/earn/add", url)}>+ New Position</a
  >
</div>
{#if !positionExist}
  <div
    class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide"
    style="max-height: 60vh"
  >
    <div class="text-center">
      <Icon icon="octicon:inbox-24" class="text-5xl m-auto" />
      <p class="text-lg mt-4">
        Your active liquidity positions will appear here
      </p>
    </div>
  </div>
{:else}
  <div
    class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide"
    style="max-height: 60vh"
  >
    {#each $poolInfos as pool}
      {#if $positionInfos.some((p) => p.token0 + p.token1 == (pool.token0?.info?.address || "") + (pool.token1?.info?.address || ""))}
        <div class="divider odd:first:hidden mb-0"></div>
        <h1 class="p-2 py-4 flex justify-between">
          <strong class="flex space-x-2"
            ><CoinIcon symbol={pool?.synth?.info?.symbol || ""} /><span
              >{pool?.synth?.info?.name}</span
            ><span class=""> | </span>
            <span>
              ETC
              <Icon
                class="inline text-2xl text-green-600"
                icon="mdi:ethereum"
              />
            </span>
          </strong>
          <strong
            >Price: {commify(pool.price)}
            <Icon
              class="inline text-xl text-green-600"
              icon="mdi:ethereum"
            /></strong
          >
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
