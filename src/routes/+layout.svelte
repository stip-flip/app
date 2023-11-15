<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import autoAnimate from "@formkit/auto-animate";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import Logo from "src/components/logo.svelte";
  import Wallet from "src/components/wallet.svelte";
  import Theme from "src/components/theme.svelte";
  import { pendingTransactions, transactions } from "src/hooks/blocknumber";
  import { chainId, defaultEvmStores, connected } from "svelte-ethers-store";
  import WalletDrawer from "src/components/wallet-drawer.svelte";
  let theme = "dark";
  let toggled = false;

  let overlay: HTMLAreaElement;

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

  $: homepage = $page.route.id == "/";

  let docurl = "https://sf-doc.vercel.app/docs";
</script>

<WalletDrawer />
<div class="drawer">
  <input id="app-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="w-full justify-between navbar bg-transparent fixed">
      {#if homepage}
        <div class="flex items-center w-content h-8 mr-8">
          <a href={"/"} class="flex items-center">
            <Logo />
          </a>
        </div>
        <div class="w-1/4 flex justify-end items-center space-x-4">
          <a
            href="https://sf-doc.vercel.app"
            class="btn-info font-bold p-1 px-2 rounded-md">Documentation</a
          >
          <a
            href="/swap"
            class="btn-primary font-bold p-1 px-2 rounded-md flex lg:space-x-1"
            ><span class="hidden lg:inline-block">Launch</span>
            <span>App</span></a
          >
          <Theme />
        </div>
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
          <ul class="menu menu-horizontal">
            <!-- Navbar menu content here -->
            <li>
              <a
                href="/wallet"
                class="text-lg"
                class:underline={$page.route?.id?.startsWith("/wallet")}
                >Wallet</a
              >
            </li>
            <li>
              <a
                href={`/swap/`}
                class="text-lg"
                class:underline={$page.route?.id?.startsWith("/swap")}>Swap</a
              >
            </li>
            <li>
              <a
                href={`/earn/`}
                class="text-lg"
                class:underline={$page.route?.id?.startsWith("/earn")}>Earn</a
              >
            </li>
            <li>
              <a
                href={`/faucet/`}
                class="text-lg"
                class:underline={$page.route?.id?.startsWith("/faucet")}
                >Faucet</a
              >
            </li>
          </ul>
        </div>
        <div class="space-x-4 w-1/5 flex justify-end">
          <Wallet />
          <Theme />
        </div>
      {/if}
    </div>
    <div class="root h-screen">
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
