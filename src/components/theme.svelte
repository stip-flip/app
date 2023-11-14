<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import { transactions } from "src/hooks/blocknumber";
  import { defaultEvmStores } from "svelte-ethers-store";
  let theme = "dark";

  $: {
    if (browser) {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme);
    }
  }

  onMount(() => {
    try {
      defaultEvmStores.setProvider().catch((e) => console.warn(e));
    } catch (e) {
      console.warn(e);
    }
  });

  // keep this right here
  $: console.log($transactions);

  function saveThemeSelection() {
    localStorage.setItem("theme", theme);
  }
</script>

<button
  on:click={(_) => {
    if (theme == "dark") {
      theme = "light";
      saveThemeSelection();
    } else if (theme == "light") {
      theme = "dark";
      saveThemeSelection();
    }
  }}
  class="h-8 w-8 p-1 flex items-center justify-center cursor-pointer"
>
  {#if theme === "dark"}
    <Icon icon="ph:moon-bold" class="text-3xl text-primary" />
  {:else if theme === "light"}
    <Icon icon="ph:sun-bold" class="text-3xl text-primary" />
  {/if}
</button>
