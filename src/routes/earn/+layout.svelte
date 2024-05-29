<script lang="ts">
  import { page } from "$app/stores";
</script>

<div
  class="px-8 lg:px-0 lg:w-1/2 m-auto mt-32 mb-4 lg:mt-40 flex justify-between items-center"
>
  <h1 class="text-3xl" class:hidden={$page.url.pathname.includes("add")}>
    Earn
  </h1>
</div>
<slot />
