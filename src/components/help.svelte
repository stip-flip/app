<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { appTour, pageTour } from "src/lib/driver/index";
  import { onMount } from "svelte";
  import { connected } from "svelte-ethers-store";

  $: url = new URL($page.url);
  $: console.log($page.route.id?.split("/")[1]);
  $: pageName = $page.route.id?.split("/")[1];
</script>

{#if pageName}
  <div class="dropdown dropdown-top dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="text-primary border border-primary flex items-center mx-2 relative menu menu-md menu-horizontal bg-gradient rounded-full bg-opacity-50 lg:bg-gradient p-0"
    >
      <Icon icon="mdi:help" class="text-xl m-2" />
      <p class="pr-4 text-l">Support</p>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow mb-4"
    >
      <li><a on:click={(_) => appTour.drive()}>App Tour</a></li>
      <li><a on:click={(_) => pageTour(pageName).drive()}> Page Tour</a></li>
      <li><a href="https://docs.sf.exchange">Documentation</a></li>
    </ul>
  </div>
{/if}
