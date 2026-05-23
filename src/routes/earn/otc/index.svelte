<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePositions } from "src/hooks/sf/position";
  import { usePositionClaims } from "src/hooks/sf/positionClaims";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { updateVc } from "src/lib";
  import Claims from "./_claims.svelte";
  import Positions from "./_positions.svelte";
  import { onMount } from "svelte";

  const synthInfos = useSynthInfos;

  const positions = usePositions;

  const claims = usePositionClaims;

  let positionExist: boolean = true;

  $: positionExist = $positions.reduce((acc: boolean, cur: any) => {
    return acc || !!Object.keys(cur).length;
  }, false);

  $: claimsExist = $claims.reduce((acc: boolean, cur: any) => {
    return acc || !!cur.length;
  }, false);

  onMount(updateVc);
</script>

<div
  class="lg:h-auto lg:pt-0 container-height"
  id="container"
>
  <div class="mx-auto max-w-7xl px-4 lg:px-0">
    {#if !positionExist && !claimsExist}
      <section class="app-panel rounded-lg p-8">
        <div class="app-label">No protocol liquidity</div>
        <div class="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-2xl font-bold">Back canonical settlement</h2>
            <p class="app-muted mt-2 max-w-2xl">
              OTC liquidity provides the collateral depth used when positions are issued or redeemed through oracle rounds.
            </p>
          </div>
          <Icon icon="octicon:inbox-24" class="text-4xl text-primary" />
        </div>
      </section>
    {:else}
      <section class="app-panel overflow-hidden rounded-lg">
        <div class="border-b border-white/10 p-4">
          <div class="app-label">Protocol liquidity</div>
          <h2 class="mt-1 text-xl font-bold">Active positions and pending settlement</h2>
        </div>
        <div class="p-4">
          {#each $synthInfos as pi, i (pi.address)}
            {#if Object.keys($positions?.[i] || {}).length || $claims[i]?.length}
              <div class="border-b border-white/10 py-4 last:border-b-0 first:pt-0">
                <h1 class="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
                  <strong class="flex items-center gap-2">
                    <CoinIcon symbol={pi?.token?.info.symbol} />
                    <span>{pi?.token?.info?.name}</span>
                  </strong>
                  <span class="app-muted text-sm">
                    Funding rate: {pi?.tick / 100}%
                  </span>
                </h1>
                {#if Object.keys($positions?.[i] || {}).length}
                  <Positions
                    positions={$positions?.[i]}
                    bytes={Object.keys($positions?.[i])}
                    poolAddress={pi.address}
                    poolName={pi?.token?.info?.name || ""}
                  />
                {/if}
                {#if $claims[i]?.length}
                  <h2 class="mt-4 flex items-center gap-2 text-sm font-bold">
                    <Icon icon="gis:timer" class="text-xl text-primary" />
                    <span>Pending settlement</span>
                  </h2>
                  <Claims claims={$claims?.[i]} poolName={pi?.token?.info?.name} />
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </section>
    {/if}
  </div>
</div>
