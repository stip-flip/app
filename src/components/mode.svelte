<script lang="ts">
  import { page } from "$app/stores";
  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "otc";

  $: console.log(mode);
</script>

<ul
  class="relative menu menu-md menu-horizontal bg-gradient rounded-full bg-opacity-50 lg:bg-gradient p-0"
  id="modes"
>
  <!-- Navbar menu content here -->
  <div
    class="absolute w-1/2 h-full border border-primary rounded-full transition-all"
    class:right-0={mode == "market"}
  ></div>
  <li id="otc-mode">
    <a
      href={url.pathname + `/?mode=otc`}
      class="rounded-full w-20 text-center block"
      class:selected={mode == "otc"}
    >
      OTC
    </a>
  </li>
  <li id="market-mode">
    <a
      href={url.pathname + `/?mode=market`}
      class="rounded-full w-20 text-center block"
      class:selected={mode == "market"}
    >
      Market
    </a>
  </li>
</ul>

<style>
  .selected {
    background: hsl(var(--bc) / 0.08);
  }
</style>
