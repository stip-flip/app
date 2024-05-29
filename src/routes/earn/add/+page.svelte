<script lang="ts">
  import { page } from "$app/stores";
  import Market from "../market/add/index.svelte";
  import OTC from "../otc/add/index.svelte";

  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "otc";

  $: console.log(mode);
</script>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
