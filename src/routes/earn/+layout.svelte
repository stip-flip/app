<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePositionsStats } from "src/hooks/sf/position";
  import { commify } from "src/lib";
  import { navigate } from "src/lib/path";
  import { appMode } from "src/stores";

  $: url = new URL($page.url);
  $: requestedMode = url.searchParams.get("mode");
  $: if (requestedMode === "market" || requestedMode === "otc") {
    appMode.set(requestedMode);
  }

  $: mode = $appMode;

  $: add = url.pathname.includes("add");
</script>

<div
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <h1
    class="py-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"
    class:hidden={$page.url.pathname.includes("add")}
  >
    <span class="block">
      <span class="app-label block">
        {mode == "otc" ? "Protocol liquidity" : "Secondary liquidity"}
      </span>
      <span class="mt-2 block text-2xl font-bold lg:text-4xl">
        Back tokenized exposure
      </span>
      <span class="app-muted mt-2 block max-w-2xl text-sm lg:text-base">
        {mode == "otc"
          ? "Provide collateral depth for issuance and redemption against canonical settlement rounds."
          : "Provide secondary-market depth for position tokens that can move outside the core protocol."}
      </span>
    </span>
    <a
      class="btn btn-primary rounded-full"
      id="new-position"
      href={navigate("/earn/add", url)}>New position</a
    >
  </h1>
  {#if !add}
    {#if mode == "otc"}
      <div
        class="grid gap-3 pb-4 sm:grid-cols-3"
      >
        <div class="earn-metric" id="deposits">
          <div class="app-label">Deposited collateral</div>
          <div class="mt-2 flex items-center gap-2 text-xl font-bold">
            <CoinIcon symbol="ETC" className="text-2xl" />
            {commify(formatEther($usePositionsStats?.totalDeposited || "0"))}
          </div>
        </div>
        <div class="earn-metric" id="apy">
          <div class="app-label">Protocol yield</div>
          <div class="mt-2 text-xl font-bold">
            {commify($usePositionsStats?.APY / 100 || 0, 2)}%
          </div>
        </div>
        <div class="earn-metric" id="pnl">
          <div class="app-label">Liquidity PnL</div>
          <div class="mt-2 flex items-center gap-2 text-xl font-bold">
            <CoinIcon className="text-2xl" symbol="ETC" />
            {commify(formatEther($usePositionsStats?.pnl || "0"))}
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div
      class="mx-auto flex max-w-7xl items-center justify-between py-4"
    >
      <a class="app-muted inline-flex items-center gap-2 text-sm font-semibold hover:text-white" href="/">
        <Icon icon="ph-arrow-left-bold" class="text-2xl" />
        <span>Markets</span>
      </a>
      <div class="text-right">
        <div class="app-label">
          {mode == "otc" ? "Protocol liquidity" : "Secondary liquidity"}
        </div>
        <h1 class="text-lg font-bold lg:text-2xl">Back tokenized exposure</h1>
      </div>
    </div>
  {/if}
</div>

<slot />

<style>
  .earn-metric {
    border: 1px solid rgb(var(--sf-border) / 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    background: rgb(255 255 255 / 0.035);
  }

  :global([data-theme="light"]) .earn-metric {
    border-color: rgb(var(--sf-border) / 0.14);
    background: rgb(255 255 255 / 0.56);
  }
</style>
