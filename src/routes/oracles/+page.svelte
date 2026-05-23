<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import StatCard from "src/components/stat-card.svelte";
  import type { OracleSummaryFragmentFragment } from "src/hooks/subgraph";
  import { updateVc } from "src/lib";
  import { compact, compactEther, etherValue, formatDate, shortAddress } from "src/lib/stats";
  import { gqlsdk, sdk } from "src/stores";

  type OracleSummary = OracleSummaryFragmentFragment & {
    name?: string;
  };

  let oracles: OracleSummary[] = [];
  let loading = true;
  let error = "";
  let oracleLoadId = 0;

  async function getOracleMetadata(id: string) {
    const ethsdk = get(sdk);
    if (!ethsdk) return {};

    const oracle = ethsdk.ORACLE.attach(id);
    const description = await oracle.description().catch(() => "");

    return {
      name: oracleListName(description),
    };
  }

  function oracleListName(description: string) {
    const firstLine = description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    const name = firstLine?.startsWith("Oracle:") ? firstLine.slice("Oracle:".length).trim() : firstLine;

    if (!name) return undefined;
    return name.length > 64 ? `${name.slice(0, 61)}...` : name;
  }

  const unsubscribe = gqlsdk.subscribe(($gqlsdk) => {
    const loadId = ++oracleLoadId;
    loading = true;
    error = "";
    oracles = [];
    $gqlsdk
      ?.getOracleSummaries({ first: 1000 })
      .then(async (res) => {
        const nextOracles = await Promise.all(
          res.oracles.map(async (oracle) => ({
            ...oracle,
            ...(await getOracleMetadata(oracle.id).catch((err) => {
              console.warn("Unable to load oracle metadata", oracle.id, err);
              return {};
            })),
          }))
        );
        if (loadId === oracleLoadId) {
          oracles = nextOracles;
        }
      })
      .catch((err) => {
        if (loadId !== oracleLoadId) return;
        console.warn("Unable to load oracle summaries", err);
        error = "Unable to load indexed oracle data.";
      })
      .finally(() => {
        if (loadId === oracleLoadId) {
          loading = false;
        }
      });
  });

  onDestroy(unsubscribe);
  onMount(updateVc);

  $: displayedOracles = oracles;

  $: totalStake = displayedOracles.reduce((sum, oracle) => sum + etherValue(oracle.totalStake), 0);
  $: totalMana = displayedOracles.reduce((sum, oracle) => sum + etherValue(oracle.totalMana), 0);
  $: totalParticipants = displayedOracles.reduce((sum, oracle) => sum + Number(oracle.participantCount || 0), 0);

  function openOracle(id: string) {
    window.location.href = `/oracles/${id}`;
  }

  function openOracleFromKeyboard(event: KeyboardEvent, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOracle(id);
    }
  }
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
        <a class="btn btn-primary rounded-full" href="/oracles/create">
          Create oracle
        </a>
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
                <tr
                  class="hover cursor-pointer"
                  role="link"
                  tabindex="0"
                  on:click={() => openOracle(oracle.id)}
                  on:keydown={(event) => openOracleFromKeyboard(event, oracle.id)}
                >
                  <td>
                    <a
                      class="font-mono font-bold text-primary"
                      href={`/oracles/${oracle.id}`}
                      on:click|stopPropagation
                    >
                      {oracle.name || shortAddress(oracle.id)}
                    </a>
                    <div class="app-muted text-xs font-mono">{shortAddress(oracle.id)}</div>
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
                      <a class="btn btn-primary btn-sm rounded-full" href={`/oracle/${oracle.id}/deposit`} on:click|stopPropagation>
                        <Icon icon="mdi:arrow-down-circle-outline" />
                        Stake
                      </a>
                      <a class="btn btn-outline btn-sm rounded-full" href={`/oracle/${oracle.id}/withdraw`} on:click|stopPropagation>
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
