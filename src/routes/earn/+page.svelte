<script lang="ts">
  import { appMode } from "src/stores";

  import Market from "./market/index.svelte";
  import OTC from "./otc/index.svelte";

  $: mode = $appMode;
</script>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
