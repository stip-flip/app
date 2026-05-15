<script lang="ts">
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
  import Sparkline from "src/components/sparkline.svelte";
  import StatCard from "src/components/stat-card.svelte";
  import type { GetMarketDetailQuery, OracleSummaryFragmentFragment } from "src/hooks/subgraph";
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

  let market: GetMarketDetailQuery["synth"] = null;
  let oracle: OracleSummaryFragmentFragment | null = null;
  let loading = true;
  let error = "";

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    const id = $page.params.id;
    loading = true;
    error = "";
    $gqlsdk
      ?.getMarketDetail({ id })
      .then(async (marketRes) => {
        const oracleId = marketRes.synth?.oracle ? String(marketRes.synth.oracle) : "";
        const oracleRes = oracleId
          ? await $gqlsdk.getOracleSummary({ id: oracleId })
          : { oracle: null };
        market = marketRes?.synth || null;
        oracle = oracleRes?.oracle || null;
      })
      .catch((err) => {
        console.warn("Unable to load market detail", err);
        error = "Unable to load indexed market detail.";
      })
      .finally(() => {
        loading = false;
      });
  });

  onDestroy(unsubscribe);
  onMount(updateVc);

  $: latest = market?.snapshots?.[market.snapshots.length - 1];
  $: liquiditySeries = market?.snapshots.map((snapshot) => etherValue(snapshot.totalLiquidity)) || [];
  $: supplySeries = market?.snapshots.map((snapshot) => etherValue(snapshot.totalSupply)) || [];
  $: priceSeries = market?.snapshots.map((snapshot) => Number(snapshot.price || 0)) || [];
  $: totalRoundVolume =
    market?.roundSnapshots.reduce((sum, snapshot) => sum + volumeTotal(snapshot), 0) || 0;
</script>

<svelte:head>
  <title>{shortAddress($page.params.id)} Market | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
      <div class="app-label">Market detail</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="font-mono text-2xl font-bold lg:text-4xl">{shortAddress($page.params.id, 10)}</h1>
          <p class="app-muted mt-2">Historical liquidity, supply, volume, and oracle strength.</p>
        </div>
        <a class="btn btn-outline rounded-full" href="/markets">All markets</a>
      </div>
  </div>
</header>

<div class="lg:h-auto lg:pt-0 container-height" id="container">
  <div class="mx-auto max-w-7xl space-y-6 px-4 lg:px-0">
    {#if loading}
      <section class="app-panel rounded-lg p-8 app-muted">Loading market detail...</section>
    {:else if error}
      <section class="app-panel rounded-lg p-8 text-error">{error}</section>
    {:else if !market}
      <section class="app-panel rounded-lg p-8 app-muted">Market not found in the indexed schema.</section>
    {:else}
      <section class="grid gap-3 md:grid-cols-4">
        <StatCard label="Liquidity" value={`${compactEther(latest?.totalLiquidity)} ETC`} detail="Latest snapshot" />
        <StatCard label="Circulation" value={compactEther(latest?.totalSupply)} detail="Position tokens" />
        <StatCard label="Round volume" value={`${compact(totalRoundVolume)} ETC`} detail="Indexed round history" />
        <StatCard label="Price" value={compact(latest?.price)} detail={`Tick ${latest?.tick || 0}`} />
      </section>

      <section class="grid gap-4 lg:grid-cols-3">
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">Liquidity over time</div>
          <Sparkline values={liquiditySeries} label="Market liquidity over time" />
        </div>
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">Tokens in circulation</div>
          <Sparkline values={supplySeries} label="Market supply over time" />
        </div>
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">Price path</div>
          <Sparkline values={priceSeries} label="Market price over time" />
        </div>
      </section>

      <section class="app-panel rounded-lg p-4">
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div class="app-label">Oracle strength</div>
            <h2 class="mt-1 text-xl font-bold">
              {oracle ? shortAddress(oracle.id, 10) : shortAddress(String(market.oracle), 10)}
            </h2>
          </div>
          <a class="btn btn-primary rounded-full" href={`/oracles/${market.oracle}`}>Open oracle</a>
        </div>
        <div class="mt-4 grid gap-3 md:grid-cols-4">
          <StatCard label="ETC staked" value={`${compactEther(oracle?.totalStake)} ETC`} detail="Settlement backing" />
          <StatCard label="Stakers" value={compact(oracle?.participantCount, 0)} detail="Participants" />
          <StatCard label="MANA" value={compactEther(oracle?.totalMana)} detail="Minted by oracle" />
          <StatCard label="Rewards" value={`${compactEther(oracle?.totalRewardsClaimed)} ETC`} detail="Claimed rewards" />
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        <div class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Volume by round</div>
          </div>
          <div class="max-h-[420px] overflow-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Volume</th>
                  <th>Liquidity</th>
                  <th>Supply</th>
                </tr>
              </thead>
              <tbody>
                {#each [...market.roundSnapshots].reverse() as snapshot (snapshot.id)}
                  <tr>
                    <td>{compact(snapshot.round, 0)}</td>
                    <td>{compact(volumeTotal(snapshot))} ETC</td>
                    <td>{compactEther(snapshot.totalLiquidity)} ETC</td>
                    <td>{compactEther(snapshot.totalSupply)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <div class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Recent market events</div>
          </div>
          <div class="max-h-[420px] overflow-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Amount</th>
                  <th>Round</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {#each market.tradeEvents as event (event.id)}
                  <tr>
                    <td>{event.kind}</td>
                    <td>{compactEther(event.amount)}</td>
                    <td>{event.round ?? "n/a"}</td>
                    <td>{formatDate(event.timestamp)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    {/if}
  </div>
</div>
