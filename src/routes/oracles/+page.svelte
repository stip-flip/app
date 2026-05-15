<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";
  import StatCard from "src/components/stat-card.svelte";
  import type { OracleSummaryFragmentFragment } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import { compact, compactEther, etherValue, formatDate, shortAddress } from "src/lib/stats";
  import { gqlsdk, sdk } from "src/stores";

  let oracles: OracleSummaryFragmentFragment[] = [];
  let loading = true;
  let error = "";

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    loading = true;
    error = "";
    $gqlsdk
      ?.getOracleSummaries({ first: 1000 })
      .then((res) => {
        oracles = res.oracles;
      })
      .catch((err) => {
        console.warn("Unable to load oracle summaries", err);
        error = "Unable to load indexed oracle data.";
      })
      .finally(() => {
        loading = false;
      });
  });

  onDestroy(unsubscribe);
  onMount(updateVc);

  $: fallbackOracle = $sdk?.ORACLE?.address
    ? {
        id: $sdk.ORACLE.address,
        name: "Crypto",
        totalStake: 0,
        totalMana: 0,
        totalRewardsClaimed: 0,
        totalSlashed: 0,
        submissionCount: 0,
        participantCount: 0,
        lastRound: 0,
        lastSubmissionTimestamp: 0,
        latestSnapshots: [],
        fallback: true,
      }
    : null;

  $: displayedOracles = fallbackOracle
    ? [
        ...oracles,
        ...(oracles.some(
          (oracle) => oracle.id.toLowerCase() === fallbackOracle.id.toLowerCase()
        )
          ? []
          : [fallbackOracle]),
      ]
    : oracles;

  $: totalStake = displayedOracles.reduce((sum, oracle) => sum + etherValue(oracle.totalStake), 0);
  $: totalMana = displayedOracles.reduce((sum, oracle) => sum + etherValue(oracle.totalMana), 0);
  $: totalParticipants = displayedOracles.reduce((sum, oracle) => sum + Number(oracle.participantCount || 0), 0);
</script>

<svelte:head>
  <title>Oracles | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
      <div class="app-label">Settlement inputs</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="text-3xl font-bold lg:text-5xl">Oracles</h1>
          <p class="app-muted mt-2 max-w-2xl">
            General view of every oracle securing market settlement, with staking actions in one place.
          </p>
        </div>
        <a class="btn btn-outline rounded-full" href="/markets">View markets</a>
      </div>
  </div>
</header>

<div class="lg:h-auto lg:pt-0 container-height" id="container">
  <div class="mx-auto max-w-7xl space-y-6 px-4 lg:px-0">
    <section class="grid gap-3 md:grid-cols-4">
      <StatCard label="Oracles" value={String(displayedOracles.length)} detail="Contracts available" />
      <StatCard label="ETC staked" value={`${compact(totalStake)} ETC`} detail="Across all oracles" />
      <StatCard label="Participants" value={compact(totalParticipants, 0)} detail="Unique oracle stakers" />
      <StatCard label="MANA" value={compact(totalMana)} detail="Total minted" />
    </section>

    <section class="app-panel overflow-hidden rounded-lg">
      {#if loading}
        <div class="p-8 app-muted">Loading oracles from the subgraph...</div>
      {:else if error}
        <div class="p-8 text-error">{error}</div>
      {:else if displayedOracles.length === 0}
        <div class="p-8 app-muted">No oracles have been indexed yet.</div>
      {:else}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Oracle</th>
                <th>ETC staked</th>
                <th>Stakers</th>
                <th>MANA</th>
                <th>Rewards</th>
                <th>Slashed</th>
                <th>Submissions</th>
                <th>Last round</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each displayedOracles as oracle (oracle.id)}
                <tr class="hover">
                  <td>
                    <a
                      class="font-mono font-bold text-primary"
                      href={oracle.fallback ? `/oracle/${oracle.id}/deposit` : `/oracles/${oracle.id}`}
                    >
                      {oracle.name || shortAddress(oracle.id)}
                    </a>
                    {#if oracle.fallback}
                      <div class="app-muted text-xs font-normal">Indexing pending</div>
                    {:else}
                      <div class="app-muted text-xs font-mono">{shortAddress(oracle.id)}</div>
                    {/if}
                  </td>
                  <td>{compactEther(oracle.totalStake)} ETC</td>
                  <td>{compact(oracle.participantCount, 0)}</td>
                  <td>{compactEther(oracle.totalMana)}</td>
                  <td>{compactEther(oracle.totalRewardsClaimed)} ETC</td>
                  <td>{compactEther(oracle.totalSlashed)} ETC</td>
                  <td>{compact(oracle.submissionCount, 0)}</td>
                  <td>{compact(oracle.lastRound, 0)}</td>
                  <td>{formatDate(oracle.lastSubmissionTimestamp)}</td>
                  <td>
                    <div class="flex min-w-44 gap-2">
                      <a class="btn btn-primary btn-sm rounded-full" href={`/oracle/${oracle.id}/deposit`}>
                        <Icon icon="mdi:arrow-down-circle-outline" />
                        Stake
                      </a>
                      <a class="btn btn-outline btn-sm rounded-full" href={`/oracle/${oracle.id}/withdraw`}>
                        Withdraw
                      </a>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  </div>
</div>
