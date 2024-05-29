<script lang="ts">
  import { page } from "$app/stores";
  import Market from "./market/index.svelte";
  import OTC from "./otc/index.svelte";

  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "otc";
</script>

<div
  class="px-8 lg:px-0 lg:w-1/3 m-auto mt-20 lg:mt-40 flex justify-between items-center"
>
  <h1 class="text-3xl">Swap</h1>
</div>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
