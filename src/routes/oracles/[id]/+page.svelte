<script lang="ts">
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
  import Sparkline from "src/components/sparkline.svelte";
  import StatCard from "src/components/stat-card.svelte";
  import type { GetOracleDetailQuery } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import { compact, compactEther, etherValue, formatDate, shortAddress } from "src/lib/stats";
  import { gqlsdk } from "src/stores";

  let oracle: GetOracleDetailQuery["oracle"] = null;
  let loading = true;
  let error = "";

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    loading = true;
    error = "";
    $gqlsdk
      ?.getOracleDetail({ id: $page.params.id })
      .then((res) => {
        oracle = res.oracle || null;
      })
      .catch((err) => {
        console.warn("Unable to load oracle detail", err);
        error = "Unable to load indexed oracle detail.";
      })
      .finally(() => {
        loading = false;
      });
  });

  onDestroy(unsubscribe);
  onMount(updateVc);

  $: stakeSeries = oracle?.snapshots.map((snapshot) => etherValue(snapshot.totalStake)) || [];
  $: manaSeries = oracle?.snapshots.map((snapshot) => etherValue(snapshot.totalMana)) || [];
  $: rewardsSeries = oracle?.snapshots.map((snapshot) => etherValue(snapshot.totalRewardsClaimed)) || [];
  $: participantSeries = oracle?.snapshots.map((snapshot) => Number(snapshot.participantCount || 0)) || [];
</script>

<svelte:head>
  <title>{shortAddress($page.params.id)} Oracle | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
      <div class="app-label">Oracle detail</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="font-mono text-2xl font-bold lg:text-4xl">{shortAddress($page.params.id, 10)}</h1>
          <p class="app-muted mt-2">Stake, MANA, rewards, slashing, and participant history.</p>
        </div>
        <a class="btn btn-outline rounded-full" href="/oracles">All oracles</a>
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

      <section class="grid gap-4 lg:grid-cols-4">
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">ETC staked</div>
          <Sparkline values={stakeSeries} label="Oracle stake over time" />
        </div>
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">MANA</div>
          <Sparkline values={manaSeries} label="Oracle MANA over time" />
        </div>
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">Rewards</div>
          <Sparkline values={rewardsSeries} label="Oracle rewards over time" />
        </div>
        <div class="app-panel rounded-lg p-4">
          <div class="app-label">Stakers</div>
          <Sparkline values={participantSeries} label="Oracle participants over time" />
        </div>
      </section>

      <section class="grid gap-3 md:grid-cols-4">
        <StatCard label="Slashed" value={`${compactEther(oracle.totalSlashed)} ETC`} detail="Total slashed" />
        <StatCard label="Submissions" value={compact(oracle.submissionCount, 0)} detail="Price submissions" />
        <StatCard label="Last round" value={compact(oracle.lastRound, 0)} detail="Latest indexed round" />
        <StatCard label="Last update" value={formatDate(oracle.lastSubmissionTimestamp)} detail="Submission timestamp" />
      </section>

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
