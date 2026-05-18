<script lang="ts">
  import { page } from "$app/stores";
  import { formatUnits } from "ethers/lib/utils";
  import { onDestroy, onMount } from "svelte";
  import StatCard from "src/components/stat-card.svelte";
  import TimeSeriesChart from "src/components/time-series-chart.svelte";
  import { extractERC20Info, type TokenInfo } from "src/hooks/erc20";
  import type { GetOracleDetailQuery, SynthFragmentFragment } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import { navigate } from "src/lib/path";
  import { compact, compactEther, etherValue, formatDate, shortAddress } from "src/lib/stats";
  import { gqlsdk, sdk } from "src/stores";

  type OraclePriceSlot = {
    slot: number;
    price: string;
    decimals: number;
  };

  type OracleContractInfo = {
    description: string;
    frequency: number | null;
    currentRound: string;
    prices: OraclePriceSlot[];
  };

  type OracleMarket = SynthFragmentFragment & {
    token?: TokenInfo;
  };

  let oracle: GetOracleDetailQuery["oracle"] = null;
  let oracleMarkets: OracleMarket[] = [];
  let contractInfo: OracleContractInfo | null = null;
  let contractLoading = true;
  let contractError = "";
  let loading = true;
  let error = "";
  let oracleRequest = 0;
  let currentSdk: any = null;
  let selectedChartMetric = "stake";

  const oracleChartMetrics = [
    { key: "stake", label: "ETC staked", unit: "ETC", color: "rgb(var(--sf-green))" },
    { key: "mana", label: "MANA", color: "rgb(96 165 250)" },
    { key: "rewards", label: "Rewards", unit: "ETC", color: "rgb(250 204 21)" },
    { key: "participants", label: "Stakers", decimals: 0, color: "rgb(244 114 182)" },
    { key: "slashed", label: "Slashed", unit: "ETC", color: "rgb(248 113 113)" },
    { key: "submissions", label: "Submissions", decimals: 0, color: "rgb(45 212 191)" },
  ];

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "Unknown";

    const units = [
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 },
    ];

    for (const unit of units) {
      if (seconds >= unit.seconds && seconds % unit.seconds === 0) {
        const value = seconds / unit.seconds;
        return `${compact(value, 0)} ${unit.label}${value === 1 ? "" : "s"}`;
      }
    }

    if (seconds >= 3600) return `${compact(seconds / 3600, 1)} hours`;
    if (seconds >= 60) return `${compact(seconds / 60, 1)} mins`;
    return `${compact(seconds, 0)} sec`;
  };

  const displayRound = (liveRound?: string, indexedRound?: number | string) => {
    const live = Number(liveRound || 0);
    if (live > 0) return compact(live, 0);
    return compact(indexedRound || 0, 0);
  };

  const loadOracleContractInfo = async (oracleAddress: string) => {
    const request = ++oracleRequest;
    contractLoading = true;
    contractError = "";
    contractInfo = null;

    try {
      if (!currentSdk) throw new Error("SDK is not ready");

      const oracleContract = currentSdk.ORACLE.attach(oracleAddress);
      const [description, frequency, currentRound] = await Promise.all([
        oracleContract.description().catch(() => ""),
        oracleContract.frequency().catch(() => null),
        oracleContract.getCurrentRound().catch(() => null),
      ]);

      const prices = (
        await Promise.all(
          Array.from({ length: 8 }, async (_, slot) => {
            try {
              const [price, decimals] = await Promise.all([
                oracleContract["lastPrice(uint8)"](slot),
                oracleContract.getDecimals(slot),
              ]);

              if (price.isZero()) return null;

              return {
                slot,
                price: formatUnits(price, decimals),
                decimals: Number(decimals),
              };
            } catch {
              return null;
            }
          })
        )
      ).filter(Boolean) as OraclePriceSlot[];

      if (request !== oracleRequest) return;

      contractInfo = {
        description,
        frequency: frequency === null ? null : Number(frequency),
        currentRound: currentRound?.toString?.() || "",
        prices,
      };
    } catch (err) {
      console.warn("Unable to load oracle contract data", err);
      if (request === oracleRequest) {
        contractError = "Unable to load live oracle price data.";
      }
    } finally {
      if (request === oracleRequest) {
        contractLoading = false;
      }
    }
  };

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    loading = true;
    error = "";
    oracle = null;
    oracleMarkets = [];

    Promise.all([
      $gqlsdk?.getOracleDetail({ id: $page.params.id }),
      $gqlsdk?.getSynths({ where: { oracle: $page.params.id.toLowerCase() } }),
    ])
      .then(async ([oracleRes, marketsRes]) => {
        oracle = oracleRes?.oracle || null;
        oracleMarkets = await Promise.all(
          (marketsRes?.synths || []).map(async (market) => ({
            ...market,
            token: await extractERC20Info(market.id),
          }))
        );
      })
      .catch((err) => {
        console.warn("Unable to load oracle detail", err);
        error = "Unable to load indexed oracle detail.";
      })
      .finally(() => {
        loading = false;
      });
  });

  const unsubscribeSdk = sdk.subscribe(($sdk) => {
    currentSdk = $sdk;
    if (currentSdk) {
      loadOracleContractInfo($page.params.id);
    }
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeSdk();
  });
  onMount(updateVc);

  $: oracleChartPoints =
    oracle?.snapshots.map((snapshot) => ({
      timestamp: Number(snapshot.timestamp || 0),
      stake: etherValue(snapshot.totalStake),
      mana: etherValue(snapshot.totalMana),
      rewards: etherValue(snapshot.totalRewardsClaimed),
      participants: Number(snapshot.participantCount || 0),
      slashed: etherValue(snapshot.totalSlashed),
      submissions: Number(snapshot.submissionCount || 0),
    })) || [];
