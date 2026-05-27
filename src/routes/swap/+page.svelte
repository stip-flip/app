<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { appMode } from "src/stores";
  import Market from "./market/index.svelte";
  import OTC from "./otc/index.svelte";

  $: requestedMode = $page.url.searchParams.get("mode");
  $: if (requestedMode === "market" || requestedMode === "otc") {
    appMode.set(requestedMode);
  }

  $: mode = $appMode;
</script>

<div
  class="app-page-header px-8 lg:px-0 lg:w-1/3 w-full lg:pt-0 pt-20 m-auto lg:mt-40 lg:relative fixed"
  id="top"
>
  <div class="py-4">
    <a class="app-muted mb-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-white" href="/">
      <Icon icon="ph-arrow-left-bold" class="text-xl" />
      <span>Markets</span>
    </a>
    <p class="app-label">{mode == "otc" ? "Issuance and redemption" : "Secondary trading"}</p>
    <h1 class="text-3xl font-semibold">Swap position tokens</h1>
    <p class="app-muted mt-2 text-sm">
      {mode == "otc"
        ? "OTC mints or redeems tokenized exposure against protocol collateral."
        : "Market mode trades existing position tokens while settlement remains canonical."}
    </p>
  </div>
</div>

{#if mode == "otc"}
  <OTC />
{:else}
  <Market />
{/if}
