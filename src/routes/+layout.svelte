<script lang="ts">
  import { page } from "$app/stores";
  import "driver.js/dist/driver.css";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import Logo from "src/components/logo.svelte";
  import Theme from "src/components/theme.svelte";
  import WalletDrawer from "src/components/wallet-drawer.svelte";
  import Wallet from "src/components/wallet.svelte";
  import {
    pendingTransactions,
    resolvedTransactions,
    transactions,
  } from "src/hooks/transactions";
  import { connectMetamask } from "src/lib";
  import { chainId, connected } from "svelte-ethers-store";
  import { quintOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  let overlay: HTMLAreaElement;

  let lastResolvedIndex = 0;

  onMount(() => {
    try {
      console.log(window.ethereum.selectedAddress);
      connectMetamask();
      // defaultEvmStores.setProvider().catch((e) => console.warn(e));
    } catch (e) {
      console.warn(e);
    }
  });

  // keep this right here
  $: console.log($transactions);
  $: console.log($resolvedTransactions);

  $: homepage = $page.route.id == "/";

  $: {
    if (!!$resolvedTransactions[lastResolvedIndex]) {
      setTimeout(() => {
        lastResolvedIndex++;
      }, 5000);
    }
  }

  let docurl = "https://sf-doc.vercel.app/docs";

  const idToChain: any = {
    61: "etc",
    63: "etc-mordor",
  };
</script>

{#each $pendingTransactions as pt (pt.hash)}
  <div
    class="toast z-10"
    transition:fly={{
      delay: 0,
      duration: 1000,
      x: 500,
      y: 0,
      opacity: 0.5,
      easing: quintOut,
    }}
  >
    <div
      class="alert alert-info block space-x-2 w-62 h-24"
      class:flex={!!pt.resolved && pt.status == 1}
      class:alert-success={pt.status == 1}
    >
      {#if pt.status == 1 && pt.resolved}
        <Icon
          icon="mdi:check"
          class="text-3xl text-white bg-primary rounded-full"
        />
        <div class="inline text-base">
          {@html $resolvedTransactions[lastResolvedIndex]?.resolved}
        </div>
      {:else}
        <div class="text-base-200">{pt.label}</div>
        {#if pt.status == 1}
          <progress
            class="progress progress-success w-56 opa"
            value="100"
            max="100"
          />
        {:else}
          <progress class="progress w-56" />
        {/if}
        <a
          class="block text-xs text-right text-base-200 underline"
          target="_blank"
          rel="noreferrer"
          href={"https://" +
            idToChain[$chainId] +
            ".blockscout.com/tx/" +
            pt.hash}
        >
          View on Explorer
        </a>
      {/if}
    </div>
  </div>
{/each}

<!-- {#if $resolvedTransactions[lastResolvedIndex] && !!$resolvedTransactions[lastResolvedIndex].resolved && $resolvedTransactions[lastResolvedIndex].status == 1}
  <div class="toast z-10">
    <div class="alert alert-success flex space-x-2">
      
    </div>
  </div>
{/if} -->

<WalletDrawer />
<div class="drawer">
  <input id="app-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="fixed w-full p-4 z-10">
      <div class="justify-between navbar">
        {#if homepage}
          <div class="flex items-center w-content mr-8"></div>
          <div
            class="lg:w-2/3 flex justify-between items-center rounded-full shadow-sm shadow-base-content bg-opacity-50 lg:bg-gradient min-h-0 px-4"
          >
            <a href={"/"} class="flex w-1/2 items-center">
              <Logo />
            </a>
            <div class="flex space-x-4">
              <a
                href="https://sf-doc.vercel.app"
                class="p-1 rounded-md text-base-content hover:text-primary"
                >Documentation</a
              >
              <a
                href="/swap"
                class="p-1 rounded-md flex lg:space-x-1 hover:text-primary"
              >
                <span>App</span></a
              >
            </div>
          </div>
          <div />
          <!-- <Theme /> -->
        {:else}
          <div class="flex items-center w-content h-8 mr-8 w-1/5">
            <div class="flex-none lg:hidden">
              <label
                for="app-drawer"
                aria-label="open sidebar"
                class="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block w-6 h-6 stroke-primary"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  /></svg
                >
              </label>
            </div>
            <a href={"/"} class="items-center hidden lg:flex">
              <Logo />
            </a>
          </div>
          <div class="flex-none hidden lg:block">
            <ul
              class="menu menu-md menu-horizontal bg-gradient rounded-full shadow-sm shadow-base-content bg-opacity-50 lg:bg-gradient p-0"
            >
              <!-- Navbar menu content here -->
              <li>
                <a
                  href="/wallet"
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/wallet")}
                  class:selected={$page.route?.id?.startsWith("/wallet")}
                  >Wallet</a
                >
              </li>
              <li>
                <a
                  href={`/swap/`}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/swap")}
                  class:selected={$page.route?.id?.startsWith("/swap")}>Swap</a
                >
              </li>
              <li>
                <a
                  href={`/earn/`}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/earn")}
                  class:selected={$page.route?.id?.startsWith("/earn")}>Earn</a
                >
              </li>
              <li>
                <a
                  href={`/faucet/`}
                  class="rounded-full"
                  class:hidden={!$connected || $chainId != 63}
                  class:text-primary={$page.route?.id?.startsWith("/faucet")}
                  class:selected={$page.route?.id?.startsWith("/faucet")}
                  >Faucet</a
                >
              </li>
            </ul>
          </div>
          <div class="space-x-4 lg:w-1/5 flex justify-end">
            <Wallet />
            <Theme />
          </div>
        {/if}
      </div>
    </div>
    <div class="root h-screen" class:bg={homepage}>
      <slot />
    </div>
  </div>
  <div class="drawer-side">
    <label
      for="app-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
      bind:this={overlay}
    />
    <aside class="bg-base-100 min-h-screen w-80">
      <div
        class="bg-base-100 grid-row-2 sticky top-0 z-10 grid w-full gap-y-2 bg-opacity-90 px-2 py-3 backdrop-blur"
      />
      <div class="h-4" />
      <ul class="menu px-4 py-0">
        <li>
          <details id="disclosure-docs" open="true">
            <summary class="group"
              ><span><Logo width="2rem" height="2rem" /></span> App</summary
            >
            <ul on:click={(_) => overlay.click()}>
              <li>
                <a href="/wallet"> Wallet </a>
              </li>
              <li>
                <a href="/swap">
                  <span>Swap</span>
                </a>
              </li>
              <li>
                <a href="/earn" class="group">
                  <span>Earn</span>
                </a>
              </li>
              <li>
                <a href="/faucet" class="group">
                  <span>Faucet</span>
                </a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details id="disclosure-docs" open="">
            <summary class="group"
              ><span
                ><svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  class="text-info h-5 w-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M5 7H16C20.4183 7 24 10.5817 24 15V42C24 38.6863 21.3137 36 18 36H5V7Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linejoin="bevel"
                  /><path
                    d="M43 7H32C27.5817 7 24 10.5817 24 15V42C24 38.6863 26.6863 36 30 36H43V7Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linejoin="bevel"
                  /></svg
                ></span
              > Docs</summary
            >
            <ul on:click={(_) => overlay.click()}>
              <li>
                <a href={docurl + "/general-overview/what-is-stup&flip"}>
                  <span>General Overview</span>
                </a>
              </li>
              <ul>
                <li>
                  <a
                    href={docurl + "/general-overview/what-is-stup&flip"}
                    class="group"
                  >
                    <span>What is Stip & Flip</span>
                  </a>
                </li>
                <li>
                  <a
                    href={docurl + "/general-overview/key-points"}
                    class="group"
                  >
                    <span>Key Points</span>
                  </a>
                </li>
              </ul>
            </ul>
            <ul>
              <li>
                <a href={docurl + "/protocol-rules/pools"}>
                  <span>Protocol Rules</span>
                </a>
              </li>
              <ul>
                <li>
                  <a href={docurl + "/protocol-rules/pools"} class="group">
                    <span>Pools</span>
                  </a>
                </li>
                <li>
                  <a href={docurl + "/protocol-rules/swap-fees"} class="group">
                    <span>Swap fees</span>
                  </a>
                </li>
                <li>
                  <a
                    href={docurl + "/protocol-rules/funding-rate"}
                    class="group"
                  >
                    <span>Funding Rate</span>
                  </a>
                </li>
                <li>
                  <a href={docurl + "/protocol-rules/positions"} class="group">
                    <span>Positions</span>
                  </a>
                </li>
                <li>
                  <a href={docurl + "/protocol-rules/token"} class="group">
                    <span>S&F tokens</span>
                  </a>
                </li>
              </ul>
            </ul>
          </details>
        </li>
      </ul>
    </aside>
  </div>
</div>

<style>
  .selected {
    background: hsl(var(--bc) / 0.08);
  }
</style>
