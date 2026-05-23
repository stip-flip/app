<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { appTour, pageTour } from "src/lib/driver/index";

  $: pageName = $page.route.id?.split("/")[1];
</script>

{#if pageName}
  <div class="support-dropdown dropdown dropdown-top dropdown-end lg:flex hidden">
    <button
      tabindex="0"
      type="button"
      class="support-trigger app-nav"
      aria-label="Support"
    >
      <Icon icon="mdi:help-circle-outline" class="support-trigger__icon" />
      <span>Support</span>
    </button>
    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow mb-4">
      <li><button type="button" on:click={() => appTour.drive()}>App Tour</button></li>
      <li><button type="button" on:click={() => pageTour(pageName).drive()}>Page Tour</button></li>
      <li><a href="https://docs.stipflip.xyz">Documentation</a></li>
    </ul>
  </div>
{/if}

<style>
  .support-dropdown {
    width: 100%;
    justify-content: flex-end;
  }

  .support-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 2.5rem;
    padding: 0 0.85rem;
    border-radius: 9999px;
    color: hsl(var(--bc) / 0.82);
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    border: 1px solid rgb(255 255 255 / 0.1);
    transition:
      color 160ms ease,
      background-color 160ms ease,
      transform 160ms ease;
  }

  .support-trigger:hover,
  .support-trigger:focus-visible {
    color: hsl(var(--bc));
    background: rgb(var(--sf-green) / 0.1);
  }

  .support-trigger:focus-visible {
    outline: 2px solid rgb(var(--sf-green) / 0.72);
    outline-offset: 3px;
  }

  :global(.support-trigger__icon) {
    width: 1.25rem;
    height: 1.25rem;
    color: hsl(var(--p));
    flex: none;
  }
</style>
