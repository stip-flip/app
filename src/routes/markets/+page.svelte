<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";
  import StatCard from "src/components/stat-card.svelte";
  import type { MarketSummaryFragmentFragment } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import {
    compact,
    compactEther,
    etherValue,
    formatDate,
    shortAddress,
    volumeTotal,
  } from "src/lib/stats";
  import { gqlsdk } from "src/stores";

  let markets: MarketSummaryFragmentFragment[] = [];
  let loading = true;
  let error = "";

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    loading = true;
    error = "";
    $gqlsdk
      ?.getMarketSummaries({ first: 1000 })
      .then((res) => {
        markets = [...res.synths].sort((a, b) => {
          const aSnapshot = a.latestSnapshots[0];
          const bSnapshot = b.latestSnapshots[0];
          const aScore = etherValue(aSnapshot?.totalLiquidity) + volumeTotal(aSnapshot);
          const bScore = etherValue(bSnapshot?.totalLiquidity) + volumeTotal(bSnapshot);
          return bScore - aScore;
        });
      })
      .catch((err) => {
        console.warn("Unable to load market summaries", err);
        error = "Unable to load indexed market data.";
      })
      .finally(() => {
        loading = false;
      });
  });

  onDestroy(unsubscribe);
  onMount(updateVc);

  $: totalLiquidity = markets.reduce(
    (sum, market) => sum + etherValue(market.latestSnapshots[0]?.totalLiquidity),
    0
  );
  $: totalVolume = markets.reduce(
    (sum, market) => sum + volumeTotal(market.latestSnapshots[0]),
    0
  );
</script>

<svelte:head>
  <title>Markets | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
      <div class="app-label">Protocol markets</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="text-3xl font-bold lg:text-5xl">Markets</h1>
          <p class="app-muted mt-2 max-w-2xl">
            Tokenized perpetual exposure ordered by current liquidity and indexed volume.
          </p>
        </div>
        <a class="btn btn-outline rounded-full" href="/oracles">
          <Icon icon="mdi:database-eye" />
          Oracle health
        </a>
      </div>
  </div>
</header>

<div class="lg:h-auto lg:pt-0 container-height" id="container">
  <div class="mx-auto max-w-7xl space-y-6 px-4 lg:px-0">
    <section class="grid gap-3 md:grid-cols-3">
      <StatCard label="Markets" value={String(markets.length)} detail="Synth contracts indexed" />
      <StatCard label="Liquidity" value={`${compactEther(totalLiquidity)} ETC`} detail="Latest indexed state" />
      <StatCard label="Volume" value={`${compact(totalVolume)} ETC`} detail="Latest aggregate snapshots" />
    </section>

    <section class="app-panel overflow-hidden rounded-lg">
      {#if loading}
        <div class="p-8 app-muted">Loading markets from the subgraph...</div>
      {:else if error}
        <div class="p-8 text-error">{error}</div>
      {:else if markets.length === 0}
        <div class="p-8 app-muted">No markets have been indexed yet.</div>
      {:else}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Market</th>
                <th>Side</th>
                <th>Liquidity</th>
                <th>Supply</th>
                <th>Volume</th>
                <th>Price</th>
                <th>Oracle</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {#each markets as market (market.id)}
                {@const snapshot = market.latestSnapshots[0]}
                <tr class="hover">
                  <td>
                    <a class="font-mono font-bold text-primary" href={`/markets/${market.id}`}>
                      {shortAddress(market.id)}
                    </a>
                  </td>
                  <td>{market.long ? "Long" : "Short"}</td>
                  <td>{compactEther(snapshot?.totalLiquidity)} ETC</td>
                  <td>{compactEther(snapshot?.totalSupply)}</td>
                  <td>{compact(volumeTotal(snapshot))} ETC</td>
                  <td>{compact(snapshot?.price)}</td>
                  <td>
                    <a class="font-mono text-primary" href={`/oracles/${market.oracle}`}>
                      {shortAddress(String(market.oracle))}
                    </a>
                  </td>
                  <td>{formatDate(snapshot?.timestamp)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  </div>
</div>
