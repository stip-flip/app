<script lang="ts">
  import { appMode, type AppMode } from "src/stores";

  $: mode = $appMode;

  function setMode(mode: AppMode) {
    appMode.set(mode);
  }
</script>

<ul
  class="relative menu menu-md menu-horizontal app-nav rounded-full p-0"
  id="modes"
>
  <!-- Navbar menu content here -->
  <div
    class="absolute w-1/2 h-full rounded-full transition-all left-1/2 selected"
    class:!left-0={mode == "market"}
  ></div>
  <li id="market-mode">
    <button
      type="button"
      on:click={() => setMode("market")}
      class="rounded-full w-20 text-center block"
      class:text-primary={mode == "market"}
    >
      Market
    </button>
  </li>
  <li id="otc-mode">
    <button
      type="button"
      on:click={() => setMode("otc")}
      class="rounded-full w-20 text-center block"
      class:text-primary={mode == "otc"}
    >
      OTC
    </button>
  </li>
</ul>

<style>
  .selected {
    background: hsl(var(--bc) / 0.08);
  }
</style>
