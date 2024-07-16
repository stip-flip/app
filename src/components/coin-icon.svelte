<script lang="ts">
  import Icon from "@iconify/svelte";
  export let symbol: string = "";
  export let className: string = "";

  console.log(symbol);
</script>

{#if symbol == "ETC"}
  <Icon icon="mdi:ethereum" class="text-green-600 text-2xl {className}" />
{:else}
  <img
    src="/{symbol}.svg"
    class="w-6 h-6 {className}"
    alt="{symbol} icon"
    onerror="this.src='/default-icon.svg'"
  />
{/if}
