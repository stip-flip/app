<script lang="ts">
  import { formatUnits } from "ethers/lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import Icon from "@iconify/svelte";
  import Logo from "src/components/logo.svelte";
  import Theme from "src/components/theme.svelte";
  import { extractERC20Info, type TokenInfo } from "src/hooks/erc20";
  import type { MarketSummaryFragmentFragment } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import { modal } from "src/lib/web3";
  import {
    compact,
    compactEther,
    etherValue,
    formatDate,
    shortAddress,
    volumeTotal,
  } from "src/lib/stats";
  import { appMode, gqlsdk, sdk } from "src/stores";

  type MarketSummary = MarketSummaryFragmentFragment & {
    settlementPrice?: string;
    settlementTick?: number;
    circulatingSupply?: number;
    token?: TokenInfo;
  };

  let markets: MarketSummary[] = [];
  let loading = true;
  let error = "";
  let activeFilter = "all";
  let search = "";
  let activeCategory = "All";
  let howItWorksOpen = false;
  let howItWorksStep = 0;

  const filters = [
    { key: "all", label: "All" },
    { key: "stip", label: "Stip" },
    { key: "flip", label: "Flip" },
    { key: "base", label: "Base" },
    { key: "squared", label: "Squared" },
    { key: "cubed", label: "Cubed" },
  ];

  const categoryFallbacks = ["All", "Crypto", "Stip", "Flip", "Squared", "Cubed"];
  const ETC_ADDRESS = "0x0";
  const howItWorksSteps = [
    {
      icon: "mdi:axis-arrow",
      eyebrow: "Step 1",
      title: "What is Stip & Flip?",
      body: "S&F turns continuous market exposure into tradable tokens. Stip tokens track the long side, Flip tokens track the short side, and each market can have base, squared, or cubed variants.",
      detail: "The result feels like a prediction-market feed, but the instruments are continuous position tokens you can buy, sell, or hold.",
    },
    {
      icon: "mdi:swap-horizontal-bold",
      eyebrow: "Step 2",
      title: "Trade or provide liquidity",
      body: "Traders buy exposure with ETC or sell back to ETC from each market card. LPs deposit ETC liquidity to support issuance, redemption, and market depth.",
      detail: "Use Buy/Sell when you want a position. Use LP when you want to back a market and earn from liquidity activity.",
    },
    {
      icon: "mdi:wallet-outline",
      eyebrow: "Step 3",
      title: "Connect a wallet",
      body: "Connect MetaMask, Coinbase Wallet, or another supported wallet when you are ready to trade, deposit liquidity, or manage positions.",
      detail: "Transactions happen on Ethereum Classic, so the wallet flow will handle account selection and network setup.",
    },
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

  function leverageLabel(market: MarketSummary) {
    const name = market.token?.name || market.token?.symbol || "";
    if (name.includes("³")) return "Cubed";
    if (name.includes("²")) return "Squared";
    return "Base";
  }

  function leverageSuffix(market: MarketSummary) {
    const label = leverageLabel(market);
    return label === "Cubed" ? "³" : label === "Squared" ? "²" : "";
  }

  function baseMarketName(market: MarketSummary) {
    const name = market.token?.name || market.token?.symbol || shortAddress(market.id, 10);
    return name
      .replace(/^Stip[\s-]*/i, "")
      .replace(/^Flip[\s-]*/i, "")
      .replace(/[²³]/g, "")
      .trim();
  }

  function sideLabel(market: MarketSummary) {
    return market.long ? "Stip" : "Flip";
  }

  function matchesActiveFilter(market: MarketSummary) {
    if (activeFilter === "all") return true;
    if (activeFilter === "stip") return market.long;
    if (activeFilter === "flip") return !market.long;
    if (activeFilter === "base") return leverageLabel(market) === "Base";
    if (activeFilter === "squared") return leverageLabel(market) === "Squared";
    if (activeFilter === "cubed") return leverageLabel(market) === "Cubed";
    return true;
  }

  function matchesSearch(market: MarketSummary) {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [
      market.token?.symbol,
      market.token?.name,
      market.token?.description,
      baseMarketName(market),
      sideLabel(market),
      leverageLabel(market),
      market.id,
      String(market.oracle),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  }

  function matchesCategory(market: MarketSummary) {
    if (activeCategory === "All") return true;
    if (activeCategory === "Crypto") return true;
    if (activeCategory === "Stip") return market.long;
    if (activeCategory === "Flip") return !market.long;
    if (activeCategory === "Squared") return leverageLabel(market) === "Squared";
    if (activeCategory === "Cubed") return leverageLabel(market) === "Cubed";
    return baseMarketName(market).toLowerCase().includes(activeCategory.toLowerCase());
  }

  function openTrade(mode: "market" | "otc") {
    appMode.set(mode);
  }

  function openHowItWorks() {
    howItWorksStep = 0;
    howItWorksOpen = true;
  }

  function tokenParam(address: string) {
    return encodeURIComponent(address);
  }

  function swapUrl(from: string, to: string) {
    return `/swap?mode=market&from=${tokenParam(from)}&to=${tokenParam(to)}`;
  }

  function buyUrl(market: MarketSummary) {
    return swapUrl(ETC_ADDRESS, market.id);
  }

  function sellUrl(market: MarketSummary) {
    return swapUrl(market.id, ETC_ADDRESS);
  }

  function lpUrl(market?: MarketSummary) {
    return market ? `/earn/add?mode=otc&token=${tokenParam(market.id)}` : "/earn/add?mode=otc";
  }

  $: activeHowItWorksStep = howItWorksSteps[howItWorksStep];
  $: isLastHowItWorksStep = howItWorksStep === howItWorksSteps.length - 1;

  $: featuredMarkets = markets.slice(0, 5);
  $: categories = [
    ...categoryFallbacks,
    ...Array.from(new Set(markets.map(baseMarketName))).filter((name) => name && name.length <= 18),
  ].slice(0, 12);
  $: filteredMarkets = markets.filter(matchesActiveFilter).filter(matchesSearch).filter(matchesCategory);
  $: marketGroups = Object.values(
    filteredMarkets.reduce((groups, market) => {
      const key = `${String(market.oracle).toLowerCase()}:${baseMarketName(market).toLowerCase()}`;
      const snapshot = market.latestSnapshots[0];
      const group = groups[key] || {
        key,
        name: baseMarketName(market),
        oracle: market.oracle,
        markets: [] as MarketSummary[],
        liquidity: 0,
        volume: 0,
        updated: 0,
      };
      group.markets.push(market);
      group.liquidity += etherValue(snapshot?.totalLiquidity);
      group.volume += volumeTotal(snapshot);
      group.updated = Math.max(group.updated, Number(snapshot?.timestamp || 0));
      groups[key] = group;
      return groups;
    }, {} as Record<string, { key: string; name: string; oracle: string; markets: MarketSummary[]; liquidity: number; volume: number; updated: number }>)
  ).sort((a, b) => b.liquidity + b.volume - (a.liquidity + a.volume));

</script>

<svelte:head>
  <title>Stip & Flip | Continuous Perp Markets</title>
  <meta
    name="description"
    content="Browse, trade, and provide liquidity to Stip & Flip tokenized perpetual markets."
  />
</svelte:head>

<svelte:window
  on:keydown={(event) => {
    if (howItWorksOpen && event.key === "Escape") {
      howItWorksOpen = false;
    }
  }}
/>

<div class="market-home min-h-screen pb-12">
  <header class="market-topbar">
    <a class="brand-lockup" href="/" aria-label="Stip & Flip home">
      <Logo width="2.25rem" height="2.25rem" />
    </a>

    <label class="search-box" for="market-search">
      <Icon icon="akar-icons:search" />
      <input
        id="market-search"
        bind:value={search}
        type="search"
        placeholder="Search markets, assets, sides..."
        autocomplete="off"
      />
      {#if search}
        <button type="button" aria-label="Clear search" on:click={() => (search = "")}>
          <Icon icon="akar-icons:cross" />
        </button>
      {/if}
    </label>

    <nav class="top-actions" aria-label="Primary">
      <button type="button" on:click={openHowItWorks}>How it works</button>
      <a href="/markets">Markets</a>
      <a href="/swap?mode=market" on:click={() => openTrade("market")}>Trade</a>
      <a href={lpUrl()} on:click={() => openTrade("otc")}>LP</a>
      <div class="theme-shell" aria-label="Theme">
        <Theme />
      </div>
    </nav>
  </header>

  {#if howItWorksOpen}
    <div
      class="how-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
    >
      <button
        class="how-modal-dismiss"
        type="button"
        aria-label="Close how it works"
        on:click={() => (howItWorksOpen = false)}
      />
      <section class="how-modal">
        <div class="how-modal-header">
          <div>
            <p class="app-label">Getting started</p>
            <h2 id="how-it-works-title">How Stip & Flip works</h2>
          </div>
          <button type="button" aria-label="Close" on:click={() => (howItWorksOpen = false)}>
            <Icon icon="akar-icons:cross" />
          </button>
        </div>

        <div class="how-progress" aria-label="How it works progress">
          {#each howItWorksSteps as step, index (step.title)}
            <button
              type="button"
              aria-label={`Go to ${step.eyebrow}`}
              aria-current={index === howItWorksStep ? "step" : undefined}
              class:active-step={index === howItWorksStep}
              on:click={() => (howItWorksStep = index)}
            />
          {/each}
        </div>

        <div class="how-step-view">
          <div class="how-step-icon">
            <Icon icon={activeHowItWorksStep.icon} />
          </div>
          <p class="app-label">{activeHowItWorksStep.eyebrow}</p>
          <h3>{activeHowItWorksStep.title}</h3>
          <p>{activeHowItWorksStep.body}</p>
          <small>{activeHowItWorksStep.detail}</small>
        </div>

        <div class="how-modal-actions">
          {#if howItWorksStep > 0}
            <button
              type="button"
              class="btn btn-ghost rounded-full"
              on:click={() => (howItWorksStep -= 1)}
            >
              Back
            </button>
          {:else}
            <button type="button" class="btn btn-ghost rounded-full" on:click={() => (howItWorksOpen = false)}>
              Browse markets
            </button>
          {/if}

          {#if isLastHowItWorksStep}
            <button
              type="button"
              class="btn btn-primary rounded-full"
              on:click={() => {
                howItWorksOpen = false;
                modal.open();
              }}
            >
              Connect wallet
            </button>
          {:else}
            <button
              type="button"
              class="btn btn-primary rounded-full"
              on:click={() => (howItWorksStep += 1)}
            >
              Next
            </button>
          {/if}
        </div>
      </section>
    </div>
  {/if}

  <main class="mx-auto max-w-7xl px-4 pt-24 lg:px-0 lg:pt-28">
    <section class="category-strip" aria-label="Market categories">
      {#each categories as category (category)}
        <button
          type="button"
          class:active-category={activeCategory === category}
          on:click={() => (activeCategory = category)}
        >
          {category}
        </button>
      {/each}
    </section>

    {#if loading}
      <section class="app-panel mt-6 rounded-lg p-8 app-muted">Loading markets from the subgraph...</section>
    {:else if error}
      <section class="app-panel mt-6 rounded-lg p-8 text-error">{error}</section>
    {:else if markets.length === 0}
      <section class="app-panel mt-6 rounded-lg p-8 app-muted">No markets have been indexed yet.</section>
    {:else}
      <section class="mt-6">
        <div class="space-y-6">
          <section class="space-y-3">
            <div class="section-header-row">
              <div>
                <div class="app-label">Featured</div>
                <h2>Most liquid markets</h2>
              </div>
              <a class="btn btn-outline btn-sm rounded-full" href={lpUrl()} on:click={() => openTrade("otc")}>
                LP deposit
              </a>
            </div>
            <div class="featured-scroll">
              {#each featuredMarkets as market (market.id)}
                {@const snapshot = market.latestSnapshots[0]}
                <article class="featured-card">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="app-label">{sideLabel(market)} {leverageSuffix(market)}</div>
                      <a class="mt-1 block text-lg font-bold hover:text-primary" href={`/markets/${market.id}`}>
                        {baseMarketName(market)}
                      </a>
                    </div>
                    <span class="price-pill">{market.settlementPrice || "pending"}</span>
                  </div>
                  <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div class="app-muted text-xs">Liquidity</div>
                      <strong>{compactEther(snapshot?.totalLiquidity)} ETC</strong>
                    </div>
                    <div>
                      <div class="app-muted text-xs">Volume</div>
                      <strong>{compact(volumeTotal(snapshot))} ETC</strong>
                    </div>
                  </div>
                  <div class="mt-4 grid grid-cols-3 gap-2">
                    <a class="btn btn-primary btn-sm" href={buyUrl(market)} on:click={() => openTrade("market")}>Buy</a>
                    <a class="btn btn-outline btn-sm" href={sellUrl(market)} on:click={() => openTrade("market")}>Sell</a>
                    <a class="btn btn-ghost btn-sm" href={lpUrl(market)} on:click={() => openTrade("otc")}>LP</a>
                  </div>
                </article>
              {/each}
            </div>
          </section>

          <section class="market-feed">
            <div class="feed-header">
              <div>
                <div class="app-label">All markets</div>
                <h2>{filteredMarkets.length} matching markets</h2>
              </div>
              <div class="filter-row">
                {#each filters as filter (filter.key)}
                  <button
                    type="button"
                    class:active-filter={activeFilter === filter.key}
                    on:click={() => (activeFilter = filter.key)}
                  >
                    {filter.label}
                  </button>
                {/each}
              </div>
            </div>

            {#if marketGroups.length === 0}
              <div class="p-6 app-muted">No markets match this search.</div>
            {:else}
              <div class="divide-y divide-white/10">
                {#each marketGroups as group (group.key)}
                  <div class="market-row">
                    <div class="market-row-summary">
                      <button
                        type="button"
                        class="market-title"
                        on:click={() => openMarket(group.markets[0].id)}
                      >
                        <span>{group.name}</span>
                        <small>{group.markets.length} variants</small>
                      </button>
                      <div class="market-meta">
                        <span>{compactEther(group.liquidity)} ETC liquidity</span>
                        <span>{compact(group.volume)} ETC volume</span>
                        <a href={`/oracles/${group.oracle}`}>{shortAddress(String(group.oracle))}</a>
                        <span>{formatDate(group.updated)}</span>
                      </div>
                    </div>

                    <div class="variant-grid">
                      {#each group.markets as market (market.id)}
                        {@const snapshot = market.latestSnapshots[0]}
                        <div
                          class="market-variant"
                          role="link"
                          tabindex="0"
                          on:click={() => openMarket(market.id)}
                          on:keydown={(event) => openMarketFromKeyboard(event, market.id)}
                        >
                          <div class="variant-topline">
                            <span class:stip-pill={market.long} class:flip-pill={!market.long} class="side-pill">
                              {sideLabel(market)}
                            </span>
                            <span class="side-pill">{leverageLabel(market)}</span>
                            <strong>{market.token?.symbol || shortAddress(market.id)}</strong>
                          </div>
                          <div class="variant-stats">
                            <span>
                              <small>Price</small>
                              {market.settlementPrice || "pending"}
                            </span>
                            <span>
                              <small>Supply</small>
                              {compactOptional(market.circulatingSupply)}
                            </span>
                            <span>
                              <small>Liq.</small>
                              {compactEther(snapshot?.totalLiquidity)}
                            </span>
                          </div>
                          <div class="mt-3 flex gap-2">
                            <a class="btn btn-primary btn-xs flex-1" href={buyUrl(market)} on:click|stopPropagation={() => openTrade("market")}>Buy</a>
                            <a class="btn btn-outline btn-xs flex-1" href={sellUrl(market)} on:click|stopPropagation={() => openTrade("market")}>Sell</a>
                            <a class="btn btn-ghost btn-xs flex-1" href={lpUrl(market)} on:click|stopPropagation={() => openTrade("otc")}>LP</a>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </section>
        </div>

      </section>
    {/if}
  </main>
</div>

<style>
  .market-home {
    background:
      radial-gradient(circle at top left, rgb(var(--sf-green) / 0.12), transparent 32rem),
      linear-gradient(180deg, rgb(255 255 255 / 0.035), transparent 22rem);
  }

  .market-topbar {
    position: fixed;
    inset: 0 0 auto;
    z-index: 30;
    display: grid;
    grid-template-columns: auto minmax(0, 42rem) auto;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem max(1rem, calc((100vw - 80rem) / 2));
    border-bottom: 1px solid rgb(255 255 255 / 0.09);
    background: rgb(12 14 18 / 0.78);
    backdrop-filter: blur(18px);
  }

  :global([data-theme="light"]) .market-topbar {
    background: rgb(245 247 242 / 0.86);
    border-bottom-color: rgb(0 0 0 / 0.08);
  }

  .brand-lockup,
  .top-actions,
  .search-box {
    display: flex;
    align-items: center;
  }

  .brand-lockup {
    width: 2.75rem;
    height: 2.75rem;
    justify-content: center;
  }

  .brand-lockup :global(svg) {
    display: block;
  }

  .search-box {
    gap: 0.65rem;
    min-width: 0;
    border: 1px solid rgb(255 255 255 / 0.11);
    border-radius: 999px;
    padding: 0.45rem 0.75rem;
    background: rgb(255 255 255 / 0.055);
  }

  .search-box input {
    min-width: 0;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    font: inherit;
  }

  .search-box button {
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 999px;
  }

  .top-actions {
    gap: 0.8rem;
    justify-content: flex-end;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .top-actions button {
    white-space: nowrap;
    font: inherit;
  }

  .theme-shell {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 999px;
  }

  .how-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgb(0 0 0 / 0.58);
    backdrop-filter: blur(10px);
  }

  .how-modal-dismiss {
    position: absolute;
    inset: 0;
    cursor: default;
  }

  .how-modal {
    position: relative;
    z-index: 1;
    width: min(100%, 36rem);
    max-height: min(42rem, calc(var(--vc, 1vh) * 100 - 2rem));
    overflow-y: auto;
    border: 1px solid rgb(255 255 255 / 0.12);
    border-radius: 0.5rem;
    padding: 1rem;
    background: rgb(15 17 22 / 0.96);
    box-shadow: 0 1.5rem 5rem rgb(0 0 0 / 0.34);
  }

  :global([data-theme="light"]) .how-modal {
    border-color: rgb(0 0 0 / 0.1);
    background: rgb(249 250 247 / 0.98);
  }

  .how-modal-header,
  .how-modal-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .how-modal-header h2 {
    margin-top: 0.2rem;
    font-size: 1.55rem;
    font-weight: 850;
  }

  .how-modal-header button {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 999px;
  }

  .how-progress {
    display: flex;
    gap: 0.45rem;
    margin: 1rem 0;
  }

  .how-progress button {
    height: 0.35rem;
    flex: 1;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.12);
  }

  .how-progress button.active-step {
    background: rgb(var(--sf-green));
  }

  .how-step-view {
    min-height: 18rem;
    border: 1px solid rgb(255 255 255 / 0.09);
    border-radius: 0.5rem;
    padding: clamp(1rem, 4vw, 1.5rem);
    background: rgb(255 255 255 / 0.04);
  }

  .how-step-icon {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    background: rgb(var(--sf-green) / 0.14);
    color: rgb(var(--sf-green));
    font-size: 1.35rem;
  }

  .how-step-view .app-label {
    margin-top: 1rem;
  }

  .how-step-view h3 {
    margin-top: 0.35rem;
    font-size: clamp(1.75rem, 6vw, 2.75rem);
    font-weight: 850;
    line-height: 0.98;
  }

  .how-step-view p:not(.app-label),
  .how-step-view small {
    display: block;
    color: rgb(var(--sf-text-muted));
    line-height: 1.55;
  }

  .how-step-view p:not(.app-label) {
    margin-top: 0.85rem;
    font-size: 1rem;
  }

  .how-step-view small {
    margin-top: 1rem;
    font-size: 0.85rem;
  }

  .featured-card,
  .market-feed {
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 0.5rem;
    background: rgb(255 255 255 / 0.045);
  }

  :global([data-theme="light"]) .featured-card,
  :global([data-theme="light"]) .market-feed {
    border-color: rgb(16 24 20 / 0.12);
    background: rgb(255 255 255 / 0.82);
    box-shadow: 0 0.75rem 2rem rgb(25 45 34 / 0.08);
  }

  .variant-stats small {
    display: block;
    color: rgb(var(--sf-text-muted));
    font-size: 0.75rem;
  }

  .category-strip,
  .filter-row {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .category-strip {
    margin: 0 0 1rem;
    padding-bottom: 0.25rem;
  }

  .category-strip button,
  .filter-row button {
    white-space: nowrap;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 800;
    background: rgb(255 255 255 / 0.035);
  }

  :global([data-theme="light"]) .search-box,
  :global([data-theme="light"]) .theme-shell,
  :global([data-theme="light"]) .category-strip button,
  :global([data-theme="light"]) .filter-row button,
  :global([data-theme="light"]) .price-pill,
  :global([data-theme="light"]) .side-pill {
    border-color: rgb(16 24 20 / 0.12);
    background: rgb(255 255 255 / 0.78);
  }

  .category-strip button.active-category,
  .filter-row button.active-filter {
    border-color: rgb(var(--sf-green) / 0.55);
    background: rgb(var(--sf-green) / 0.14);
    color: rgb(var(--sf-green));
  }

  .section-header-row,
  .feed-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
  }

  .section-header-row h2,
  .feed-header h2 {
    margin-top: 0.2rem;
    font-size: 1.35rem;
    font-weight: 800;
  }

  .featured-scroll {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(17rem, 1fr);
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
  }

  .featured-card {
    padding: 1rem;
  }

  .price-pill {
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 999px;
    padding: 0.25rem 0.55rem;
    font-size: 0.75rem;
    font-weight: 800;
  }

  .market-feed {
    overflow: hidden;
  }

  .feed-header {
    padding: 1rem;
    border-bottom: 1px solid rgb(255 255 255 / 0.1);
  }

  :global([data-theme="light"]) .feed-header {
    border-bottom-color: rgb(16 24 20 / 0.1);
    background: rgb(248 250 246 / 0.7);
  }

  .market-row {
    padding: 1rem;
  }

  :global([data-theme="light"]) .market-row {
    border-color: rgb(16 24 20 / 0.08);
  }

  .market-row-summary {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }

  .market-title {
    text-align: left;
  }

  .market-title span {
    display: block;
    font-size: 1.1rem;
    font-weight: 850;
  }

  .market-title small,
  .market-meta {
    color: rgb(var(--sf-text-muted));
    font-size: 0.78rem;
  }

  .market-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .market-meta a {
    color: rgb(var(--sf-green));
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .variant-grid {
    display: grid;
    gap: 0.65rem;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    margin-top: 0.9rem;
  }

  .market-variant {
    cursor: pointer;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 0.5rem;
    padding: 0.875rem;
    background: rgb(255 255 255 / 0.03);
  }

  .market-variant:hover {
    border-color: rgb(var(--sf-green) / 0.45);
    background: rgb(255 255 255 / 0.055);
  }

  :global([data-theme="light"]) .market-variant {
    border-color: rgb(16 24 20 / 0.1);
    background: rgb(248 250 246 / 0.86);
  }

  :global([data-theme="light"]) .market-variant:hover {
    border-color: rgb(var(--sf-green) / 0.45);
    background: rgb(255 255 255 / 0.96);
  }

  .side-pill {
    border: 1px solid rgb(255 255 255 / 0.12);
    border-radius: 999px;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .variant-topline {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .variant-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
    margin-top: 0.7rem;
    font-size: 0.85rem;
  }

  .stip-pill {
    border-color: rgb(var(--sf-green) / 0.45);
    color: rgb(var(--sf-green));
  }

  .flip-pill {
    border-color: rgb(248 113 113 / 0.45);
    color: rgb(248 113 113);
  }

  @media (max-width: 1023px) {
    .market-topbar {
      grid-template-columns: 1fr auto;
    }

    .search-box {
      grid-column: 1 / -1;
      order: 3;
    }

    .top-actions a {
      display: none;
    }

    .market-row-summary {
      grid-template-columns: 1fr;
      display: grid;
    }

  }

  @media (max-width: 640px) {
    .market-meta {
      justify-content: flex-start;
    }
  }
</style>
