<script lang="ts">
  export let label = "";
  export let value = "";
  export let detail = "";
</script>

<div class="app-panel rounded-lg p-4">
  <div class="app-label">{label}</div>
  <div class="mt-3 text-2xl font-bold">{value}</div>
  {#if detail}
    <div class="app-muted mt-1 text-sm">{detail}</div>
  {/if}
</div>
