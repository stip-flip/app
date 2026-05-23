<script lang="ts">
  import { appMode } from "src/stores";
  import Market from "../market/add/index.svelte";
  import OTC from "../otc/add/index.svelte";

  $: mode = $appMode;
</script>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
