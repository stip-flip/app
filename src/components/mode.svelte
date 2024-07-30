<script lang="ts">
  import { page } from "$app/stores";
  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "market";

  $: console.log(mode);
</script>

<ul
  class="relative menu menu-md menu-horizontal bg-gradient rounded-full bg-opacity-50 p-0 shadow-sm shadow-base-content"
  id="modes"
>
  <!-- Navbar menu content here -->
  <div
    class="absolute w-1/2 h-full rounded-full transition-all left-1/2 selected"
    class:!left-0={mode == "market"}
  ></div>
  <li id="market-mode">
    <a
      href={url.pathname + `/?mode=market`}
      class="rounded-full w-20 text-center block"
      class:text-primary={mode == "market"}
    >
      Market
    </a>
  </li>
  <li id="otc-mode">
    <a
      href={url.pathname + `/?mode=otc`}
      class="rounded-full w-20 text-center block"
      class:text-primary={mode == "otc"}
    >
      OTC
    </a>
  </li>
</ul>

<style>
  .selected {
    background: hsl(var(--bc) / 0.08);
  }
</style>
