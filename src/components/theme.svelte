<script lang="ts">
  import "../app.css";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  import Icon from "@iconify/svelte";
  let theme = "light";

  onMount(() => {
    if (localStorage.getItem("theme")) {
      theme = localStorage.getItem("theme");
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", localStorage.getItem("theme"));
    }
  });

  $: {
    if (browser) {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme);
    }
  }

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
    <Icon icon="ph:moon-bold" class="lg:text-3xl text-5xl text-primary" />
  {:else if theme === "light"}
    <Icon icon="ph:sun-bold" class="lg:text-3xl text-5xl text-primary" />
  {/if}
</button>
