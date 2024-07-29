<script lang="ts">
  import { page } from "$app/stores";
  import Market from "./market/index.svelte";
  import OTC from "./otc/index.svelte";

  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "market";
</script>

<div
  class="px-8 lg:px-0 lg:w-1/3 w-full lg:pt-0 pt-20 m-auto lg:mt-40 flex justify-between items-center lg:relative fixed lg:backdrop-filter-none backdrop-blur-xl"
  id="top"
>
  <h1 class="text-3xl">Swap</h1>
</div>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
