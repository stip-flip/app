<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { ORACLES_NAMES } from "src/hooks/sf/oracle";

  $: console.log($page.params.address);
</script>

<div
  class="px-2 lg:px-0 lg:w-1/2 w-full m-auto lg:pt-0 pt-14 lg:mb-4 lg:mt-40 lg:relative fixed lg:backdrop-filter-none backdrop-blur-xl"
  id="top"
>
  {#if $page.params.address}
    <!-- <CoinIcon symbol="ETC" /> -->
    <h1 class="text-3xl p-4 lg:px-6 pl-6 mt-2 flex items-center w-full gap-4">
      <a href="/oracle" class=""
        ><Icon icon="ph-arrow-left-bold" class="text-2xl" /></a
      >
      {ORACLES_NAMES[$page.params.address]}
    </h1>
  {:else}
    <h1
      class="text-3xl p-4 lg:px-6 pl-6 mt-2 flex justify-between items-center w-full"
    >
      Oracles
    </h1>
  {/if}
  <!-- <h1 class="text-3xl">Oracles</h1> -->
</div>

<slot />
