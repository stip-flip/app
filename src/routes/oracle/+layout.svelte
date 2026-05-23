<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { ORACLES_NAMES } from "src/hooks/sf/oracle";
  import { navigate } from "src/lib/path";
  import { shortAddress } from "src/lib/stats";

  $: oracleTitle = ORACLES_NAMES[$page.params.address] || shortAddress($page.params.address, 10);
</script>

<div
  class="app-page-header px-2 lg:px-0 lg:w-1/2 w-full m-auto lg:pt-0 pt-14 lg:mb-4 lg:mt-40 lg:relative fixed"
  id="top"
>
  {#if $page.params.address}
    <!-- <CoinIcon symbol="ETC" /> -->
    <h1 class="p-4 lg:px-6 pl-6 mt-2 flex items-center w-full gap-4">
      <a href={navigate("/oracles", $page.url)} class="btn btn-ghost btn-square rounded-full" aria-label="Back to oracles">
        <Icon icon="ph-arrow-left-bold" class="text-2xl" />
      </a>
      <span class="min-w-0">
        <span class="app-label block">Oracle stake</span>
        <span class="block truncate font-mono text-2xl font-semibold lg:text-3xl">{oracleTitle}</span>
      </span>
    </h1>
  {:else}
    <h1
      class="p-4 lg:px-6 pl-6 mt-2 w-full"
    >
      <span class="app-label block">Open protocol role</span>
      <span class="text-3xl font-semibold block">Submit settlement prices</span>
      <span class="app-muted mt-2 block text-sm">
        Oracle participants keep collateral, funding, and settlement aligned with market data.
      </span>
    </h1>
  {/if}
  <!-- <h1 class="text-3xl">Oracles</h1> -->
</div>

<slot />
