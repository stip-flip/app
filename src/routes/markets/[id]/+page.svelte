<script lang="ts">
  import { page } from "$app/stores";
  import { formatUnits } from "ethers/lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import StatCard from "src/components/stat-card.svelte";
  import TimeSeriesChart from "src/components/time-series-chart.svelte";
  import { extractERC20Info, type TokenInfo } from "src/hooks/erc20";
  import type { GetMarketDetailQuery } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import { navigate } from "src/lib/path";
  import {
    compact,
    compactEther,
    etherValue,
    formatDate,
    shortAddress,
    volumeTotal,
  } from "src/lib/stats";
  import { gqlsdk, sdk } from "src/stores";

  let market: GetMarketDetailQuery["synth"] = null;
  let token: TokenInfo | null = null;
  let settlementPrice: string | null = null;
  let settlementTick: number | null = null;
  let circulatingSupply: number | null = null;
  let loading = true;
  let error = "";
  let selectedChartMetric = "liquidity";

  const marketChartMetrics = [
    { key: "liquidity", label: "Liquidity", unit: "ETC", color: "rgb(var(--sf-green))" },
    { key: "supply", label: "Supply", color: "rgb(96 165 250)" },
    { key: "price", label: "Settlement price", color: "rgb(250 204 21)" },
    { key: "poolDebt", label: "Pool debt", unit: "ETC", color: "rgb(248 113 113)" },
    { key: "volume", label: "Volume", unit: "ETC", color: "rgb(244 114 182)" },
    { key: "tick", label: "Tick", decimals: 0, color: "rgb(45 212 191)" },
    { key: "events", label: "Events", decimals: 0, color: "rgb(192 132 252)" },
  ];

  async function getSettlementState(id: string) {
    const ethsdk = get(sdk);
    const pool = ethsdk.POOL.attach(id);
    const [slot1, oracleAddress, oracleSlot, long, leverage, totalSupply] = await Promise.all([
      pool.slot1(),
      pool.oracle(),
      pool.oracleSlot(),
      pool.long(),
      pool.leverage(),
      pool.totalSupply(),
    ]);
    const oracle = ethsdk.ORACLE.attach(oracleAddress);
    const [basePrice, decimals] = await Promise.all([
      oracle["lastPrice(uint8)"](oracleSlot),
      oracle.getDecimals(oracleSlot),
    ]);

    const exponent = Number(leverage) === 1 ? "²" : Number(leverage) === 2 ? "³" : "";
    const displayPrice = `${long ? "" : "1 / "}${formatPrice(
      Number(formatUnits(basePrice, decimals))
    )}${exponent}`;

    return {
      price: displayPrice,
      tick: Number(slot1.tick),
      circulatingSupply: Number(formatUnits(totalSupply, 18)),
    };
  }

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    if (!$gqlsdk) return;

    const id = $page.params.id;
    loading = true;
    error = "";
    token = null;
    settlementPrice = null;
    settlementTick = null;
    circulatingSupply = null;
    $gqlsdk
      ?.getMarketDetail({ id })
      .then(async (marketRes) => {
        const [tokenInfo, settlementState] = await Promise.all([
          marketRes.synth ? extractERC20Info(marketRes.synth.id) : null,
          marketRes.synth
            ? getSettlementState(marketRes.synth.id).catch((err) => {
                console.warn("Unable to load market settlement state", marketRes.synth?.id, err);
                return null;
              })
            : null,
        ]);
        market = marketRes?.synth || null;
        token = tokenInfo;
        settlementPrice = settlementState?.price ?? null;
        settlementTick = settlementState?.tick ?? null;
        circulatingSupply = settlementState?.circulatingSupply ?? null;
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
  $: marketChartPoints =
    market?.snapshots.map((snapshot) => ({
      timestamp: Number(snapshot.timestamp || 0),
      liquidity: etherValue(snapshot.totalLiquidity),
      supply: etherValue(snapshot.totalSupply),
      price: Number(snapshot.price || 0),
      poolDebt: etherValue(snapshot.poolDebt),
      volume: volumeTotal(snapshot),
      tick: Number(snapshot.tick || 0),
      events: Number(snapshot.eventCount || 0),
    })) || [];
  $: totalRoundVolume =
    market?.roundSnapshots.reduce((sum, snapshot) => sum + volumeTotal(snapshot), 0) || 0;

  function compactOptional(value?: number | null, decimals = 2) {
    return value === undefined || value === null ? "pending" : compact(value, decimals);
  }

  function formatPrice(value?: number | null) {
    if (value === undefined || value === null || !Number.isFinite(value)) return "pending";
    if (value !== 0 && Math.abs(value) < 0.01) {
      return Intl.NumberFormat("en", {
        maximumSignificantDigits: 4,
      }).format(value);
    }
    return compact(value);
  }
</script>

<svelte:head>
  <title>{token?.symbol || shortAddress($page.params.id)} Market | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
      <a
        class="app-muted mb-3 inline-flex items-center gap-2 text-sm font-semibold hover:text-white"
        href={navigate("/markets", $page.url)}
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </a>
      <div class="app-label">Market detail</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="text-2xl font-bold lg:text-4xl">{token?.symbol || shortAddress($page.params.id, 10)}</h1>
          <p class="app-muted mt-2">
            {token?.description || token?.name || "Historical liquidity, supply, volume, and oracle strength."}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm app-muted">
            {#if token?.name}
              <span>Market · {token.name}</span>
              <span aria-hidden="true">·</span>
              <span>{shortAddress($page.params.id, 10)}</span>
            {:else}
              <span>Market · {shortAddress($page.params.id, 10)}</span>
            {/if}
            {#if market?.oracle}
              <span aria-hidden="true">·</span>
              <span>Oracle ·</span>
              <a
                class="text-white underline underline-offset-4 hover:text-primary"
                href={navigate(`/oracles/${market.oracle}`, $page.url)}
              >
                {shortAddress(String(market.oracle), 10)}
              </a>
            {/if}
          </div>
        </div>
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
      <section class="grid gap-3 md:grid-cols-5">
        <StatCard label="Liquidity" value={`${compactEther(latest?.totalLiquidity)} ETC`} detail="Latest snapshot" />
        <StatCard label="Circulating supply" value={compactOptional(circulatingSupply)} detail="Position tokens" />
        <StatCard label="Round volume" value={`${compact(totalRoundVolume)} ETC`} detail="Indexed round history" />
        <StatCard label="Settlement price" value={settlementPrice || "pending"} detail="Last settlement price" />
        <StatCard label="Settlement tick" value={compactOptional(settlementTick, 0)} detail="Last settlement tick" />
      </section>

      <TimeSeriesChart
        title="Market history"
        points={marketChartPoints}
        metrics={marketChartMetrics}
        bind:selected={selectedChartMetric}
      />

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
