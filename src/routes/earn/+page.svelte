<script lang="ts">
  import { page } from "$app/stores";

  import Market from "./market/index.svelte";
  import OTC from "./otc/index.svelte";

  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "market";
</script>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
