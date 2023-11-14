<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

<div class="root full-height overflow-scroll">
  <div
    style="border-radius: 500px 220px;"
    class="animated fixed bottom-48 left-28 p-24 bg-gradient border-2"
  >
    <h1 class="text-7xl font-bold ml-12">Stip & Flip</h1>
    <h2 class="mt-8 text-4xl text-base-content">
      Decentralised & Permissionless Perpetual Markets
    </h2>
    <div class="flex space-x-2 mt-8 -ml-8">
      <Icon class="text-4xl" icon="mdi:twitter" />
      <Icon class="text-4xl" icon="mdi:github" />
    </div>
  </div>
</div>

<style>
  /* Define the keyframe animation */
  @keyframes color-animation {
    0% {
      border-color: linear-gradient(to bottom, #3774d6, white);
    }
    50% {
      border-color: linear-gradient(to bottom, white, #3774d6);
    }
    100% {
      border-color: linear-gradient(to bottom, #3774d6, white);
    }
  }

  /* Apply the animation to the element */
  .animated {
    animation: color-animation 2s ease infinite;
  }
</style>