</script>

<svelte:head>
  <title>{shortAddress($page.params.id)} Oracle | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
      <a
        class="app-muted mb-3 inline-flex items-center gap-2 text-sm font-semibold hover:text-white"
        href={navigate("/oracles", $page.url)}
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </a>
      <div class="app-label">Oracle detail</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="font-mono text-2xl font-bold lg:text-4xl">{shortAddress($page.params.id, 10)}</h1>
          <p class="app-muted mt-2">Stake, MANA, rewards, slashing, and participant history.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a
            class="btn btn-primary rounded-full"
            href={navigate(`/oracle/${$page.params.id}/deposit`, $page.url)}
          >
            Deposit
          </a>
          <a
            class="btn btn-outline rounded-full"
            href={navigate(`/oracle/${$page.params.id}/withdraw`, $page.url)}
          >
            Withdraw
          </a>
        </div>
      </div>
  </div>
</header>

<div class="lg:h-auto lg:pt-0 container-height" id="container">
  <div class="mx-auto max-w-7xl space-y-6 px-4 lg:px-0">
    {#if loading}
      <section class="app-panel rounded-lg p-8 app-muted">Loading oracle detail...</section>
    {:else if error}
      <section class="app-panel rounded-lg p-8 text-error">{error}</section>
    {:else if !oracle}
      <section class="app-panel rounded-lg p-8 app-muted">Oracle not found in the indexed schema.</section>
    {:else}
      <section class="grid gap-3 md:grid-cols-4">
        <StatCard label="ETC staked" value={`${compactEther(oracle.totalStake)} ETC`} detail="Current stake" />
        <StatCard label="Stakers" value={compact(oracle.participantCount, 0)} detail="Participants" />
        <StatCard label="MANA" value={compactEther(oracle.totalMana)} detail="Minted" />
        <StatCard label="Rewards" value={`${compactEther(oracle.totalRewardsClaimed)} ETC`} detail="Claimed" />
      </section>

      <section class="grid gap-3 md:grid-cols-4">
        <StatCard label="Slashed" value={`${compactEther(oracle.totalSlashed)} ETC`} detail="Total slashed" />
        <StatCard label="Submissions" value={compact(oracle.submissionCount, 0)} detail="Price submissions" />
        <StatCard label="Last round" value={compact(oracle.lastRound, 0)} detail="Latest indexed round" />
        <StatCard label="Last update" value={formatDate(oracle.lastSubmissionTimestamp)} detail="Submission timestamp" />
      </section>

      <section class="app-panel rounded-lg p-4">
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div class="app-label">Provided markets</div>
            <h2 class="mt-1 text-xl font-bold">Synths using this oracle</h2>
          </div>
          <div class="app-muted text-sm">{compact(oracleMarkets.length, 0)} markets</div>
        </div>

        {#if oracleMarkets.length}
          <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {#each oracleMarkets as market (market.id)}
              <a
                class="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
                href={navigate(`/markets/${market.id}`, $page.url)}
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="font-bold">{market.token?.symbol || shortAddress(market.id)}</div>
                    <div class="app-muted mt-1 text-sm">{market.token?.name || shortAddress(market.id, 10)}</div>
                  </div>
                  <span class="app-muted text-xs">{market.long ? "Long" : "Short"}</span>
                </div>
                {#if market.token?.description}
                  <p class="app-muted mt-3 text-sm">{market.token.description}</p>
                {/if}
                <div class="app-muted mt-3 font-mono text-xs">{shortAddress(market.id, 10)}</div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="app-muted mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            No indexed synth markets currently reference this oracle.
          </div>
        {/if}
      </section>

      <section class="app-panel rounded-lg p-5">
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div class="max-w-3xl">
            <div class="app-label">Price feed</div>
            <h2 class="mt-2 text-2xl font-bold">What this oracle reports</h2>
            {#if contractLoading}
              <p class="app-muted mt-3">Loading live oracle price and feed definition...</p>
            {:else if contractError}
              <p class="mt-3 text-error">{contractError}</p>
            {:else}
              <p class="app-muted mt-3">
                {contractInfo?.description ||
                  "No on-chain feed description has been published for this oracle yet."}
              </p>
              <p class="mt-4 leading-relaxed">
                The current oracle price is the latest value submitted to this oracle contract. It can be
                found on-chain by reading <span class="font-mono">lastPrice(slot)</span> from
                <span class="font-mono">{shortAddress($page.params.id, 10)}</span>; each slot is scaled by
                its own <span class="font-mono">getDecimals(slot)</span> value. This page displays every
                active price slot with a non-zero latest price.
              </p>
            {/if}
          </div>

          <div class="grid min-w-full gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            <StatCard
              label="Current round"
              value={displayRound(contractInfo?.currentRound, oracle.lastRound)}
              detail={Number(contractInfo?.currentRound || 0) > 0 ? "On-chain round" : "Latest indexed round"}
            />
            <StatCard
              label="Frequency"
              value={formatDuration(contractInfo?.frequency)}
              detail="Round cadence"
            />
          </div>
        </div>

        {#if !contractLoading && !contractError}
          <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {#if contractInfo?.prices.length}
              {#each contractInfo.prices as price (price.slot)}
                <div class="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div class="app-label">Slot {price.slot}</div>
                  <div class="mt-2 break-words font-mono text-2xl font-bold">{price.price}</div>
                  <div class="app-muted mt-2 text-sm">{price.decimals} decimals</div>
                </div>
              {/each}
            {:else}
              <div class="app-muted rounded-lg border border-white/10 bg-white/[0.03] p-4">
                No non-zero oracle price has been reported yet.
              </div>
            {/if}
          </div>
        {/if}
      </section>

      <TimeSeriesChart
        title="Oracle history"
        points={oracleChartPoints}
        metrics={oracleChartMetrics}
        bind:selected={selectedChartMetric}
      />

      <section class="grid gap-4 lg:grid-cols-2">
        <div class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Top participants</div>
          </div>
          <div class="max-h-[420px] overflow-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Stake</th>
                  <th>MANA</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {#each oracle.participants as participant (participant.id)}
                  <tr>
                    <td class="font-mono">{shortAddress(String(participant.user))}</td>
                    <td>{compactEther(participant.stake)} ETC</td>
                    <td>{compactEther(participant.mana)}</td>
                    <td>{compactEther(participant.rewardsClaimed)} ETC</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <div class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Recent stake events</div>
          </div>
          <div class="max-h-[420px] overflow-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {#each oracle.stakeEvents as event (event.id)}
                  <tr>
                    <td>{event.deposit ? "Deposit" : "Withdraw"}</td>
                    <td class="font-mono">{shortAddress(String(event.user))}</td>
                    <td>{compactEther(event.amount)} ETC</td>
                    <td>{formatDate(event.timestamp)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        <div class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Recent rewards</div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {#each oracle.rewardEvents as event (event.id)}
                <tr>
                  <td class="font-mono">{shortAddress(String(event.owner))}</td>
                  <td>{compactEther(event.amount)} ETC</td>
                  <td>{formatDate(event.timestamp)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Recent slashing</div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Round</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {#each oracle.slashEvents as event (event.id)}
                <tr>
                  <td class="font-mono">{shortAddress(String(event.owner))}</td>
                  <td>{compact(event.round, 0)}</td>
                  <td>{compactEther(event.amount)} ETC</td>
                  <td>{formatDate(event.timestamp)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}
  </div>
</div>
