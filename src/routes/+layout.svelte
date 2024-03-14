<script lang="ts">
  import "driver.js/dist/driver.css";
  import "../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  import Logo from "src/components/logo.svelte";
  import Theme from "src/components/theme.svelte";
  import WalletDrawer from "src/components/wallet-drawer.svelte";
  import Wallet from "src/components/wallet.svelte";
  import { pendingTransactions, transactions } from "src/hooks/blocknumber";
  import { connectMetamask } from "src/lib";
  import { chainId } from "svelte-ethers-store";
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Icon from "@iconify/svelte";
  import { appState } from "src/stores";
  let theme = "dark";
  let toggled = false;

  let overlay: HTMLAreaElement;

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

  $: homepage = $page.route.id == "/";

  let docurl = "https://sf-doc.vercel.app/docs";

  const idToChain: any = {
    1: "mainnet",
    5: "goerli",
    61: "etc",
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
    <div class="alert alert-info block">
      <div class="text-base-200">{pt.label}</div>
      <progress class="progress w-56" />
      <a
        class="block text-xs text-right text-base-200 underline"
        target="_blank"
        rel="noreferrer"
        href={"https://" + idToChain[$chainId] + ".etherscan.io/tx/" + pt.hash}
      >
        View on Explorer
      </a>
    </div>
  </div>
{/each}

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
          <Theme />
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
              class="menu menu-horizontal bg-gradient rounded-full shadow-sm shadow-base-content bg-opacity-50 lg:bg-gradient p-0"
            >
              <!-- Navbar menu content here -->
              <li>
                <a
                  href="/wallet"
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/wallet")}
                  >Wallet</a
                >
              </li>
              <li>
                <a
                  href={`/swap/`}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/swap")}
                  >Swap</a
                >
              </li>
              <li>
                <a
                  href={`/earn/`}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/earn")}
                  >Earn</a
                >
              </li>
              <li>
                <a
                  href={`/faucet/`}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/faucet")}
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
    {#if !homepage}
      <!-- Help Button -->
      <div class="fixed bottom-0 right-0 flex items-center p-4">
        <Icon icon="mdi:help" class="h-12 w-12 p-2 text-primary"></Icon>
        <input
          type="checkbox"
          class="toggle toggle-primary"
          bind:checked={$appState.help}
        />
      </div>
    {/if}
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
