<script lang="ts">
  import { page } from "$app/stores";
</script>

<div
  class="px-8 lg:px-0 lg:w-1/2 m-auto mt-32 mb-4 lg:mt-40 flex justify-between items-center"
>
  <h1 class="text-3xl">Earn</h1>
  <ul
    class="relative menu menu-md menu-horizontal bg-gradient rounded-full bg-opacity-50 lg:bg-gradient p-0"
  >
    <!-- Navbar menu content here -->
    <div
      class="absolute w-1/2 h-full border border-primary rounded-full transition-all"
      class:right-0={$page.route?.id?.includes("market")}
    ></div>
    <li>
      <a href={"/earn/otc"} class="rounded-full w-20 text-center block">
        OTC
      </a>
    </li>
    <li>
      <a href={"/earn/market"} class="rounded-full w-20 text-center block">
        Market
      </a>
    </li>
  </ul>
</div>
<slot />
