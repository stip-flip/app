<script lang="ts">
  import { formatUnits } from "ethers/lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import StatCard from "src/components/stat-card.svelte";
  import { extractERC20Info, type TokenInfo } from "src/hooks/erc20";
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
  import { gqlsdk, sdk } from "src/stores";

  type MarketSummary = MarketSummaryFragmentFragment & {
    settlementPrice?: string;
    settlementTick?: number;
    circulatingSupply?: number;
    token?: TokenInfo;
  };

  let markets: MarketSummary[] = [];
  let loading = true;
  let error = "";

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
      settlementPrice: displayPrice,
      settlementTick: Number(slot1.tick),
      circulatingSupply: Number(formatUnits(totalSupply, 18)),
    };
  }

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    if (!$gqlsdk) return;

    loading = true;
    error = "";
    $gqlsdk
      ?.getMarketSummaries({ first: 1000 })
      .then(async (res) => {
        const marketsWithMetadata = await Promise.all(
          res.synths.map(async (market) => {
            const [token, settlementState] = await Promise.all([
              extractERC20Info(market.id),
              getSettlementState(market.id).catch((err) => {
                console.warn("Unable to load market settlement state", market.id, err);
                return {};
              }),
            ]);

            return {
              ...market,
              ...settlementState,
              token,
            };
          })
        );

        markets = marketsWithMetadata.sort((a, b) => {
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

  function openMarket(id: string) {
    window.location.href = `/markets/${id}`;
  }

  function openMarketFromKeyboard(event: KeyboardEvent, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMarket(id);
    }
  }

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
        <a class="btn btn-primary rounded-full" href="/markets/create">
          Create market
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
                <th>Circulating supply</th>
                <th>Volume</th>
                <th>Settlement price</th>
                <th>Settlement tick</th>
                <th>Oracle</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {#each markets as market (market.id)}
                {@const snapshot = market.latestSnapshots[0]}
                <tr
                  class="hover cursor-pointer"
                  role="link"
                  tabindex="0"
                  on:click={() => openMarket(market.id)}
                  on:keydown={(event) => openMarketFromKeyboard(event, market.id)}
                >
                  <td>
                    <div class="flex flex-col gap-1">
                      <a
                        class="font-bold text-primary"
                        href={`/markets/${market.id}`}
                        on:click|stopPropagation
                      >
                        {market.token?.symbol || shortAddress(market.id)}
                      </a>
                      <span class="text-sm">{market.token?.name || shortAddress(market.id, 10)}</span>
                      {#if market.token?.description}
                        <span class="app-muted max-w-xs text-xs">{market.token.description}</span>
                      {/if}
                    </div>
                  </td>
                  <td>{market.long ? "Long" : "Short"}</td>
                  <td>{compactEther(snapshot?.totalLiquidity)} ETC</td>
                  <td>{compactOptional(market.circulatingSupply)}</td>
                  <td>{compact(volumeTotal(snapshot))} ETC</td>
                  <td>{market.settlementPrice || "pending"}</td>
                  <td>{compactOptional(market.settlementTick, 0)}</td>
                  <td>
                    <a
                      class="font-mono text-primary"
                      href={`/oracles/${market.oracle}`}
                      on:click|stopPropagation
                    >
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
