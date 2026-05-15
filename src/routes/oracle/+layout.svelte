<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { ORACLES_NAMES } from "src/hooks/sf/oracle";

  $: console.log($page.params.address);
</script>

<div
  class="app-page-header px-2 lg:px-0 lg:w-1/2 w-full m-auto lg:pt-0 pt-14 lg:mb-4 lg:mt-40 lg:relative fixed"
  id="top"
>
  {#if $page.params.address}
    <!-- <CoinIcon symbol="ETC" /> -->
    <h1 class="text-3xl p-4 lg:px-6 pl-6 mt-2 flex items-center w-full gap-4 font-semibold">
      <a href="/oracle" class=""
        ><Icon icon="ph-arrow-left-bold" class="text-2xl" /></a
      >
      {ORACLES_NAMES[$page.params.address]}
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
