<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePoolInfos, usePoolInfosLoading } from "src/hooks/uniswap/pool";
  import {
    useUniPositions,
    useUniPositionsLoading,
  } from "src/hooks/uniswap/position";
  import { commify, updateVc } from "src/lib";
  import { onMount } from "svelte";
  import Positions from "./_positions.svelte";

  const poolInfos = usePoolInfos;

  const positionInfos = useUniPositions;

  $: positionExist = !!$positionInfos.length;

  $: matchingPools = $poolInfos
    .map((pool) => ({
      pool,
      positions: $positionInfos.filter(
        (position) =>
          position.token0 + position.token1 ==
          (pool.token0?.info?.address || "") +
            (pool.token1?.info?.address || "")
      ),
    }))
    .filter(({ positions }) => positions.length);

  $: isLoading =
    $useUniPositionsLoading ||
    (positionExist && $usePoolInfosLoading && !matchingPools.length);

  onMount(updateVc);
</script>

{#if isLoading}
  <div
    class="lg:h-auto lg:pt-0 container-height"
    id="container"
  >
    <div class="mx-auto max-w-7xl px-4 lg:px-0">
      <section class="app-panel overflow-hidden rounded-lg">
        <div class="border-b border-white/10 p-4">
          <div class="app-label">Secondary liquidity</div>
          <h2 class="mt-1 text-xl font-bold">Loading market positions</h2>
        </div>
        <div class="space-y-4 p-4">
          {#each [0, 1, 2] as row (row)}
            <div class="rounded-lg border border-white/10 p-4">
              <div class="h-5 w-1/2 animate-pulse rounded bg-white/10"></div>
              <div class="mt-4 h-4 w-3/4 animate-pulse rounded bg-white/10"></div>
              <div class="mt-3 h-4 w-1/3 animate-pulse rounded bg-white/10"></div>
            </div>
          {/each}
        </div>
      </section>
    </div>
  </div>
{:else if !positionExist}
  <div
    class="lg:h-auto lg:pt-0 container-height"
    id="container"
  >
    <div class="mx-auto max-w-7xl px-4 lg:px-0">
      <section class="app-panel rounded-lg p-8">
        <div class="app-label">No secondary liquidity</div>
        <div class="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-2xl font-bold">Back position-token markets</h2>
            <p class="app-muted mt-2 max-w-2xl">
              Market liquidity makes issued exposure easier to trade without waiting for protocol settlement.
            </p>
          </div>
          <Icon icon="octicon:inbox-24" class="text-4xl text-primary" />
        </div>
      </section>
    </div>
  </div>
{:else}
  <div
    class="lg:h-auto lg:pt-0 container-height"
    id="container"
  >
    <div class="mx-auto max-w-7xl space-y-4 px-4 lg:px-0">
      <section class="app-panel overflow-hidden rounded-lg">
        <div class="border-b border-white/10 p-4">
          <div class="app-label">Secondary liquidity</div>
          <h2 class="mt-1 text-xl font-bold">Active market positions</h2>
        </div>
        <div class="p-4">
          {#each matchingPools as { pool, positions } (pool.address)}
            <div class="border-b border-white/10 py-4 last:border-b-0 first:pt-0">
              <h1 class="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
                <strong class="flex flex-wrap items-center gap-2">
                  <CoinIcon symbol={pool?.synth?.info?.symbol || ""} />
                  <span>{pool?.synth?.info?.name}</span>
                </strong>
                <span class="app-muted flex items-center gap-1 text-sm">
                  <span>{commify(pool.price)} ETC</span>
                  <Icon class="text-xl text-primary" icon="mdi:ethereum" />
                </span>
              </h1>
              <Positions {pool} {positions} />
            </div>
          {/each}
        </div>
      </section>
    </div>
  </div>
{/if}
