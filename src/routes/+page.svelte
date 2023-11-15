<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

<div class="root full-height overflow-scroll">
  <div
    class="round mt-48 text-center lg:text-start lg:mt-0 lg:fixed lg:bottom-48 lg:left-28 lg:p-24 lg:bg-gradient lg:border-2"
  >
    <h1 class="text-7xl font-bold lg:ml-12">Stip & Flip</h1>
    <h2 class="mt-8 text-4xl text-base-content">
      Decentralised & Permissionless Perpetual Markets
    </h2>
    <div class="flex justify-center lg:justify-start space-x-2 mt-8 lg:-ml-8">
      <Icon class="text-4xl" icon="mdi:twitter" />
      <Icon class="text-4xl" icon="mdi:github" />
    </div>
  </div>
</div>

<style>
  .round {
    border-top-left-radius: 30rem;
    border-top-right-radius: 8rem;
    border-bottom-right-radius: 30rem;
    border-bottom-left-radius: 8rem;
  }
</style>
